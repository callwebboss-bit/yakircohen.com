/**
 * קוד פנייה (החלטת הבעלים D67, שהיא D36 בפועל, 7.10.2026): ארבעה תווים בשורה
 * האחרונה של הודעת הוואטסאפ מהאתר, "קוד פנייה: A7K2", במקום שורת [YC:...]
 * הארוכה שהלקוח ראה ושלח. אותו קוד נכנס למייל לבעלים, לאישור ההזמנה (YC-A7K2
 * ב-lib/sales/voucher.ts) ולמורנינג.
 *
 * מודול בלי ייבוא בכלל: הוא נטען בכל עמוד דרך המאזין ללחיצות וואטסאפ.
 */

/* בלי 0, O, 1, I ו-L: מקריאים את הקוד בטלפון ומקלידים אותו במורנינג */
export const LEAD_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const LEAD_CODE_LENGTH = 4;
export const LEAD_CODE_LABEL = "קוד פנייה";

const CODE_RE = new RegExp(`^[${LEAD_CODE_ALPHABET}]{${LEAD_CODE_LENGTH}}$`);
/* שורת הקוד בכל מקום בטקסט. האימות מול האלפבית אחרי המרה לאותיות גדולות */
const LINE_RE = new RegExp(`${LEAD_CODE_LABEL}\\s*:\\s*([A-Za-z0-9]{${LEAD_CODE_LENGTH}})(?![A-Za-z0-9])`, "g");
/* שורה שכולה קוד פנייה, להחלפה בקוד אחר */
const WHOLE_LINE_RE = new RegExp(`^\\s*${LEAD_CODE_LABEL}\\s*:.*$`);

function defaultRandom(): number {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const buffer = new Uint32Array(1);
    cryptoApi.getRandomValues(buffer);
    return buffer[0] / 0x100000000;
  }
  return Math.random();
}

/** "A7K2": ארבעה תווים בלי תווים שמתבלבלים */
export function generateLeadCode(random: () => number = defaultRandom): string {
  let code = "";
  for (let i = 0; i < LEAD_CODE_LENGTH; i += 1) {
    const index = Math.floor(random() * LEAD_CODE_ALPHABET.length);
    code += LEAD_CODE_ALPHABET[Math.min(LEAD_CODE_ALPHABET.length - 1, Math.max(0, index))];
  }
  return code;
}

/** "a7k2" הופך ל-"A7K2". קוד עם תו לא מהאלפבית, או באורך אחר, מחזיר null. */
export function normalizeLeadCode(text: unknown): string | null {
  if (typeof text !== "string") return null;
  const code = text.trim().toUpperCase();
  return CODE_RE.test(code) ? code : null;
}

/** "קוד פנייה: A7K2" */
export function formatLeadCodeLine(code: string): string {
  return `${LEAD_CODE_LABEL}: ${code}`;
}

/** הקוד מהשורה "קוד פנייה: XXXX". כמה שורות: האחרונה, כי האתר כותב אותה בסוף. */
export function findLeadCode(text: string | null | undefined): string | null {
  let found: string | null = null;
  for (const match of (text ?? "").matchAll(LINE_RE)) {
    found = normalizeLeadCode(match[1]) ?? found;
  }
  return found;
}

/** הטקסט עם שורת קוד אחת בסוף. שורת קוד קודמת יורדת, כדי שלא יהיו שני קודים. */
export function withLeadCodeLine(text: string, code: string): string {
  const lines = text.split("\n").filter((line) => !WHOLE_LINE_RE.test(line));
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  return [...lines, formatLeadCodeLine(code)].join("\n");
}
