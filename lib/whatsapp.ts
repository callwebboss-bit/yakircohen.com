import { CONTACT_PHONE_WHATSAPP } from "@/lib/constants";
import { findLeadCode, generateLeadCode, withLeadCodeLine } from "@/lib/lead-code";

/* נושא שכבר פותח בברכה הוא הודעה מוכנה מנתוני השירות ("שלום, מעוניין/ת
   ב..."). עד 6.10.2026 היא נעטפה בפתיחה שנייה, והלקוח שלח "שלום, אשמח לשמוע
   על שלום, מעוניין..." (תוכנית עמדת המכירות, סעיף 8). רק מילת ברכה שאחריה
   פסיק או רווח, כדי ש"הילוך" או "היין" לא ייתפסו כברכה. */
const GREETING_START = /^(?:שלום|היי|הי|אהלן)[,\s]/;

/** Standard inquiry line - always names the service or package on the page.
 *  When startingPrice is provided it appends the starting price so the client
 *  enters the conversation already knowing what to expect.
 *  A subject that already opens with a greeting is used as-is, without a second greeting.
 */
export function buildServiceWhatsAppText(subject: string, startingPrice?: string): string {
  const trimmed = subject.trim();
  const base = GREETING_START.test(trimmed)
    ? trimmed
    : `שלום, אשמח לשמוע על ${trimmed || "השירות"}`;
  return startingPrice ? `${base} - מחיר: ${startingPrice}` : base;
}

/*
 * שם העמוד בעברית בהודעת הלקוח (החלטת הבעלים D94, 11.10.2026).
 * עד היום הלקוח שלח "📍 מקור: studio/recording-song-modiin" באנגלית. עכשיו
 * הוא שולח "מהעמוד: הקלטת שיר", ומקור שאין לו שם כאן לא נשלח בכלל: השירות
 * כבר כתוב בהודעה, קוד הפנייה בשורה האחרונה, והמקור המלא נשאר בתג [YC:]
 * שבמייל לבעלים. quote הוא ההמשך של "שלום, אשמח להצעת מחיר" בכפתור הכללי
 * שבראש ובתחתית כל עמוד. הקלוזר המקומי
 * (local-tools/lead-message-parser.js, PAGE_NAME_TO_PATH) מתרגם את השמות
 * בחזרה לנתיב, אז שם ששונה כאן משתנה גם שם.
 */
type PageLabel = { prefix: string; page: string; quote: string | null };

const PAGE_LABELS: readonly PageLabel[] = [
  { prefix: "studio/recording-song-modiin/gifts", page: "שיר במתנה", quote: "לשיר במתנה" },
  { prefix: "studio/recording-song-modiin", page: "הקלטת שיר", quote: "להקלטת שיר" },
  { prefix: "studio/blessings", page: "ברכה מוקלטת", quote: "להקלטת ברכה" },
  { prefix: "studio/mobile-studio", page: "אולפן נייד", quote: "לאולפן נייד" },
  { prefix: "studio/pricing", page: "מחירון האולפן", quote: null },
  { prefix: "studio", page: "אולפן ההקלטות", quote: "לאולפן ההקלטות" },
  { prefix: "podcast/podcast-studio-modiin", page: "אולפן פודקאסט", quote: "להקלטת פודקאסט" },
  { prefix: "podcast/podcast-production", page: "הפקת פודקאסט", quote: "להפקת פודקאסט" },
  { prefix: "podcast/podcast-recording", page: "צילום פודקאסט", quote: "להקלטת פודקאסט" },
  { prefix: "podcast", page: "פודקאסט", quote: "להקלטת פודקאסט" },
  { prefix: "podcast/mobile-podcast-at-home", page: "פודקאסט בבית", quote: "להקלטת פודקאסט בבית" },
  { prefix: "podcast/podcast-editing", page: "עריכת פודקאסט", quote: "לעריכת פודקאסט" },
  { prefix: "matanot", page: "מתנות", quote: "לשיר במתנה" },
  { prefix: "shop", page: "חנות השוברים", quote: "לשובר מתנה" },
  { prefix: "events/attractions/wedding-smoking-machine/heavy-smoke-large-events", page: "עשן כבד", quote: "לעשן כבד באירוע" },
  { prefix: "events/attractions/wedding-smoking-machine", page: "מכונת עשן", quote: "למכונת עשן לאירוע" },
  { prefix: "events/attractions/bubble-machine", page: "מכונת בועות", quote: "למכונת בועות לאירוע" },
  { prefix: "events/attractions/confetti-cannon", page: "תותח קונפטי", quote: "לתותח קונפטי לאירוע" },
  { prefix: "events/attractions", page: "אטרקציות לאירוע", quote: "לאטרקציה לאירוע" },
  { prefix: "events/dj-events", page: "DJ לאירועים", quote: "ל-DJ לאירוע" },
  { prefix: "dj-events", page: "DJ לאירועים", quote: "ל-DJ לאירוע" },
  { prefix: "events", page: "אירועים", quote: "לאירוע" },
  { prefix: "photography", page: "צילום", quote: "לצילום" },
  { prefix: "voiceover", page: "קריינות", quote: "לקריינות" },
  { prefix: "online", page: "שירותים אונליין", quote: null },
  { prefix: "business", page: "לעסקים", quote: null },
  { prefix: "academy", page: "אקדמיה", quote: null },
  { prefix: "pricing", page: "מחירון", quote: null },
  { prefix: "book", page: "הזמנה מקוונת", quote: null },
  { prefix: "contact", page: "צור קשר", quote: null },
];

/** "/studio/x/?a#b" או "studio/x" או "pricing-hero" -> "studio/x" / "pricing-hero" */
function normalizePagePath(value: string): string {
  return value
    .trim()
    .split(/[?#]/)[0]
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

/* התחילית הארוכה נבדקת קודם, בלי תלות בסדר הכתיבה ברשימה */
const PAGE_LABELS_LONGEST_FIRST = [...PAGE_LABELS].sort((a, b) => b.prefix.length - a.prefix.length);

function pageLabelFor(value: string): PageLabel | null {
  const path = normalizePagePath(value);
  if (!path) return null;
  return (
    PAGE_LABELS_LONGEST_FIRST.find(
      ({ prefix }) =>
        path === prefix ||
        path.startsWith(`${prefix}/`) ||
        /* מקורות כמו pricing-hero ו-pricing_toggle שייכים לעמוד המחירון */
        (!path.includes("/") && (path.startsWith(`${prefix}-`) || path.startsWith(`${prefix}_`))),
    ) ?? null
  );
}

/** שורת המקור בהודעת הלקוח, או null כשאין לעמוד שם בעברית */
export function customerSourceLine(source: string): string | null {
  const label = pageLabelFor(source);
  return label ? `מהעמוד: ${label.page}` : null;
}

/** ההודעה מהכפתור הכללי "הצעה" בראש ובתחתית העמוד, לפי העמוד (D94) */
export function pageQuoteText(pathname: string): string {
  const quote = pageLabelFor(pathname)?.quote;
  return quote ? `שלום, אשמח להצעת מחיר ${quote}.` : GENERAL_QUOTE_TEXT;
}

/** ההודעה הכללית, בלי הבטחת זמן: ההבטחה כתובה על הכפתור עצמו (D94) */
export const GENERAL_QUOTE_TEXT = "שלום, אשמח להצעת מחיר.";

/** סימון על קישור שההודעה שלו נקבעת לפי העמוד ברגע הלחיצה */
export const PAGE_QUOTE_ATTR = "data-wa-page-quote";

const SOURCE_LINE = /^📍\s*מקור:\s*(.*)$/;

/*
 * שורות פנימיות שנבנות ב-buildClosingMessage (lib/whatsapp-closing.ts) בשביל
 * הבעלים, ושאסור שהלקוח ישלח מהטלפון שלו: "ליד פרימיום", דגלי תזמון ושורת
 * "כוונה" (LF-06). המייל לבעלים מקבל את הגוף המלא בנפרד בכל נקודת קריאה,
 * ולכן שם הן נשארות. גם תג [YC:...] יורד כאן: במקומו הלקוח שולח "קוד פנייה:
 * XXXX" בשורה האחרונה, והתג המלא נשאר רק במייל לבעלים (החלטת הבעלים D67,
 * 7.10.2026). הסינון לפי שורה שלמה בלבד, כדי לא לגעת בטקסט שהלקוח כתב.
 */
const CUSTOMER_HIDDEN_LINES = new Set([
  "🚨 ליד פרימיום",
  "⏰ דחוף",
  "📆 תוך חודש",
  "🗓️ גמיש",
  "🔭 עתידי",
]);
const CUSTOMER_HIDDEN_PREFIXES = ["*כוונה:* "];
/* התג נבנה תמיד בשורה משלו (appendYcLeadTag), אבל מסירים אותו גם מתוך שורה */
const YC_TAG_ANYWHERE = /\[YC:[^\]]*\]/g;

/** מסיר מהודעת הלקוח את השורות הפנימיות ואת תג [YC:]. טהורה. */
export function toCustomerWhatsAppText(text: string): string {
  const hadTag = text.includes("[YC:");
  const hadSource = text.includes("📍");
  const kept = text
    .split("\n")
    .flatMap((line) => {
      const source = line.trim().match(SOURCE_LINE);
      if (source) {
        const hebrew = customerSourceLine(source[1]);
        return hebrew ? [hebrew] : [];
      }
      if (!line.includes("[YC:")) return [line];
      const withoutTag = line.replace(YC_TAG_ANYWHERE, "").trimEnd();
      /* שורה שהייתה רק תג יורדת כולה */
      return withoutTag.trim() ? [withoutTag] : [];
    })
    .filter((line) => {
      const t = line.trim();
      if (CUSTOMER_HIDDEN_LINES.has(t)) return false;
      return !CUSTOMER_HIDDEN_PREFIXES.some((p) => t.startsWith(p));
    });
  /* שורות ריקות שנשארו בראש ההודעה אחרי ההסרה, ובסופה כשהתג היה השורה האחרונה */
  while (kept.length && !kept[0].trim()) kept.shift();
  while ((hadTag || hadSource) && kept.length && !kept[kept.length - 1].trim()) kept.pop();
  return kept.join("\n");
}

export type WhatsAppWidgetProps = {
  text?: string;
  utm_source?: string;
  utm_campaign?: string;
  phone?: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Builds a wa.me deep-link with every dynamic query value passed through
 * `encodeURIComponent` to preserve Hebrew text and prevent URL breakage.
 * Pass `source` (a page path) to append "מהעמוד: ..." in Hebrew (D94), not as a UTM param.
 */
export function buildWhatsAppHref({
  text,
  utm_source,
  utm_campaign,
  phone = CONTACT_PHONE_WHATSAPP,
  source,
}: Pick<
  WhatsAppWidgetProps,
  "text" | "utm_source" | "utm_campaign" | "phone"
> & { source?: string }): string {
  const customerText = text ? toCustomerWhatsAppText(text) : text;
  const sourceLine = source ? customerSourceLine(source) : null;
  let fullText = sourceLine && customerText ? `${customerText}\n\n${sourceLine}` : customerText;
  /* קוד פנייה שכבר בטקסט נשאר השורה האחרונה, גם אחרי שורת המקור (D67) */
  const code = fullText ? findLeadCode(fullText) : null;
  if (fullText && code) fullText = withLeadCodeLine(fullText, code);
  const queryParts: string[] = [];

  if (fullText) {
    queryParts.push(`text=${encodeURIComponent(fullText)}`);
  }
  if (utm_source) {
    queryParts.push(`utm_source=${encodeURIComponent(utm_source)}`);
  }
  if (utm_campaign) {
    queryParts.push(`utm_campaign=${encodeURIComponent(utm_campaign)}`);
  }

  const query = queryParts.join("&");
  return query
    ? `https://wa.me/${encodeURIComponent(phone)}?${query}`
    : `https://wa.me/${encodeURIComponent(phone)}`;
}

/* ─── קוד פנייה בקישור (החלטת הבעלים D67, 7.10.2026) ─── */

const WA_HOSTS = new Set(["wa.me", "api.whatsapp.com"]);

type WhatsAppTextParts = { before: string; after: string; text: string };

/*
 * הטקסט מקישור וואטסאפ לעסק בלבד: wa.me/<המספר של האתר>?text=... קישור שיתוף
 * (wa.me/?text=) או קישור ללקוח מהמייל לבעלים לא מקבלים קוד. הפירוק ידני ולא
 * URLSearchParams, כדי שרווח יישאר %20 כמו ב-buildWhatsAppHref ולא יהפוך ל-+.
 */
function splitBusinessWhatsAppText(href: string): WhatsAppTextParts | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (!WA_HOSTS.has(url.hostname)) return null;
  const phone = url.hostname === "wa.me" ? url.pathname.replace(/\//g, "") : url.searchParams.get("phone") ?? "";
  if (phone !== CONTACT_PHONE_WHATSAPP) return null;
  const queryStart = href.indexOf("?");
  if (queryStart < 0) return null;
  const hashStart = href.indexOf("#", queryStart);
  const queryEnd = hashStart < 0 ? href.length : hashStart;
  const parts = href.slice(queryStart + 1, queryEnd).split("&");
  const index = parts.findIndex((p) => p.startsWith("text="));
  if (index < 0) return null;
  let text: string;
  try {
    text = decodeURIComponent(parts[index].slice("text=".length).replace(/\+/g, "%20"));
  } catch {
    return null;
  }
  if (!text.trim()) return null;
  return {
    before: `${href.slice(0, queryStart + 1)}${parts.slice(0, index).map((p) => `${p}&`).join("")}`,
    after: `${parts.slice(index + 1).map((p) => `&${p}`).join("")}${href.slice(queryEnd)}`,
    text,
  };
}

/** קוד הפנייה שכבר נמצא בהודעה שבקישור, או null */
export function readWhatsAppLeadCode(href: string): string | null {
  const parts = splitBusinessWhatsAppText(href);
  return parts ? findLeadCode(parts.text) : null;
}

/**
 * מוסיף לקישור הוואטסאפ לעסק את השורה "קוד פנייה: XXXX" בסוף ההודעה.
 * בלי code: קוד שכבר בהודעה נשאר (לחיצה שנייה על אותו קישור), אחרת נוצר חדש.
 * עם code: הקוד הזה, כדי שיהיה זהה לקוד שנשלח לבעלים במייל.
 * קישור שאינו לעסק, או בלי טקסט, חוזר כמו שהוא. טהורה חוץ מהמחולל.
 */
export function stampWhatsAppLeadCode(href: string, code?: string): string {
  const parts = splitBusinessWhatsAppText(href);
  if (!parts) return href;
  const existing = findLeadCode(parts.text);
  if (!code && existing) return href;
  const text = withLeadCodeLine(toCustomerWhatsAppText(parts.text), code ?? generateLeadCode());
  return `${parts.before}text=${encodeURIComponent(text)}${parts.after}`;
}

/**
 * מחליף את ההודעה בקישור לעסק בהודעה של העמוד (pageQuoteText). משמש את
 * הכפתור הכללי בתחתית העמוד, שנבנה בשרת פעם אחת לכל האתר ולכן לא יודע
 * באיזה עמוד הוא נמצא. קוד פנייה שכבר בהודעה נשמר. טהורה.
 */
export function withPageQuoteText(href: string, pathname: string): string {
  const parts = splitBusinessWhatsAppText(href);
  if (!parts) return href;
  const code = findLeadCode(parts.text);
  const base = pageQuoteText(pathname);
  const text = code ? withLeadCodeLine(base, code) : base;
  return `${parts.before}text=${encodeURIComponent(text)}${parts.after}`;
}
