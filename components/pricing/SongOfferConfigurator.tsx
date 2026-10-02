"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import { useReportBookWizardLivePrice } from "@/components/booking/BookWizardLivePrice";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadSubmitFallback from "@/components/forms/LeadSubmitFallback";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { CALLBACK_SUCCESS_COPY, TIME_CLAIMS } from "@/lib/data/conversion-copy";
import type { SongAddonId } from "@/lib/data/song-offer-aliases";
import {
  buildSongCallbackPayload,
  nis,
  normalizeSongSelection,
  SONG_OFFER_CALLBACK_FORM_ID,
  songAddonKey,
  type SongOfferQuote,
} from "@/lib/data/song-offer-quote";
import {
  formatPhoneForDisplay,
  maskIsraeliPhoneInput,
  validateIsraeliMobile,
  validatePersonName,
} from "@/lib/form-validation";
import { createSubmissionId, submitLeadToServer } from "@/lib/lead-email-notify";
import { cn } from "@/lib/utils";

/** אותו מבנה כמו SongOfferItemView ב-song-offer.ts, בלי לייבא את הקטלוג */
export type SongOfferConfiguratorItem = {
  id: string;
  label: string;
  description: string;
  exVat: number;
  withVat: number;
  requires: SongAddonId | null;
};

export type SongOfferVariant = "full" | "compact" | "book";

export type SongOfferConfiguratorProps = {
  base: SongOfferConfiguratorItem;
  addons: readonly (SongOfferConfiguratorItem & { id: SongAddonId })[];
  /** כל השילובים החוקיים, מחושבים בשרת, לפי songAddonKey */
  quotes: Readonly<Record<string, SongOfferQuote>>;
  /** נתיב העמוד, נכנס לתג ולמייל */
  source: string;
  variant?: SongOfferVariant;
  /** בחירה התחלתית (למשל קליפ בעמוד הקליפ). ?addons= בכתובת גובר עליה. */
  initialAddonIds?: readonly SongAddonId[];
  giftMode?: boolean;
  /** עוגן בעמוד לדוגמת לפני ואחרי של תיקון הזיופים */
  pitchDemoHref?: string;
  /** עוגן או קישור לדוגמת קליפ מהסשן */
  clipExampleHref?: string;
  className?: string;
};

const ADDONS_PARAM = "addons";
const PITCH_ID: SongAddonId = "song_pitch_coaching";
const CLIP_ID: SongAddonId = "studio_session_clip_edited";

type CallbackState = "closed" | "open" | "submitting" | "success" | "failed";

const inputClass =
  "mt-1.5 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red";

export default function SongOfferConfigurator({
  base,
  addons,
  quotes,
  source,
  variant = "full",
  initialAddonIds = [],
  giftMode = false,
  pitchDemoHref,
  clipExampleHref,
  className,
}: SongOfferConfiguratorProps) {
  const uid = useId();
  const rules = useMemo(
    () => addons.map((a) => ({ id: a.id, requires: a.requires })),
    [addons],
  );
  const [selected, setSelected] = useState<SongAddonId[]>(() =>
    normalizeSongSelection(initialAddonIds, rules),
  );

  /* הבחירה נזכרת ב-?addons= בכתובת. קוראים אותה רק אחרי הטעינה, ב-useEffect
     ולא ב-useSearchParams, כדי שהעמוד יישאר מרונדר מראש בלי גבול Suspense
     (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md:80-86).
     השרת מרנדר את בחירת ברירת המחדל, ולכן גם הקישור בלי JS נכון. */
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(ADDONS_PARAM);
    if (raw == null) return;
    const fromUrl = normalizeSongSelection(raw.split(/[,\s]+/), rules);
    /* פעם אחת אחרי הטעינה, מכתובת שהשרת לא רואה. אין כאן מפל רינדורים */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(fromUrl);
  }, [rules]);

  /* כתיבה לכתובת רק אחרי שהגולש שינה משהו. replaceState משתלב עם הנתב של
     Next (node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md:343-345). */
  const writeUrl = useCallback((ids: readonly string[]) => {
    try {
      const url = new URL(window.location.href);
      if (ids.length) url.searchParams.set(ADDONS_PARAM, ids.join(","));
      else url.searchParams.delete(ADDONS_PARAM);
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {
      /* דפדפן שחוסם את ה-History API: הבחירה פשוט לא נזכרת */
    }
  }, []);

  const quote = quotes[songAddonKey(selected)] ?? quotes.base;

  function toggle(id: SongAddonId, checked: boolean) {
    const next = normalizeSongSelection(
      checked ? [...selected, id] : selected.filter((x) => x !== id),
      rules,
    );
    setSelected(next);
    writeUrl(next);
    const nextQuote = quotes[songAddonKey(next)] ?? quotes.base;
    trackConversion("pricing_calculator_interact", {
      calculator: "song_offer",
      addon: id,
      checked,
      total: nextQuote.totalWithVat,
      source,
    });
  }

  /* בגרסת /book הסרגל הנייד מציג את המחיר החי */
  const livePrice = useMemo(
    () =>
      variant === "book"
        ? {
            totalExVat: quote.totalExVat,
            title: base.label,
            ctaLabel: `שלחו בוואטסאפ · ${nis(quote.totalWithVat)}`,
          }
        : null,
    [variant, quote.totalExVat, quote.totalWithVat, base.label],
  );
  useReportBookWizardLivePrice(livePrice);

  const headingId = `${uid}-heading`;
  const isCompact = variant === "compact";
  const addonsList = (
    <AddonRows
      uid={uid}
      addons={addons}
      selected={selected}
      onToggle={toggle}
      pitchDemoHref={pitchDemoHref}
      clipExampleHref={clipExampleHref}
    />
  );

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-xl rounded-2xl border border-border bg-surface p-4 text-right sm:p-6",
        className,
      )}
      aria-labelledby={variant === "book" ? undefined : headingId}
      role={variant === "book" ? undefined : "group"}
    >
      {variant !== "book" ? (
        <h2
          id={headingId}
          className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
        >
          {giftMode ? "שיר במתנה: בוחרים ושולחים" : "הקלטת שיר: בוחרים ושולחים"}
        </h2>
      ) : null}

      {/* בסיס: תמיד כלול, מוצג נעול ולא כמתג */}
      <div
        className={cn(
          "rounded-xl border-2 border-brand-red/40 bg-background p-4",
          variant !== "book" && "mt-4",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground">{base.label}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="מה כלול">
              {["הקלטה", "מיקס", "מאסטר"].map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-foreground"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
          <span className="shrink-0 rounded-full bg-brand-red/10 px-2.5 py-1 text-xs font-semibold text-brand-red-text">
            <span aria-hidden="true">✓ </span>כלול
          </span>
        </div>
        <p className="mt-3">
          <span className="text-3xl font-bold text-foreground">{nis(base.withVat)}</span>
          <span className="ms-2 text-xs text-muted-foreground">
            כולל מע״מ ({nis(base.exVat)} + מע״מ)
          </span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          תיקון זיופים לא כלול. אפשר להוסיף למטה.
        </p>
      </div>

      {isCompact ? (
        <details className="group mt-4" open={initialAddonIds.length > 0 || undefined}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground">
            הוסיפו תוספות, לא חובה
            <span className="transition-transform group-open:rotate-180" aria-hidden="true">
              ▾
            </span>
          </summary>
          <div className="mt-3">{addonsList}</div>
        </details>
      ) : (
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-foreground">תוספות, לא חובה</legend>
          <div className="mt-2">{addonsList}</div>
        </fieldset>
      )}

      <p
        className={cn(
          "mt-5 rounded-xl bg-background px-4 py-3 text-base font-semibold text-foreground",
          variant === "book" && "hidden sm:block",
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        סה״כ {quote.totalLine}
      </p>

      <p className="mt-3 text-sm text-muted-foreground">
        סשן של שעה באולפן, והשיר אצלכם בסוף הסשן. באתר לא משלמים כלום.
      </p>

      <a
        href={quote.waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#25D366] px-4 text-base font-semibold text-white hover:bg-[#1fb857]"
      >
        שלחו בוואטסאפ · {nis(quote.totalWithVat)}
      </a>
      <BookingWhatsAppPreview
        className="mt-2"
        messageBody={`${quote.messageText}\n${quote.ycTag}`}
      />

      <SongCallback
        quote={quote}
        source={source}
        giftMode={giftMode}
      />
    </div>
  );
}

function AddonRows({
  uid,
  addons,
  selected,
  onToggle,
  pitchDemoHref,
  clipExampleHref,
}: {
  uid: string;
  addons: SongOfferConfiguratorProps["addons"];
  selected: readonly SongAddonId[];
  onToggle: (id: SongAddonId, checked: boolean) => void;
  pitchDemoHref?: string;
  clipExampleHref?: string;
}) {
  return (
    <ul className="space-y-2">
      {addons.map((addon) => {
        const inputId = `${uid}-${addon.id}`;
        const checked = selected.includes(addon.id);
        const blocked = addon.requires != null && !selected.includes(addon.requires);
        const parent = addon.requires
          ? addons.find((a) => a.id === addon.requires)
          : undefined;
        const example =
          addon.id === PITCH_ID && pitchDemoHref
            ? { href: pitchDemoHref, label: "שמעו לפני ואחרי" }
            : addon.id === CLIP_ID && clipExampleHref
              ? { href: clipExampleHref, label: "לדוגמה" }
              : null;
        return (
          <li key={addon.id} className={cn(addon.requires && "ms-6")}>
            <div
              className={cn(
                "rounded-xl border bg-background transition-colors",
                checked ? "border-brand-red/50" : "border-border",
                blocked && "opacity-60",
              )}
            >
              <label
                htmlFor={inputId}
                className={cn(
                  "flex min-h-14 items-start gap-3 p-3",
                  blocked ? "cursor-not-allowed" : "cursor-pointer",
                )}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={checked}
                  disabled={blocked}
                  onChange={(e) => onToggle(addon.id, e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[var(--service-accent,#d42b2b)]"
                  aria-describedby={`${inputId}-desc`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {addon.label}
                  </span>
                  <span id={`${inputId}-desc`} className="mt-0.5 block text-xs text-muted-foreground">
                    {blocked && parent
                      ? `אפשר להוסיף יחד עם ${parent.label}`
                      : addon.description}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  +{nis(addon.withVat)}
                </span>
              </label>
              {example ? (
                <a
                  href={example.href}
                  className="mb-3 ms-11 inline-flex min-h-6 text-xs font-semibold text-brand-red-text underline-offset-4 hover:underline"
                >
                  {example.label}
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "תתקשרו אליי": שם וטלפון בתוך הבלוק, שליחה בחוזה של שלב 1. לעולם לא
 * פותח וואטסאפ בעצמו (PJ-31). הצלחה מחליפה את הטופס, כשל מציג את הדרכים
 * החלופיות של LeadSubmitFallback.
 */
function SongCallback({
  quote,
  source,
  giftMode,
}: {
  quote: SongOfferQuote;
  source: string;
  giftMode: boolean;
}) {
  const uid = useId();
  const nameId = `${uid}-name`;
  const phoneId = `${uid}-phone`;
  const [state, setState] = useState<CallbackState>("closed");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submissionId, setSubmissionId] = useState("");
  const [sentPhone, setSentPhone] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === "open") nameRef.current?.focus();
  }, [state]);

  function open() {
    /* מזהה חדש בכל פעם שהטופס נפתח, וקבוע לניסיונות חוזרים */
    setSubmissionId(createSubmissionId());
    setState("open");
  }

  async function send() {
    const nameCheck = validatePersonName(name);
    const phoneCheck = validateIsraeliMobile(phone);
    const nextErrors = {
      name: nameCheck.ok ? undefined : nameCheck.errors.name,
      phone: phoneCheck.ok ? undefined : phoneCheck.errors.phone,
    };
    setErrors(nextErrors);
    if (!nameCheck.ok || !phoneCheck.ok) return;
    const displayPhone = formatPhoneForDisplay(phoneCheck.normalizedPhone ?? phone);
    setState("submitting");
    const result = await submitLeadToServer(
      buildSongCallbackPayload(quote, {
        name,
        phone: displayPhone,
        source,
        giftMode,
        submissionId,
        honeypot,
      }),
    );
    if (result.ok) {
      trackConversion("book_lead_submit", {
        category: "studio",
        form: SONG_OFFER_CALLBACK_FORM_ID,
      });
      setSentPhone(displayPhone);
      setState("success");
    } else {
      setState("failed");
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void send();
  }

  if (state === "success") {
    return (
      <div className="mt-4 rounded-xl border border-brand-red/30 bg-brand-red/5 p-4" role="status">
        <p className="text-sm font-semibold text-foreground">
          תודה {name.trim()}. נחזור אליכם ל-<span dir="ltr">{sentPhone}</span>,{" "}
          {/* חלון הזמן הקיים, בלי הבטחה חדשה (LF-11) */}
          {TIME_CLAIMS.quoteHour}.
        </p>
        <a
          href={quote.waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-red-text underline-offset-4 hover:underline"
        >
          {CALLBACK_SUCCESS_COPY.whatsappOptional}
        </a>
      </div>
    );
  }

  if (state === "closed") {
    return (
      <button
        type="button"
        onClick={open}
        className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-background px-4 text-base font-semibold text-foreground hover:border-brand-red/40"
        aria-expanded="false"
      >
        תתקשרו אליי
      </button>
    );
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={handleSubmit} noValidate>
      <p className="text-sm font-semibold text-foreground">
        השאירו שם וטלפון, ונחזור אליכם עם הבחירה הזו.
      </p>
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div>
        <label htmlFor={nameId} className="block text-sm font-medium text-foreground">
          שם
        </label>
        <input
          ref={nameRef}
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
          className={cn(inputClass, errors.name && "border-red-400")}
        />
        {errors.name ? (
          <p id={`${nameId}-error`} className="mt-1 text-xs text-red-600">
            {errors.name}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor={phoneId} className="block text-sm font-medium text-foreground">
          טלפון נייד
        </label>
        <input
          id={phoneId}
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(maskIsraeliPhoneInput(e.target.value))}
          placeholder="050-000-0000"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
          className={cn(inputClass, "text-left", errors.phone && "border-red-400")}
        />
        {errors.phone ? (
          <p id={`${phoneId}-error`} className="mt-1 text-xs text-red-600">
            {errors.phone}
          </p>
        ) : null}
      </div>
      {state === "failed" ? (
        <LeadSubmitFallback waHref={quote.waHref} onRetry={() => void send()} />
      ) : (
        <button
          type="submit"
          disabled={state === "submitting"}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-red px-4 text-base font-semibold text-white hover:bg-brand-red-light disabled:opacity-60"
        >
          {state === "submitting" ? "שולחים" : "בקשו שיחה"}
        </button>
      )}
    </form>
  );
}
