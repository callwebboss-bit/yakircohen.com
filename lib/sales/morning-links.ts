/**
 * לינקים לתשלום במורנינג (חשבונית ירוקה), לעמדת המכירות.
 *
 * הלינקים נוצרים ידנית במורנינג (תשלומים > לינקים לתשלום) ונשמרים ב-
 * lib/data/morning-links.json דרך `npm run morning:link`. שלוש שכבות:
 *   deposit  מקדמה 200 ₪ לשמירת תאריך (החלטה D6), לינק קבוע אחד
 *   open     לינק בסכום פתוח עם סכומים קבועים לבחירה, מכסה כל כרטיס בלי לינק משלו
 *   fixed    לינק קבוע לשירות, הלקוח רואה שם ומחיר ולא מקליד סכום
 *
 * הסכום בלינק הוא תמיד כולל מע״מ (זה מה שנגבה), ולכן ליד כל לינק קבוע נשמר
 * inclVat מהיום שבו נוצר. כשהקטלוג זז, `morning:link --check` מסמן את הלינק
 * כלא מעודכן, ואז עורכים אותו במורנינג (ה-URL נשאר) ומריצים שוב עם --price.
 *
 * אין כאן קריאת API: D29 מכניס את ה-API של מורנינג רק אחרי PRIVACY-AUDIT.
 */
import links from "@/lib/data/morning-links.json";
import { catalogWithVat, PRICING_CATALOG, type PriceItem } from "@/lib/data/pricing-catalog";

/* getPriceById זורק על מזהה לא מוכר, וכאן מזהה לא מוכר הוא ממצא, לא תקלה */
function findItem(id: string): PriceItem | undefined {
  return (PRICING_CATALOG as readonly PriceItem[]).find((item) => item.id === id);
}

export type MorningLinkKind = "fixed" | "open" | "deposit";
export type MorningLink = {
  kind: MorningLinkKind;
  url: string;
  /** הסכום שהלינק גובה, או null בסכום פתוח */
  inclVat: number | null;
};
export type MorningLinksFile = {
  updated: string;
  /** "או בהעברה: ..." בהודעה, בניסוח של יקיר. ריק = הכפתור לא מופיע בדלפק */
  bankTransferLine: string;
  deposit: { url: string; inclVat: number };
  open: { url: string };
  cards: Record<string, { url: string; inclVat: number }>;
};

export const MORNING_LINKS_PATH = "lib/data/morning-links.json";
export const MORNING_LINKS: MorningLinksFile = links;

/** דומיינים שלינק תשלום של מורנינג יכול לשבת בהם. לינק אחר נדחה ב---check. */
export const MORNING_LINK_HOSTS = ["greeninvoice.co.il", "morning.co", "grow.co.il", "meshulam.co.il"] as const;

export function isMorningUrl(url: string): boolean {
  let host: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    host = parsed.hostname;
  } catch {
    return false;
  }
  return MORNING_LINK_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

function present(url: string | undefined): url is string {
  return typeof url === "string" && url.trim().length > 0;
}

/** שורת ההעברה הבנקאית של יקיר, או null כשריקה */
export function getBankTransferLine(file: MorningLinksFile = MORNING_LINKS): string | null {
  const line = file.bankTransferLine?.trim();
  return line ? line : null;
}

/** לינק המקדמה (200 ₪, D6), או null עד שייווצר במורנינג */
export function getDepositLink(file: MorningLinksFile = MORNING_LINKS): MorningLink | null {
  return present(file.deposit.url) ? { kind: "deposit", url: file.deposit.url, inclVat: file.deposit.inclVat } : null;
}

/**
 * הלינק לכרטיס: קבוע אם יש, אחרת סכום פתוח, אחרת null.
 * ב"החל מ" אין לינק קבוע (הסכום נסגר בשיחה), תמיד סכום פתוח.
 */
export function getPaymentLink(
  cardId: string,
  { priceFrom = false, file = MORNING_LINKS }: { priceFrom?: boolean; file?: MorningLinksFile } = {},
): MorningLink | null {
  const fixed = file.cards[cardId];
  if (!priceFrom && fixed && present(fixed.url)) return { kind: "fixed", url: fixed.url, inclVat: fixed.inclVat };
  if (present(file.open.url)) return { kind: "open", url: file.open.url, inclVat: null };
  return null;
}

export type MorningLinkIssue = { id: string; problem: string; fix: string };

/** בעיות בקובץ מול הקטלוג: מזהה לא קיים, URL לא ממורנינג, מחיר שזז. ריק = תקין. */
export function checkMorningLinks(file: MorningLinksFile = MORNING_LINKS): MorningLinkIssue[] {
  const issues: MorningLinkIssue[] = [];
  const badUrl = (id: string, url: string) =>
    issues.push({ id, problem: `URL לא ממורנינג: ${url}`, fix: `להעתיק את הלינק מתשלומים > לינקים לתשלום (${MORNING_LINK_HOSTS.join(", ")})` });
  if (present(file.deposit.url) && !isMorningUrl(file.deposit.url)) badUrl("deposit", file.deposit.url);
  if (present(file.open.url) && !isMorningUrl(file.open.url)) badUrl("open", file.open.url);
  for (const [id, entry] of Object.entries(file.cards)) {
    const item = findItem(id);
    if (!item) {
      issues.push({ id, problem: "המזהה לא קיים בקטלוג", fix: "להקפיא את הלינק במורנינג ולהסיר אותו מהקובץ" });
      continue;
    }
    if (!present(entry.url)) {
      issues.push({ id, problem: "URL ריק", fix: `npm run morning:link -- --id ${id} --url <לינק>` });
      continue;
    }
    if (!isMorningUrl(entry.url)) badUrl(id, entry.url);
    const now = catalogWithVat(item.exVat);
    if (entry.inclVat !== now) {
      issues.push({
        id,
        problem: `המחיר בקטלוג ${now} ₪ כולל מע״מ, הלינק נוצר על ${entry.inclVat} ₪`,
        fix: `לערוך את הלינק במורנינג ל-${now} ₪ (ה-URL נשאר) ואז npm run morning:link -- --id ${id} --price ${now}`,
      });
    }
  }
  return issues;
}

/** מה חסר כדי שכל כרטיס יקבל לינק: deposit ו-open. אזהרה, לא כישלון. */
export function missingBaseLinks(file: MorningLinksFile = MORNING_LINKS): ("deposit" | "open")[] {
  const missing: ("deposit" | "open")[] = [];
  if (!present(file.deposit.url)) missing.push("deposit");
  if (!present(file.open.url)) missing.push("open");
  return missing;
}
