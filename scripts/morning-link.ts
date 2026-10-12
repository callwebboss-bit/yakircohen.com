/**
 * morning:link - לינקים לתשלום במורנינג, לעמדת המכירות (lib/data/morning-links.json).
 *
 * הלינק נוצר ידנית במורנינג (תשלומים > לינקים לתשלום), ואז נשמר כאן לפי מזהה
 * הקטלוג. ליד כל לינק קבוע נשמר המחיר כולל מע״מ מהיום שבו נוצר, כדי ש---check
 * יתפוס מחיר שזז בקטלוג (אז עורכים את הלינק במורנינג, ה-URL נשאר, ומריצים --price).
 *
 *   npm run morning:link -- --id song_recording --url https://...   שומר לינק קבוע לשירות
 *   npm run morning:link -- --id deposit --url https://...          לינק המקדמה (200 ₪, D6)
 *   npm run morning:link -- --id open --url https://...             לינק בסכום פתוח
 *   npm run morning:link -- --presets 590,885,1770,3304,5310        הסכומים לבחירה בלינק הפתוח (עד 5)
 *   npm run morning:link -- --id song_recording --price 590         אחרי עדכון המחיר בלינק
 *   npm run morning:link -- --remove song_recording                 אחרי הקפאת הלינק במורנינג
 *   npm run morning:link -- --bank "העברה לבנק ..., אישור בוואטסאפ"  שורת "או בהעברה" להודעה (ריק מסיר)
 *   npm run morning:link -- --list                                  מה שמור, ומה מצב כל לינק
 *   npm run morning:link -- --check                                 נכשל על מזהה לא קיים, URL זר, מחיר שזז
 */
import { readFileSync, writeFileSync } from "node:fs";
import { catalogWithVat, PRICING_CATALOG, type PriceItem } from "../lib/data/pricing-catalog";
import {
  checkMorningLinks,
  isMorningUrl,
  missingBaseLinks,
  MORNING_LINK_HOSTS,
  MORNING_LINKS_PATH,
  type MorningLinksFile,
} from "../lib/sales/morning-links";

/* getPriceById זורק על מזהה לא מוכר, וכאן מזהה לא מוכר הוא ממצא, לא תקלה */
function findItem(id: string): PriceItem | undefined {
  return (PRICING_CATALOG as readonly PriceItem[]).find((item) => item.id === id);
}

const argv = process.argv.slice(2);
const arg = (name: string): string | undefined => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const has = (name: string) => argv.includes(`--${name}`);

const file: MorningLinksFile = JSON.parse(readFileSync(MORNING_LINKS_PATH, "utf8"));
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jerusalem" });

function save(next: MorningLinksFile): void {
  const cards = Object.fromEntries(Object.entries(next.cards).sort(([a], [b]) => a.localeCompare(b)));
  const ordered: MorningLinksFile = {
    updated: today,
    bankTransferLine: next.bankTransferLine ?? "",
    deposit: next.deposit,
    open: next.open,
    cards,
  };
  writeFileSync(MORNING_LINKS_PATH, `${JSON.stringify(ordered, null, 2)}\n`);
  console.log(`  נכתב: ${MORNING_LINKS_PATH}`);
}

function fail(message: string): never {
  console.error(`morning:link - ${message}`);
  process.exit(1);
}

if (has("check") || has("list")) {
  const issues = checkMorningLinks(file);
  const missing = missingBaseLinks(file);
  const fixedCount = Object.values(file.cards).filter((c) => c.url).length;
  console.log(
    `morning:link - מקדמה: ${file.deposit.url ? "יש" : "אין"}, סכום פתוח: ${file.open.url ? "יש" : "אין"}, לינקים קבועים: ${fixedCount}`,
  );
  if (has("list")) {
    for (const [id, entry] of Object.entries(file.cards)) {
      const item = findItem(id);
      const now = item ? catalogWithVat(item.exVat) : null;
      const state = !item ? "לא בקטלוג" : now === entry.inclVat ? "תקין" : `המחיר זז ל-${now}`;
      console.log(`  ${id}: ${entry.inclVat} ₪  ${state}  ${entry.url}`);
    }
  }
  for (const m of missing) {
    console.log(
      m === "deposit"
        ? "  אין לינק מקדמה. לא חובה: רק אם יקיר רוצה מקדמה (D6)."
        : "  חסר: לינק בסכום פתוח. עד שייווצר, לכרטיסים בלי לינק קבוע אין לינק בדלפק.",
    );
  }
  for (const issue of issues) {
    console.log(`  בעיה: ${issue.id}: ${issue.problem}\n    לתקן: ${issue.fix}`);
  }
  if (has("check") && issues.length > 0) process.exit(1);
  process.exit(0);
}

if (argv.includes("--presets")) {
  const list = (arg("presets") ?? "").split(",").map((x) => Number(x.trim())).filter((n) => Number.isFinite(n) && n > 0);
  if (list.length > 5) fail("מורנינג מקבל עד 5 סכומים קבועים");
  file.open = { ...file.open, presets: list };
  console.log(`morning:link - נשמרו ${list.length} סכומים לבחירה: ${list.join(", ")}`);
  save(file);
  process.exit(0);
}

const bank = arg("bank");
if (argv.includes("--bank")) {
  file.bankTransferLine = (bank ?? "").trim();
  console.log(file.bankTransferLine ? "morning:link - נשמרה שורת ההעברה" : "morning:link - שורת ההעברה הוסרה");
  save(file);
  process.exit(0);
}

const remove = arg("remove");
if (remove) {
  if (!(remove in file.cards)) fail(`${remove} לא שמור`);
  delete file.cards[remove];
  console.log(`morning:link - הוסר ${remove}. להקפיא גם את הלינק במורנינג.`);
  save(file);
  process.exit(0);
}

const id = arg("id");
const url = arg("url");
const priceArg = arg("price");
if (!id) fail("חסר --id (מזהה קטלוג, deposit או open). ראו את הכותרת של הקובץ.");
if (url !== undefined && !isMorningUrl(url)) {
  fail(`ה-URL לא נראה כמו לינק של מורנינג (https, אחד מ: ${MORNING_LINK_HOSTS.join(", ")}).`);
}

if (id === "deposit" || id === "open") {
  if (!url) fail(`ל-${id} נדרש --url`);
  if (id === "deposit") file.deposit = { ...file.deposit, url };
  else file.open = { ...file.open, url };
  console.log(`morning:link - נשמר ${id}`);
  save(file);
  process.exit(0);
}

const item = findItem(id);
if (!item) fail(`${id} לא קיים בקטלוג (lib/data/pricing-catalog.ts)`);
const existing = file.cards[id];
if (!url && !existing) fail(`ל-${id} אין עדיין לינק, נדרש --url`);
const catalogIncl = catalogWithVat(item.exVat);
const price = priceArg !== undefined ? Number(priceArg) : url ? catalogIncl : existing.inclVat;
if (!Number.isFinite(price)) fail(`--price לא מספר: ${priceArg}`);
if (price !== catalogIncl) {
  fail(`הקטלוג אומר ${catalogIncl} ₪ כולל מע״מ ל-${id}, לא ${price}. לעדכן את הלינק במורנינג לסכום של הקטלוג ואז לשמור.`);
}
file.cards[id] = { url: url ?? existing.url, inclVat: price };
console.log(`morning:link - נשמר ${id}: ${price} ₪ כולל מע״מ`);
save(file);
