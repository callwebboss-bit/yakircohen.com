/**
 * מחיר לכל משתתף נוסף (החלטת הבעלים 3.10.2026, סבב שלישי): "אנשים מזמינים
 * קבוצות ולא מבינים שכל אדם נוסף זה עוד כסף". המשפט אחד בכל מקום שאפשר להזמין
 * בו קבוצה: טופס השיר, אשף האולפן, פודקאסט ואולפן נייד.
 *
 * הקובץ בלי תלויות (לא קטלוג ולא React), ולכן נטען גם בדפדפן. המחירים עצמם
 * מגיעים מהקטלוג דרך מי שקורא לפונקציות.
 */

/** המשפט היחיד באתר על מחיר המשתתפים */
export const EXTRA_PERSON_COST_NOTE = "כל משתתף נוסף הוא ערוץ הקלטה נוסף ומוסיף למחיר";

function n(amount: number): string {
  return amount.toLocaleString("he-IL");
}

/**
 * "500 + 99 + 99 + 99". מעל 3 תוספות זהות ברצף הן מתקצרות ל-"10 × 99",
 * כדי ש-12 משתתפים לא יהיו שורה של שנים עשר מספרים.
 */
export function formatPriceParts(parts: readonly number[]): string {
  const out: string[] = [];
  let i = 0;
  while (i < parts.length) {
    let j = i;
    while (j + 1 < parts.length && parts[j + 1] === parts[i]) j += 1;
    const run = j - i + 1;
    if (run > 3) {
      out.push(`${run} × ${n(parts[i])}`);
    } else {
      for (let k = 0; k < run; k += 1) out.push(n(parts[i]));
    }
    i = j + 1;
  }
  return out.join(" + ");
}

export type PersonBreakdownInput = {
  /** כמה אנשים בסך הכול */
  count: number;
  /** המחיר שכולל את האדם הראשון (או את הכלולים), לפני מע״מ */
  baseExVat: number;
  /** התוספת לכל אדם נוסף לפי הסדר, לפני מע״מ. אורך = count פחות הכלולים. */
  extrasExVat: readonly number[];
  vatRate: number;
  /** ברירת מחדל: "משתתף אחד" / "N משתתפים" */
  noun?: { one: string; many: string };
};

export type PersonBreakdown = {
  /** "4 משתתפים" */
  head: string;
  /** "590 + 117 + 117 + 117 ₪ כולל מע״מ" */
  withVat: string;
  /** "(500 + 99 + 99 + 99 ₪ + מע״מ)" */
  exVat: string;
  /** "4 משתתפים: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)" */
  line: string;
  /** סכום התוספות לפני מע״מ */
  extrasExVat: number;
};

/**
 * פירוט לפי אדם, כולל מע״מ קודם. כל חלק מעוגל לבד, ולכן מ-6 אנשים ומעלה סכום
 * החלקים כולל מע״מ יכול להיות רחוק בשקל או שניים מהסכום (שמחושב על הכול יחד,
 * כמו בחשבונית). הסכום הנכון הוא תמיד שורת הסה״כ.
 */
export function buildPersonBreakdown(input: PersonBreakdownInput): PersonBreakdown {
  const noun = input.noun ?? { one: "משתתף אחד", many: "משתתפים" };
  const parts = [input.baseExVat, ...input.extrasExVat];
  const vat = (x: number) => Math.round(x * (1 + input.vatRate));
  const head = input.count === 1 ? noun.one : `${input.count} ${noun.many}`;
  const withVat = `${formatPriceParts(parts.map(vat))} ₪ כולל מע״מ`;
  const exVat = `(${formatPriceParts(parts)} ₪ + מע״מ)`;
  return {
    head,
    withVat,
    exVat,
    line: `${head}: ${withVat} ${exVat}`,
    extrasExVat: input.extrasExVat.reduce((sum, x) => sum + x, 0),
  };
}

/** "כל משתתף נוסף: +117 ₪ כולל מע״מ (99 ₪ + מע״מ)" */
export function formatPerPersonPrice(exVat: number, vatRate: number, label = "כל משתתף נוסף"): string {
  return `${label}: +${n(Math.round(exVat * (1 + vatRate)))} ₪ כולל מע״מ (${n(exVat)} ₪ + מע״מ)`;
}
