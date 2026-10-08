import vouchersFile from "@/lib/data/vouchers.json";

export type VoucherRecord = {
  code: string;
  amountNis?: number;
  packageLabel?: string;
  from: string;
  to: string;
  message: string;
  issuedAt: string;
  validUntil: string;
  /** YYYY-MM-DD. קיים רק אחרי שהשובר מומש. בלעדיו הדף ממשיך להציג "בתוקף". */
  redeemedAt?: string;
};

const RECORDS = vouchersFile.vouchers as VoucherRecord[];

/** אותיות גדולות, בלי רווחים, כדי שהקלדה ידנית של הקוד תמצא את הרשומה. */
export function normalizeVoucherCode(raw: string): string {
  return decodeURIComponent(raw).trim().toUpperCase();
}

export function getAllVoucherCodes(): string[] {
  return RECORDS.map((record) => normalizeVoucherCode(record.code));
}

export function findVoucher(rawCode: string): VoucherRecord | null {
  let code: string;
  try {
    code = normalizeVoucherCode(rawCode);
  } catch {
    return null;
  }
  return (
    RECORDS.find((record) => normalizeVoucherCode(record.code) === code) ??
    null
  );
}

/** YYYY-MM-DD לתאריך עברי קריא. אזור זמן קבוע כדי שה-SSR לא יזוז ביום. */
export function formatVoucherDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function isVoucherExpired(record: VoucherRecord, now = new Date()): boolean {
  const end = new Date(`${record.validUntil}T23:59:59Z`);
  return !Number.isNaN(end.getTime()) && end.getTime() < now.getTime();
}

export type VoucherStatus = "valid" | "redeemed" | "expired";

export function getVoucherStatus(record: VoucherRecord, now = new Date()): VoucherStatus {
  if (record.redeemedAt) return "redeemed";
  return isVoucherExpired(record, now) ? "expired" : "valid";
}

/* ---------- הנפקה ואימות ---------- */

/** בלי 0/O ו-1/I כדי שאפשר יהיה להקליד ולהכתיב בלי בלבול. 32 תווים ו-12 מהם בקוד, כלומר 60 סיביות. */
export const VOUCHER_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const VOUCHER_CODE_PATTERN =
  /^YC-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

/** קוד חדש מאקראיות קריפטוגרפית. getRandomValues קיים ב-Node 20+ ובדפדפנים. */
export function generateVoucherCode(
  getRandom: (n: number) => Uint8Array = (n) =>
    globalThis.crypto.getRandomValues(new Uint8Array(n)),
): string {
  const alphabet = VOUCHER_CODE_ALPHABET;
  const chars: string[] = [];
  /* 256 מתחלק ב-32 בלי שארית, ולכן אין הטיה בין התווים. התנאי נשאר למקרה שהאלפבית ישתנה */
  while (chars.length < 12) {
    for (const byte of getRandom(24)) {
      if (chars.length === 12) break;
      if (byte < 256 - (256 % alphabet.length)) {
        chars.push(alphabet[byte % alphabet.length]);
      }
    }
  }
  const joined = chars.join("");
  return `YC-${joined.slice(0, 4)}-${joined.slice(4, 8)}-${joined.slice(8, 12)}`;
}

/** YYYY-MM-DD ועוד N שנים (UTC). 29 בפברואר + 2 שנים נופל על 1 במרץ, כלומר יום מאוחר יותר ולא מוקדם. */
export function addYearsIso(isoDate: string, years: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.toISOString().slice(0, 10);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * שגיאות באוסף רשומות. הבדיקה רצה על vouchers.json האמיתי ב-npm test, כדי ששובר
 * עם קוד קצר, תאריך שגוי, תוקף קצר מהמינימום או כפילות לא יגיע לפריסה.
 */
export function validateVoucherRecords(
  records: readonly VoucherRecord[],
  minYears: number,
): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  records.forEach((r, index) => {
    const at = `רשומה ${index + 1} (${r.code})`;
    if (!VOUCHER_CODE_PATTERN.test(r.code)) {
      errors.push(`${at}: קוד לא בפורמט YC-XXXX-XXXX-XXXX`);
    }
    if (seen.has(r.code)) errors.push(`${at}: קוד כפול`);
    seen.add(r.code);
    if (!r.packageLabel && !(r.amountNis && r.amountNis > 0)) {
      errors.push(`${at}: חסרים packageLabel או amountNis`);
    }
    if (r.from.length > 40 || r.to.length > 40) errors.push(`${at}: שם ארוך מ-40 תווים`);
    if (r.message.length > 220) errors.push(`${at}: הודעה ארוכה מ-220 תווים`);
    for (const field of ["issuedAt", "validUntil", "redeemedAt"] as const) {
      const value = r[field];
      if (value !== undefined && !ISO_DATE.test(value)) {
        errors.push(`${at}: ${field} לא בפורמט YYYY-MM-DD`);
      }
    }
    if (ISO_DATE.test(r.issuedAt) && ISO_DATE.test(r.validUntil)) {
      if (r.validUntil < addYearsIso(r.issuedAt, minYears)) {
        errors.push(`${at}: תוקף קצר מ-${minYears} שנים מההנפקה`);
      }
    }
    if (r.redeemedAt && r.redeemedAt < r.issuedAt) {
      errors.push(`${at}: redeemedAt לפני issuedAt`);
    }
  });
  return errors;
}
