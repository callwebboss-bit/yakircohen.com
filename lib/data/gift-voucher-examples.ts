/**
 * שוברי מתנה לדוגמה לעמוד /matanot. השמות וההודעות להמחשה בלבד.
 * התמונות ב-public/images/matanot/ מצוירות מאותם נתונים בדיוק, בקוד הציור של
 * השובר (lib/gift-voucher-canvas.ts), על ידי scripts/render-voucher-examples.mjs.
 * שינוי טקסט כאן או בעיצוב השובר = להריץ את הסקריפט מחדש.
 * הקובץ בלי imports, כדי שהסקריפט יוכל לטעון אותו ישירות ב-Node.
 */

export type GiftVoucherExample = {
  id: string;
  /** שם האירוע על הכפתור */
  occasion: string;
  /** מזהה החבילה ב-GIFT_VOUCHER_CHOICES בלי הקידומת package- */
  packageId: "half-hour" | "one-hour";
  packageLabel: string;
  to: string;
  from: string;
  message: string;
  /** ההודעה שנשלחת יחד עם התמונה בצ'אט לדוגמה */
  chatText: string;
  chatTime: string;
  imageSrc: string;
};

/** קוד לדוגמה בלבד. קוד אמיתי הוא 12 תווים אקראיים ונוצר רק אחרי תשלום. */
export const GIFT_VOUCHER_EXAMPLE_CODE = "YC-XXXX-XXXX-XXXX";

export const GIFT_VOUCHER_EXAMPLES: readonly GiftVoucherExample[] = [
  {
    id: "birthday",
    occasion: "יום הולדת",
    packageId: "half-hour",
    packageLabel: "חצי שעה באולפן",
    to: "נועה",
    from: "סבא וסבתא",
    message:
      "ליום ההולדת ה-12. בוחרים שיר, נכנסים לחדר ההקלטות ושרים אותו בקול. אוהבים אותך",
    chatText: "נועה, יום הולדת שמח. זו המתנה שלנו בשבילך",
    chatTime: "08:12",
    imageSrc: "/images/matanot/voucher-example-birthday.webp",
  },
  {
    id: "wedding",
    occasion: "חתונה",
    packageId: "one-hour",
    packageLabel: "שעה באולפן",
    to: "מיכל ודניאל",
    from: "החברים מהעבודה",
    message: "שיר שלכם, בקול שלכם, לפני החופה או אחריה. מזל טוב",
    chatText: "מזל טוב לזוג. מכל החברים מהעבודה",
    chatTime: "19:40",
    imageSrc: "/images/matanot/voucher-example-wedding.webp",
  },
  {
    id: "bar-mitzvah",
    occasion: "בר מצווה",
    packageId: "one-hour",
    packageLabel: "שעה באולפן",
    to: "איתי",
    from: "דוד משה ודודה רותי",
    message:
      "לבר המצווה. שעה באולפן להקליט את השיר שאתה הכי אוהב לשיר במקלחת. מזל טוב",
    chatText: "איתי, מזל טוב. מחכים לשמוע את ההקלטה",
    chatTime: "12:05",
    imageSrc: "/images/matanot/voucher-example-bar-mitzvah.webp",
  },
  {
    id: "anniversary",
    occasion: "יום נישואין",
    packageId: "half-hour",
    packageLabel: "חצי שעה באולפן",
    to: "שרית",
    from: "אבי",
    message: "20 שנה ביחד. הפעם את שרה ואני מקשיב. אוהב אותך",
    chatText: "יום נישואין שמח, אהובה שלי",
    chatTime: "21:30",
    imageSrc: "/images/matanot/voucher-example-anniversary.webp",
  },
];
