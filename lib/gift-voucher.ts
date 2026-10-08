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
