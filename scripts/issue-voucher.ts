/**
 * מנפיק שובר: מוסיף רשומה ל-lib/data/vouchers.json עם קוד אקראי ארוך ותוקף שנתיים.
 *
 * שימוש:
 *   npm run voucher:issue -- --package half-hour --from "דנה" --to "אמא" --message "מזל טוב"
 *
 * אחרי ההנפקה: להריץ npm test, לעשות commit ולדחוף. הדף /voucher/<קוד> עולה אחרי הפריסה.
 * לא מנפיקים לפני שהתשלום התקבל ונשלחה חשבונית.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GIFT_VOUCHER_CHOICES, GIFT_VOUCHER_VALIDITY_YEARS } from "../lib/data/gift-voucher";
import {
  addYearsIso,
  generateVoucherCode,
  validateVoucherRecords,
  type VoucherRecord,
} from "../lib/gift-voucher";

const FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../lib/data/vouchers.json",
);

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const pkgId = arg("package");
const choice = GIFT_VOUCHER_CHOICES.find((c) => c.id === `package-${pkgId}`);
if (!choice) {
  console.error(
    `--package חייב להיות אחד מ: ${GIFT_VOUCHER_CHOICES.map((c) => c.id.replace("package-", "")).join(", ")}`,
  );
  process.exit(1);
}
const from = (arg("from") ?? "").trim();
const to = (arg("to") ?? "").trim();
if (!from || !to) {
  console.error("חובה --from ו---to");
  process.exit(1);
}
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date());
const issuedAt = arg("date") ?? today;

const data = JSON.parse(fs.readFileSync(FILE, "utf8")) as {
  _comment: string;
  vouchers: VoucherRecord[];
};
const existing = new Set(data.vouchers.map((v) => v.code));
let code = generateVoucherCode();
while (existing.has(code)) code = generateVoucherCode();

const record: VoucherRecord = {
  code,
  packageLabel: choice.label,
  /* מה ששולם, כולל מע״מ. נשמר ברשומה כדי ששינוי מחיר בקטלוג לא ישנה שובר שהונפק */
  amountNis: choice.amountNis,
  from,
  to,
  message: (arg("message") ?? "").trim(),
  issuedAt,
  validUntil: addYearsIso(issuedAt, GIFT_VOUCHER_VALIDITY_YEARS),
};

const next = { ...data, vouchers: [...data.vouchers, record] };
const errors = validateVoucherRecords(next.vouchers, GIFT_VOUCHER_VALIDITY_YEARS);
if (errors.length) {
  console.error("הרשומה לא עברה אימות:\n" + errors.join("\n"));
  process.exit(1);
}
fs.writeFileSync(FILE, JSON.stringify(next, null, 2) + "\n");
console.log(`הונפק ${code}\nhttps://yakircohen.com/voucher/${code}\nתוקף עד ${record.validUntil}`);
