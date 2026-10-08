/**
 * תיבת ההדבקה בעמדת המכירות: מהודעת וואטסאפ שהגיעה מהאתר לכרטיס הנכון, לבחירה
 * שהלקוח עשה, ולקוד שנכנס לאישור ההזמנה.
 *
 * עד D67 כל הודעה מהאתר נשאה תג [YC:service=...|price=...]. מ-7.10.2026 הלקוח
 * שולח במקומו רק "קוד פנייה: XXXX" (החלטת הבעלים D67), ולכן השירות מזוהה מגוף
 * ההודעה: שורות "מה בחרתי" מטופס השיר, ומילים מול searchTerms של הכרטיסים.
 * הודעות ישנות עם תג עדיין נקראות כמו קודם.
 *
 * מודול טהור בלי React, כדי שהבדיקות יריצו אותו על ספר המכירות האמיתי.
 */
import { SONG_SELECTION_HEADER, SONG_TOTAL_PREFIX } from "@/lib/data/song-offer-quote";
import { findLeadCode } from "@/lib/lead-code";
import type { SalesCard } from "@/lib/sales/sales-book";
import { parseYcLeadTag } from "@/lib/yc-lead-tag";

/* "דיג׳יי" ו"דיגיי", "ש״ח" ו"שח": גרש וגרשיים לא משנים התאמה */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[׳'"״`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

/* ─── קוד ─── */

/* קוד שהלקוח או יקיר כתבו בצורה אחרת: YC-A7K2, "מספר הזמנה A7K2", או code= בתג
   ישן. הבדיקה שהוא תקין (בלי 0, O, 1, I, L) נעשית בדיאלוג, ושם נוצר קוד חדש אם לא */
const LOOSE_CODE_PATTERNS = [
  /(?<![A-Za-z0-9])YC-?([A-Za-z0-9]{4})(?![A-Za-z0-9])/i,
  /(?:קוד|מספר)(?:\s+(?:ה?פנייה|ה?פניה|ה?שובר|ה?הזמנה|ה?אישור))?\s*:?\s*([A-Za-z0-9]{4})(?![A-Za-z0-9])/,
  /[|[](?:code|ref)=(?:YC-?)?([A-Za-z0-9]{4})(?![A-Za-z0-9])/i,
];

/** הקוד מההודעה בצורת אישור ההזמנה, "YC-A7K2". שורת "קוד פנייה" מהאתר קודמת לכל צורה אחרת. */
export function findPasteCode(text: string): string | null {
  const leadCode = findLeadCode(text);
  if (leadCode) return `YC-${leadCode}`;
  for (const pattern of LOOSE_CODE_PATTERNS) {
    const match = pattern.exec(text);
    if (match) return `YC-${match[1].toUpperCase()}`;
  }
  return null;
}

/* ─── מילים ─── */

/* אות שימוש אחת לפני מילה: "בפודקאסט", "לחתונה" */
const HEBREW_PREFIX = "[ובהלמשכ]?";

/* מילה שמופיעה בהודעה כמילה שלמה, גם עם אות שימוש לפניה */
function wordScore(card: SalesCard, body: string): number {
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
function bestByWords(body: string, cards: readonly SalesCard[]): SalesCard | null {
  let best: SalesCard | null = null;
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

/* ─── שורות "מה בחרתי" מטופס השיר ─── */

export type SongSelection = {
  /** שורת הפתיחה ושורת הבסיס, לזיהוי הכרטיס */
  head: string;
  /** שמות השדרוגים כפי שנכתבו בהודעה, בלי הבסיס ובלי שורת המשתתפים */
  addonLabels: string[];
  /** רק כשיש שורת משתתפים, כלומר יותר מהכלולים בבסיס */
  participants: number | null;
  /** הסכום לפני מע״מ משורת הסה״כ */
  totalExVat: number | null;
};

const PARTICIPANTS_LINE = /^•\s*משתתפים:\s*(\d+)/;
const PRICED_LINE = /^•\s*(.+?)\s+-\s+[\d,.]+\s*₪\s*$/;
const TOTAL_EX_VAT = /\(\s*([\d,.]+)\s*₪\s*\+\s*מע״מ\s*\)/;

function parseAmount(text: string): number | null {
  const value = Number(text.replace(/,/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** קורא את שורות הבחירה בפורמט של songSelectionLines. בלי כותרת או בלי סה״כ: null. */
export function parseSongSelection(text: string): SongSelection | null {
  const lines = text.split("\n").map((line) => line.trim());
  const start = lines.indexOf(SONG_SELECTION_HEADER);
  if (start < 0) return null;
  const end = lines.findIndex((line, i) => i > start && line.startsWith(SONG_TOTAL_PREFIX));
  if (end < 0) return null;

  const priced: string[] = [];
  let participants: number | null = null;
  for (const line of lines.slice(start + 1, end)) {
    const people = PARTICIPANTS_LINE.exec(line);
    if (people) {
      participants = Number(people[1]);
      continue;
    }
    const item = PRICED_LINE.exec(line);
    if (item) priced.push(item[1].trim());
  }
  if (priced.length === 0) return null;
  const total = TOTAL_EX_VAT.exec(lines[end]);
  return {
    head: [...lines.slice(0, start), priced[0]].join("\n"),
    addonLabels: priced.slice(1),
    participants,
    totalExVat: total ? parseAmount(total[1]) : null,
  };
}

/*
 * הכרטיס של הבחירה: רק כרטיס שכל השדרוגים בהודעה נמצאים אצלו בשם זהה, ומתוכם
 * זה שהפתיחה ושורת הבסיס הכי מתאימות לו. שמות השדרוגים עצמם לא נספרים
 * כמילים, כי "פודקאסט אישי לפני השיר" היה מושך לכרטיס הפודקאסט.
 */
function cardForSelection(
  selection: SongSelection,
  cards: readonly SalesCard[],
): { card: SalesCard; addonIds: string[] } | null {
  const candidates = cards.filter((card) =>
    selection.addonLabels.every((label) => card.addons.some((a) => a.label.trim() === label)),
  );
  const card = bestByWords(normalizeSearch(selection.head), candidates);
  if (!card) return null;
  const addonIds = selection.addonLabels.flatMap((label) => {
    const addon = card.addons.find((a) => a.label.trim() === label);
    return addon ? [addon.id] : [];
  });
  return { card, addonIds };
}

/* ─── התאמה ─── */

export type PasteMatch = {
  card: SalesCard;
  via: "tag" | "selection" | "words" | "service";
  addonIds: string[];
  participants: number | null;
  seenExVat: number | null;
  todayExVat: number;
  /** הבחירה נבנית מחדש בדיוק (טופס השיר), ולכן אפשר להשוות לה את המחיר */
  exact: boolean;
  /** רק כש-exact: המחיר שהלקוח ראה שונה מאותה בחירה היום. זה ההתרעה "הלקוח ראה מחיר אחר" */
  mismatch: boolean;
  /** המחיר שהלקוח ראה שווה לאחד המחירים בכרטיס: הבסיס, שורת משתתפים, צירוף או הבחירה */
  seenOnCard: boolean;
};
export type PasteResult = { match: PasteMatch | null; code: string | null };

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/* מה הבחירה עולה היום: שורת המשתתפים (או הבסיס) ועוד השדרוגים, לפני מע״מ */
function selectionExVat(card: SalesCard, addonIds: readonly string[], participants: number | null): number {
  const row = participants != null ? card.participants?.find((r) => r.count === participants) : undefined;
  const addons = card.addons.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.exVat, 0);
  return round2((row?.totalExVat ?? card.exVat) + addons);
}

export function matchPaste(text: string, cards: readonly SalesCard[]): PasteResult {
  const code = findPasteCode(text);
  const tag = parseYcLeadTag(text);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const body = normalizeSearch(text.replace(/\[YC:[^\]]*\]/g, " "));

  let card: SalesCard | null = null;
  let via: PasteMatch["via"] = "words";
  let addonIds: string[] = [];
  let wanted: number | null = tag?.recorders ?? null;
  let seen: number | null = tag?.price != null && Number.isFinite(tag.price) && tag.price > 0 ? tag.price : null;
  /* הבחירה נקראה כולה מטופס השיר: מהתג הישן או משורות "מה בחרתי" */
  let songFormFullyRead = false;
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
      songFormFullyRead =
        tag.form === "song_offer" &&
        packageIds[0] === base.id &&
        packageIds.slice(1).every((id) => addonIds.includes(id));
    }
  }
  if (!card) {
    const selection = parseSongSelection(text);
    const picked = selection ? cardForSelection(selection, cards) : null;
    if (selection && picked) {
      card = picked.card;
      via = "selection";
      addonIds = picked.addonIds;
      wanted = selection.participants;
      seen = selection.totalExVat;
      songFormFullyRead = picked.addonIds.length === selection.addonLabels.length;
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
  const participants =
    rows?.length && wanted != null && wanted >= rows[0].count && wanted <= rows[rows.length - 1].count ? wanted : null;
  const today = selectionExVat(card, addonIds, participants);
  /*
   * מתריעים רק כשאפשר לבנות את הבחירה מחדש בדיוק: טופס השיר, שבו יש את הבסיס,
   * השדרוגים ומספר המשתתפים (בתג הישן, או בשורות "מה בחרתי" מאז D67). בונה
   * המחיר של האולפן, מחשבון ה-DJ ומחשבון הפודקאסט כתבו בתג סכום של צירוף שאין
   * לנו את כל חלקיו, והשוואה למחיר הבסיס הייתה מתריעה על מחיר נכון. שם המחיר
   * שהלקוח ראה הוא הערה, וההחלטה אצל יקיר.
   */
  const exact =
    (via === "tag" || via === "selection") && songFormFullyRead && (wanted == null || participants != null);
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
