"use client";

import nextDynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import SalesCard, { type SalesCopyKind } from "@/components/admin/SalesCard";
import type {
  VoucherDialogRequest,
  VoucherFormState,
  VoucherHistoryEntry,
} from "@/components/admin/VoucherDialog";
import { renewAdminSessionIfNeeded } from "@/app/admin/session-actions";
import { formatPrice } from "@/lib/data/pricing-display";
import type { SalesBook, SalesCard as SalesCardData } from "@/lib/sales/sales-book";
import type { VoucherKind } from "@/lib/sales/voucher";
import { parseYcLeadTag } from "@/lib/yc-lead-tag";

/**
 * עמדת המכירות לוואטסאפ (תוכנית עמדת המכירות, סעיפים 1 עד 5): חיפוש שירות,
 * הדבקת הודעה מהאתר שפותחת את הכרטיס הנכון, כרטיסים מהקטלוג, ואישור הזמנה
 * או שובר מתנה.
 *
 * העמוד נבנה בשביל רגע אחד: יקיר באמצע סשן, לקוח מחכה בוואטסאפ. לכן הכרטיס
 * נפתח מההודעה עצמה, כפתור ההעתקה זמין גם כשהכרטיס סגור, והדיאלוג של
 * האישור נטען ברקע מראש.
 */

/* הדיאלוג מושך את ספר המכירות המלא ואת קוד הציור. נטען בחבילה נפרדת, אחרי
   שהעמוד כבר מוצג, כדי שהחיפוש וההעתקה יעבדו מהשנייה הראשונה */
const VoucherDialog = nextDynamic(() => import("@/components/admin/VoucherDialog"), { ssr: false });

const CATEGORY_LABEL: Readonly<Record<string, string>> = {
  studio: "אולפן והקלטות",
  podcast: "פודקאסט",
  events: "אירועים",
  dj: "DJ",
  photography: "צילום",
  online: "שירותים אונליין",
  academy: "אקדמיה וסדנאות",
  pro: "לעסקים ולתקליטנים",
  addons: "תוספות",
};
const CATEGORY_ORDER = ["studio", "podcast", "events", "dj", "photography", "online", "academy", "pro", "addons"];

/* ─── חיפוש ─── */

/* "דיג׳יי" ו"דיגיי", "ש״ח" ו"שח": גרש וגרשיים לא משנים התאמה */
function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[׳'"״`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ─── הדבקת הודעה ─── */

/*
 * מזהה השירות בתג [YC:] הוא לפעמים מזהה של yakir-closer ולא של הקטלוג
 * ("recording" לכל הקלטה באולפן). זה מיפוי אחרון, אחרי מזהה קטלוג בתג
 * ואחרי המילים בהודעה עצמה, כי הוא הכי פחות מדויק.
 */
const CLOSER_SERVICE_CARD: Readonly<Record<string, string>> = {
  recording: "song_recording",
  blessing: "blessing_recording",
  podcast: "podcast_audio",
  podcast_video: "podcast_video",
  podcast_editing: "podcast_editing_hour",
  bulk_podcast: "bulk_podcast_episode",
  mobile_studio_home: "mobile_podcast_at_home",
  dj: "dj_premium",
  effects_only: "event_attraction_1",
  live_sound: "singer_amp_basic",
  studio_hour: "studio_hour",
  dry_hire: "dry_hire_day",
  system_tuning: "system_tuning_ease",
  studio_in_box: "studio_in_box_consult",
  prebuilt_sets: "prebuilt_set_corporate",
  mashup_fixer: "mashup_fixer_express",
  dj_voice_tags: "dj_voice_tag_single",
  bat_mitzvah: "bat_mitzvah_clip",
};

/* קוד אישור או שובר שכבר נמצא בהודעה: YC-A7K2, "קוד פנייה: A7K2", או code= בתג.
   הבדיקה שהוא תקין (בלי 0, O, 1, I, L) נעשית בדיאלוג, ושם נוצר קוד חדש אם לא */
const CODE_PATTERNS = [
  /(?<![A-Za-z0-9])YC-?([A-Za-z0-9]{4})(?![A-Za-z0-9])/i,
  /(?:קוד|מספר)(?:\s+(?:ה?פנייה|ה?פניה|ה?שובר|ה?הזמנה|ה?אישור))?\s*:?\s*([A-Za-z0-9]{4})(?![A-Za-z0-9])/,
  /[|[](?:code|ref)=(?:YC-?)?([A-Za-z0-9]{4})(?![A-Za-z0-9])/i,
];

function findCode(text: string): string | null {
  for (const pattern of CODE_PATTERNS) {
    const match = pattern.exec(text);
    if (match) return `YC-${match[1].toUpperCase()}`;
  }
  return null;
}

/* אות שימוש אחת לפני מילה: "בפודקאסט", "לחתונה" */
const HEBREW_PREFIX = "[ובהלמשכ]?";

/* מילה שמופיעה בהודעה כמילה שלמה, גם עם אות שימוש לפניה */
function wordScore(card: SalesCardData, body: string): number {
  const title = normalizeSearch(card.title);
  let score = 0;
  for (const raw of new Set([card.title, ...card.searchTerms])) {
    const term = normalizeSearch(raw);
    if (term.length < 3 && !/^[a-z]{2}$/.test(term)) continue;
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${HEBREW_PREFIX}${escapeRegExp(term)}(?![\\p{L}\\p{N}])`, "u");
    if (re.test(body)) score += term === title ? term.length * 3 : term.length;
  }
  return score;
}

/* הכי הרבה מילים תואמות. בתיקו הכרטיס הקודם בספר מנצח, כלומר הנפוצים */
function bestByWords(body: string, cards: readonly SalesCardData[]): SalesCardData | null {
  let best: SalesCardData | null = null;
  let bestScore = 2;
  for (const card of cards) {
    const score = wordScore(card, body);
    if (score > bestScore) {
      best = card;
      bestScore = score;
    }
  }
  return best;
}

type PasteMatch = {
  card: SalesCardData;
  via: "tag" | "words" | "service";
  addonIds: string[];
  participants: number | null;
  seenExVat: number | null;
  todayExVat: number;
  /** הבחירה מהתג נבנית מחדש בדיוק (טופס השיר), ולכן אפשר להשוות לה את המחיר */
  exact: boolean;
  /** רק כש-exact: המחיר בתג שונה מאותה בחירה היום. זה ההתרעה "הלקוח ראה מחיר אחר" */
  mismatch: boolean;
  /** המחיר בתג שווה לאחד המחירים בכרטיס: הבסיס, שורת משתתפים, צירוף או הבחירה מהתג */
  seenOnCard: boolean;
};
type PasteResult = { match: PasteMatch | null; code: string | null };

const VIA_LABEL: Record<PasteMatch["via"], string> = {
  tag: "לפי התג מהאתר",
  words: "לפי מילים בהודעה",
  service: "לפי סוג השירות בתג",
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/* מה הבחירה מהתג עולה היום: שורת המשתתפים (או הבסיס) ועוד השדרוגים, לפני מע״מ */
function selectionExVat(card: SalesCardData, addonIds: readonly string[], participants: number | null): number {
  const row = participants != null ? card.participants?.find((r) => r.count === participants) : undefined;
  const addons = card.addons.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.exVat, 0);
  return round2((row?.totalExVat ?? card.exVat) + addons);
}

function matchPaste(text: string, cards: readonly SalesCardData[]): PasteResult {
  const code = findCode(text);
  const tag = parseYcLeadTag(text);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const body = normalizeSearch(text.replace(/\[YC:[^\]]*\]/g, " "));

  let card: SalesCardData | null = null;
  let via: PasteMatch["via"] = "words";
  let addonIds: string[] = [];
  let fullyRead = false;
  if (tag) {
    const packageIds = (tag.package?.split(",") ?? []).map((id) => id.trim()).filter(Boolean);
    const ids = [...packageIds, tag.service.trim()].filter(Boolean);
    const baseId = ids.find((id) => byId.has(id));
    const base = baseId ? byId.get(baseId) : undefined;
    if (base) {
      card = base;
      via = "tag";
      addonIds = ids.filter((id) => id !== base.id && base.addons.some((a) => a.id === id));
      /* טופס השיר כותב בתג את הבסיס ראשון ואחריו רק מזהי שדרוגים (song-offer-quote.ts) */
      fullyRead = packageIds[0] === base.id && packageIds.slice(1).every((id) => addonIds.includes(id));
    }
  }
  card ??= bestByWords(body, cards);
  if (!card && tag) {
    const id = CLOSER_SERVICE_CARD[tag.service];
    const mapped = id ? byId.get(id) : undefined;
    if (mapped) {
      card = mapped;
      via = "service";
    }
  }
  if (!card) return { match: null, code };

  const rows = card.participants;
  const wanted = tag?.recorders ?? null;
  const participants =
    rows?.length && wanted != null && wanted >= rows[0].count && wanted <= rows[rows.length - 1].count ? wanted : null;
  const seen = tag?.price != null && Number.isFinite(tag.price) && tag.price > 0 ? tag.price : null;
  const today = selectionExVat(card, addonIds, participants);
  /*
   * מתריעים רק כשאפשר לבנות את הבחירה מחדש בדיוק: טופס השיר, שבתג שלו הבסיס,
   * השדרוגים ומספר המשתתפים. בונה המחיר של האולפן, מחשבון ה-DJ ומחשבון
   * הפודקאסט כותבים בתג סכום של צירוף שאין לנו את כל חלקיו (עריכה, משתתפים,
   * שדרוגי DJ, זמן נוסף), והשוואה למחיר הבסיס הייתה מתריעה על מחיר נכון. שם
   * מציגים את המחיר שהלקוח ראה כהערה, וההחלטה אצל יקיר.
   */
  const exact = via === "tag" && tag?.form === "song_offer" && fullyRead && (wanted == null || participants != null);
  const same = (value: number) => seen != null && Math.abs(value - seen) < 0.005;
  const known = [
    today,
    card.exVat,
    ...(rows ?? []).map((r) => r.totalExVat),
    ...card.combos.map((c) => c.totalExVat),
  ];
  return {
    match: {
      card,
      via,
      addonIds,
      participants,
      seenExVat: seen,
      todayExVat: today,
      exact,
      mismatch: exact && seen != null && !same(today),
      seenOnCard: known.some(same),
    },
    code,
  };
}

/* ─── שליחה חוזרת: 20 האחרונים בדפדפן ─── */

const HISTORY_KEY = "yc:admin-sales:vouchers:v1";
const HISTORY_MAX = 20;
const EMPTY_HISTORY: VoucherHistoryEntry[] = [];
/* טלפון (9 ספרות ומעלה, עם מקפים או רווחים) לא נשמר גם אם הוקלד לשדה חופשי */
const PHONE_RE = /\+?\d(?:[\s-]?\d){8,}/g;

let historyCache: VoucherHistoryEntry[] | null = null;
const historyListeners = new Set<() => void>();

function isHistoryEntry(value: unknown): value is VoucherHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<VoucherHistoryEntry>;
  return (
    (v.kind === "order" || v.kind === "gift") &&
    typeof v.cardId === "string" &&
    typeof v.cardTitle === "string" &&
    typeof v.code === "string" &&
    typeof v.issuedAt === "string" &&
    typeof v.form === "object" &&
    v.form !== null
  );
}

function readHistory(): VoucherHistoryEntry[] {
  if (historyCache) return historyCache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]");
    historyCache = Array.isArray(parsed) ? parsed.filter(isHistoryEntry).slice(0, HISTORY_MAX) : [];
  } catch {
    historyCache = [];
  }
  return historyCache;
}

function subscribeHistory(listener: () => void): () => void {
  historyListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== HISTORY_KEY) return;
    historyCache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    historyListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function stripPhones(text: string): string {
  return text.replace(PHONE_RE, " ").replace(/\s{2,}/g, " ").trim();
}

function saveHistory(entry: VoucherHistoryEntry): void {
  const form: VoucherFormState = {
    ...entry.form,
    firstName: stripPhones(entry.form.firstName),
    agreed: stripPhones(entry.form.agreed),
    giftTo: stripPhones(entry.form.giftTo),
    giftFrom: stripPhones(entry.form.giftFrom),
    giftTitle: stripPhones(entry.form.giftTitle),
  };
  const clean: VoucherHistoryEntry = { ...entry, form };
  const next = [clean, ...readHistory().filter((e) => !(e.code === clean.code && e.kind === clean.kind))].slice(
    0,
    HISTORY_MAX,
  );
  historyCache = next;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* מצב פרטי או אחסון מלא: הרשימה נשארת רק עד רענון */
  }
  historyListeners.forEach((listener) => listener());
}

/* ביציאה: ברשימה יש שמות פרטיים, נמעני מתנה ו"סיכמנו", והיא יושבת ב-localStorage
   של האתר הציבורי, שכל סקריפט בו (גם GA) יכול לקרוא. יציאה מוחקת אותה. */
function clearHistory(): void {
  historyCache = [];
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* אחסון חסום: אין מה למחוק */
  }
  historyListeners.forEach((listener) => listener());
}

/**
 * כפתור היציאה של עמודי הניהול. היציאה עצמה בשרת (adminLogoutAction מוחק את
 * הקוקי), והטופס מוחק לפני כן את 20 האחרונים מהדפדפן. onSubmit רץ לפני פעולת
 * השרת של הטופס.
 */
export function AdminLogoutForm({ action, className }: { action: () => Promise<void>; className?: string }) {
  return (
    <form action={action} onSubmit={clearHistory}>
      <button
        type="submit"
        className={
          className ??
          "inline-flex min-h-11 items-center rounded-md border border-border px-3 text-sm text-muted-foreground hover:bg-muted/50"
        }
      >
        יציאה
      </button>
    </form>
  );
}

function formatIssued(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem", day: "numeric", month: "numeric" });
}

/* ─── מדידה ─── */

type GtagFn = (...args: unknown[]) => void;

/* בלי פרטים אישיים: רק מזהה הכרטיס. ספירת שימוש שבועית מול הלידים (תוכנית, מעקב) */
function trackCopy(cardId: string): void {
  const w = window as Window & { gtag?: GtagFn };
  w.gtag?.("event", "sales_desk_copy", { card_id: cardId });
}

/* ─── המחיר שהלקוח ראה ─── */

/*
 * שלושה מצבים, ורק אחד מהם התרעה. "הלקוח ראה מחיר אחר" הוא הסימן לא לשלוח
 * /אישור (תוכנית, סעיף 6), ולכן הוא מופיע רק כשהבחירה נבנתה מחדש בדיוק והמחיר
 * באמת השתנה. בכל מקרה אחר המחיר מהתג הוא מידע, לא אזעקה.
 */
function SeenPriceNote({ match, seenExVat }: { match: PasteMatch; seenExVat: number }) {
  const { audience, priceFrom } = match.card;
  const seen = formatPrice(seenExVat, { audience }).headline;
  if (match.mismatch) {
    return (
      <p role="alert" className="rounded-md bg-accent p-2 text-sm font-semibold text-brand-red-text">
        הלקוח ראה מחיר אחר: {seen}. המחיר היום: {formatPrice(match.todayExVat, { audience, from: priceFrom }).headline}
      </p>
    );
  }
  return (
    <p className="rounded-md bg-muted p-2 text-sm text-foreground">
      {match.exact
        ? `המחיר שהלקוח ראה באתר, ${seen}, זהה למחיר היום.`
        : match.seenOnCard
          ? `הלקוח ראה באתר ${seen}. זה אחד המחירים בכרטיס.`
          : `הלקוח ראה באתר ${seen}, לצירוף שהכרטיס לא בונה מחדש. בודקים את הפירוט בהודעה.`}
    </p>
  );
}

/* ─── העמוד ─── */

function scrollToCard(id: string): void {
  /* שתי מסגרות: אחרי שהכרטיס נפתח ואחרי שהחיפוש התנקה */
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      document.getElementById(`sales-card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    ),
  );
}

export default function SalesDesk({ book }: { book: SalesBook }) {
  const { cards } = book;
  const [query, setQuery] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [paste, setPaste] = useState<PasteResult | null>(null);
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set());
  const [openCategories, setOpenCategories] = useState<ReadonlySet<string>>(() => new Set());
  const [request, setRequest] = useState<VoucherDialogRequest | null>(null);
  /* הודעה אחת לקורא מסך לכל העמוד, במקום אזור חי בכל אחד מ-133 הכרטיסים */
  const [announcement, setAnnouncement] = useState("");
  const requestKey = useRef(0);
  const lastScrolled = useRef<string | null>(null);
  const renewed = useRef(false);
  const history = useSyncExternalStore(subscribeHistory, readHistory, () => EMPTY_HISTORY);

  /* חידוש הכניסה פעם אחת בטעינה, כדי שהקוקי לא יפוג באמצע עבודה (סעיף 9) */
  useEffect(() => {
    if (renewed.current) return;
    renewed.current = true;
    renewAdminSessionIfNeeded().catch(() => undefined);
  }, []);

  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);

  const groups = useMemo(() => {
    const rest = new Map<string, SalesCardData[]>();
    for (const card of cards) {
      if (card.featured) continue;
      const list = rest.get(card.category) ?? [];
      list.push(card);
      rest.set(card.category, list);
    }
    const order = [...CATEGORY_ORDER, ...[...rest.keys()].filter((c) => !CATEGORY_ORDER.includes(c))];
    return {
      featured: cards.filter((c) => c.featured),
      categories: order.filter((c) => rest.has(c)).map((c) => ({ category: c, cards: rest.get(c) ?? [] })),
    };
  }, [cards]);

  const results = useMemo(() => {
    const words = normalizeSearch(query).split(" ").filter(Boolean);
    if (words.length === 0) return null;
    return cards.filter((card) => {
      const haystack = normalizeSearch(
        [card.title, CATEGORY_LABEL[card.category] ?? card.category, ...card.searchTerms].join(" "),
      );
      return words.every((word) => haystack.includes(word));
    });
  }, [cards, query]);

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onPasteChange = (text: string) => {
    setPasteText(text);
    const result = text.trim() ? matchPaste(text, cards) : null;
    setPaste(result);
    const id = result?.match?.card.id ?? null;
    if (!id) {
      lastScrolled.current = null;
      return;
    }
    setQuery("");
    setOpenIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
    const category = result?.match?.card.featured ? null : result?.match?.card.category;
    if (category) setOpenCategories((prev) => (prev.has(category) ? prev : new Set(prev).add(category)));
    if (lastScrolled.current !== id) {
      lastScrolled.current = id;
      scrollToCard(id);
    }
  };

  const clearPaste = () => {
    setPasteText("");
    setPaste(null);
    lastScrolled.current = null;
  };

  const onCopy = (cardId: string, what: SalesCopyKind) => {
    trackCopy(cardId);
    const title = byId.get(cardId)?.title ?? "";
    setAnnouncement(what === "message" ? `ההודעה הועתקה: ${title}` : `שורת רק לוודא הועתקה: ${title}`);
  };

  const setCategoryOpen = (category: string, open: boolean) =>
    setOpenCategories((prev) => {
      if (prev.has(category) === open) return prev;
      const next = new Set(prev);
      if (open) next.add(category);
      else next.delete(category);
      return next;
    });

  const openVoucher = (card: SalesCardData, kind: VoucherKind) => {
    requestKey.current += 1;
    const match = paste?.match?.card.id === card.id ? paste.match : null;
    setRequest({
      key: requestKey.current,
      kind,
      card,
      code: paste?.code ?? null,
      codeSource: paste?.code ? "paste" : null,
      form: match ? { addonIds: match.addonIds, participants: match.participants } : undefined,
    });
  };

  const resend = (entry: VoucherHistoryEntry) => {
    const card = byId.get(entry.cardId);
    if (!card) return;
    requestKey.current += 1;
    setRequest({
      key: requestKey.current,
      kind: entry.kind,
      card,
      form: entry.form,
      code: entry.code,
      codeSource: "history",
      issuedAt: entry.issuedAt,
    });
  };

  const match = paste?.match ?? null;
  const highlightId = match?.card.id ?? null;
  const renderCard = (card: SalesCardData) => (
    <SalesCard
      key={card.id}
      card={card}
      open={openIds.has(card.id)}
      highlighted={card.id === highlightId}
      onToggle={toggle}
      onCopy={onCopy}
      onVoucher={openVoucher}
    />
  );

  return (
    <div className="grid gap-5">
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <section className="grid gap-2 rounded-xl border border-border bg-surface p-3 shadow-sm">
        <label htmlFor="sales-paste" className="text-sm font-semibold text-foreground">
          הדביקו הודעה מהאתר
        </label>
        <textarea
          id="sales-paste"
          rows={3}
          value={pasteText}
          onChange={(e) => onPasteChange(e.target.value)}
          placeholder="ההודעה מהוואטסאפ, כולל השורה [YC:...] אם יש"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground"
          aria-describedby="sales-paste-result"
        />
        <div id="sales-paste-result" role="status" aria-live="polite" className="grid gap-1 text-sm">
          {paste && match ? (
            <p className="text-foreground">
              זוהה:{" "}
              <button
                type="button"
                onClick={() => scrollToCard(match.card.id)}
                className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2"
              >
                {match.card.title}
              </button>{" "}
              <span className="text-muted-foreground">({VIA_LABEL[match.via]})</span>
            </p>
          ) : null}
          {paste && !match ? (
            <p className="text-muted-foreground">לא זוהה שירות. חפשו בשורה למטה.</p>
          ) : null}
          {paste?.code ? (
            <p className="text-muted-foreground">
              קוד מההודעה: <span dir="ltr" className="font-mono font-semibold text-foreground">{paste.code}</span>.
              ייכנס לאישור ההזמנה.
            </p>
          ) : null}
        </div>
        {match?.seenExVat != null ? <SeenPriceNote match={match} seenExVat={match.seenExVat} /> : null}
        {pasteText ? (
          <button
            type="button"
            onClick={clearPaste}
            className="inline-flex min-h-11 items-center justify-self-start rounded-md border border-border px-3 text-sm text-muted-foreground hover:bg-muted/50"
          >
            נקה
          </button>
        ) : null}
      </section>

      <div className="grid gap-1">
        <label htmlFor="sales-search" className="sr-only">
          חיפוש שירות
        </label>
        <input
          id="sales-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש: שיר, DJ, סבא"
          enterKeyHint="search"
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-base text-foreground"
        />
      </div>

      {results ? (
        <section aria-label="תוצאות חיפוש" className="grid gap-3">
          <p className="text-sm text-muted-foreground" role="status">
            {results.length ? `${results.length} שירותים` : "לא נמצא. נסו מילה אחת, למשל שיר או DJ."}
          </p>
          {results.map(renderCard)}
        </section>
      ) : (
        <>
          <section aria-labelledby="sales-featured" className="grid gap-3">
            <h2 id="sales-featured" className="text-base font-semibold text-foreground">
              הנפוצים
            </h2>
            {groups.featured.map(renderCard)}
          </section>
          <section aria-labelledby="sales-all" className="grid gap-2">
            <h2 id="sales-all" className="text-base font-semibold text-foreground">
              כל השירותים
            </h2>
            {groups.categories.map(({ category, cards: list }) => (
              <details
                key={category}
                open={openCategories.has(category)}
                onToggle={(e) => setCategoryOpen(category, e.currentTarget.open)}
                className="rounded-xl border border-border bg-background"
              >
                <summary className="flex min-h-12 cursor-pointer items-center justify-between px-3 text-sm font-semibold text-foreground">
                  <span>{CATEGORY_LABEL[category] ?? category}</span>
                  <span className="text-xs font-normal text-muted-foreground">{list.length}</span>
                </summary>
                <div className="grid gap-3 p-3 pt-0">{list.map(renderCard)}</div>
              </details>
            ))}
          </section>
        </>
      )}

      {history.length ? (
        <section aria-labelledby="sales-resend" className="grid gap-2">
          <h2 id="sales-resend" className="text-base font-semibold text-foreground">
            שלח שוב
          </h2>
          <p className="text-xs text-muted-foreground">
            20 האחרונים, שמורים רק בדפדפן הזה. אחרי מקדמה: פותחים, משנים ל״המועד שוריין״ ושולחים באותו קוד.
          </p>
          <ul className="grid gap-1.5">
            {history.map((entry) => {
              const available = byId.has(entry.cardId);
              const who = entry.kind === "gift" ? entry.form.giftTo : entry.form.firstName;
              return (
                <li key={`${entry.kind}-${entry.code}`}>
                  <button
                    type="button"
                    disabled={!available}
                    onClick={() => resend(entry)}
                    className="flex min-h-11 w-full flex-wrap items-center gap-x-2 rounded-md border border-border bg-surface px-3 py-2 text-start text-sm hover:bg-muted/50 disabled:opacity-50"
                  >
                    <span className="font-semibold text-foreground">
                      {entry.kind === "gift" ? "שובר מתנה" : "אישור הזמנה"}
                    </span>
                    <span dir="ltr" className="font-mono text-foreground">
                      {entry.code}
                    </span>
                    <span className="text-muted-foreground">
                      {[entry.cardTitle, who, formatIssued(entry.issuedAt)].filter(Boolean).join(" · ")}
                    </span>
                    {available ? null : <span className="text-xs text-muted-foreground">(השירות כבר לא בקטלוג)</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <VoucherDialog request={request} onClose={() => setRequest(null)} onIssued={saveHistory} />
    </div>
  );
}
