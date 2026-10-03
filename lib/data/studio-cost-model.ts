import { CATALOG_VAT_RATE, SONG_PARTICIPANT_RULES, getExVat } from "@/lib/data/pricing-catalog";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import { absoluteUrl } from "@/lib/site-url";

/* מודל העלות של אולפן מקצועי (עמוד השקיפות).
   כל מספר כאן מגיע מ-docs/transparency/cost-model-sources.md (סעיפים 19.1
   ו-19.2) ומ-docs/transparency/model-status.md. המילים של יקיר מגיעות
   מ-docs/transparency/yakir-voice-studio-costs.md. לפני ששינוי כאן נכנס,
   הוא נכנס קודם למסמכי המקור. מחירי האתר לא נכתבים כאן: הם נגזרים מהקטלוג. */

export const STUDIO_COST_SLUG = "data/recording-studio-costs-2026";
export const STUDIO_COST_PATHNAME = `/${STUDIO_COST_SLUG}`;
export const STUDIO_COST_UPDATED_AT = "2026-10-03";

/* המחיר בכותרת נגזר מהקטלוג, כמו nisEx ב-industry-2026 */
export const STUDIO_COST_TITLE = `כמה עולה להפעיל אולפן הקלטות מקצועי, ולאן הולכים ${Math.round(
  getExVat("song_recording") * (1 + CATALOG_VAT_RATE),
).toLocaleString("he-IL")} ₪ של הקלטת שיר`;
export const STUDIO_COST_DESCRIPTION =
  "פירוק שורה אחרי שורה של מחיר הקלטת שיר: מע״מ, מקום, ציוד, תוכנות, ביטוח וזמן עבודה, לפי מודל של אולפן מקצועי בתל אביב. לכל מספר יש מקור.";

/** סוג המקור, כמו בתוויות של cost-model-sources.md */
export type SourceKind = "official" | "vendor" | "secondary" | "estimate" | "assumption";

export const SOURCE_KIND_LABEL: Record<SourceKind, string> = {
  official: "מקור רשמי",
  vendor: "מחירון ספק",
  secondary: "מקור משני",
  estimate: "הערכה",
  assumption: "הנחת מודל",
};

export type CostLine = {
  label: string;
  /** ₪ לחודש לפני מע״מ, כמו בטבלאות 19.1 ו-19.2 */
  monthly: number;
  formula: string;
  kinds: readonly SourceKind[];
  sourceUrl?: string;
};

export type CostCategory = {
  id: string;
  title: string;
  lines: readonly CostLine[];
};

/* המודל: תל אביב, 24 מ״ר (הקלטה 6, עריכה 4, פודקאסט 9, מעברים 5),
   3 מזגנים, גיבוי כפול. יקיר נעל את F = 6,755.55 ב-3.10.2026. */
export const STUDIO_COST_CATEGORIES: readonly CostCategory[] = [
  {
    id: "space",
    title: "מקום: שכירות וארנונה",
    lines: [
      { label: "שכירות, 24 מ״ר בתל אביב", monthly: 2981.04, formula: "24 × 124.21", kinds: ["secondary", "assumption"], sourceUrl: "https://www.nadlancenter.co.il/article/12969" },
      { label: "ארנונה, סיווג אולפן הקלטות (סמל 905)", monthly: 463.62, formula: "24 × 231.81 / 12", kinds: ["official"], sourceUrl: "https://www.tel-aviv.gov.il/Residents/Arnona/Documents/%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%A6%D7%95%20%D7%94%D7%90%D7%A8%D7%A0%D7%95%D7%A0%D7%94%20%D7%9C%D7%A9%D7%A0%D7%AA%202026.pdf" },
    ],
  },
  {
    id: "services",
    title: "ביטוח, רואה חשבון והנהלת חשבונות",
    lines: [
      { label: "ביטוח עסק", monthly: 291.67, formula: "3,500 / 12", kinds: ["secondary", "assumption"], sourceUrl: "https://www.calcalist.co.il/investing/article/rJtH4N7U00" },
      { label: "רואה חשבון", monthly: 600, formula: "אמצע הטווח 300-900", kinds: ["secondary", "assumption"], sourceUrl: "https://www.greeninvoice.co.il/magazine/%D7%A2%D7%95%D7%A1%D7%A7-%D7%9E%D7%95%D7%A8%D7%A9%D7%94-%D7%A8%D7%95%D7%90%D7%94-%D7%97%D7%A9%D7%91%D7%95%D7%9F/" },
      { label: "תוכנת חשבוניות", monthly: 45, formula: "540 / 12", kinds: ["vendor"], sourceUrl: "https://www.greeninvoice.co.il/pricing/" },
    ],
  },
  {
    id: "equipment",
    title: "ציוד כפול ואבטחה (פחת)",
    lines: [
      { label: "2 מחשבים", monthly: 449.74, formula: "2 × 9,649 / 1.18 × 33% / 12", kinds: ["secondary", "official"], sourceUrl: "https://www.zap.co.il/search.aspx?keyword=mac%20studio" },
      { label: "2 כרטיסי קול", monthly: 117.58, formula: "2 × 5,550 / 1.18 × 15% / 12", kinds: ["vendor", "official"], sourceUrl: "https://www.halilit.com/search/?q=apollo+twin" },
      { label: "2 מיקרופונים", monthly: 53.17, formula: "(1,599 + 3,420) / 1.18 × 15% / 12", kinds: ["secondary", "assumption"], sourceUrl: "https://www.zap.co.il/search.aspx?keyword=sm7b" },
      { label: "מוניטורים", monthly: 25.42, formula: "2 × 1,200 / 1.18 × 15% / 12", kinds: ["secondary"], sourceUrl: "https://www.zap.co.il/search.aspx?keyword=krk" },
      { label: "אוזניות", monthly: 10.57, formula: "2 × 499 / 1.18 × 15% / 12", kinds: ["secondary"], sourceUrl: "https://www.zap.co.il/search.aspx?keyword=ath-m50x" },
      { label: "גיבוי קבצים (NAS ודיסקים)", monthly: 58.72, formula: "(1,690 + 2 × 818) / 1.18 × 25% / 12", kinds: ["secondary", "assumption"], sourceUrl: "https://www.zap.co.il/model.aspx?modelid=1175495" },
      { label: "מסכים", monthly: 29.36, formula: "2 × 630 / 1.18 × 33% / 12", kinds: ["secondary", "assumption"], sourceUrl: "https://www.zap.co.il/search.aspx?keyword=Dell%20P2725H" },
      { label: "סטנדים", monthly: 3.86, formula: "2 × 390 / 1.18 × 7% / 12", kinds: ["secondary"], sourceUrl: "https://www.zap.co.il/models.aspx?sog=e-microphoneaccessories&db3926715=3926840" },
      { label: "כבלים", monthly: 6.48, formula: "6 × 102 / 1.18 × 15% / 12", kinds: ["secondary", "assumption"], sourceUrl: "https://www.zap.co.il/search.aspx?keyword=%D7%9B%D7%91%D7%9C%20XLR%205%20%D7%9E%D7%98%D7%A8" },
      { label: "בקר מקלדת", monthly: 33.58, formula: "3,170 / 1.18 × 15% / 12", kinds: ["secondary"], sourceUrl: "https://www.zap.co.il/models.aspx?sog=g-musicalkeyboard&keyword=komplete+kontrol+s49" },
      { label: "אזעקה ומצלמות", monthly: 102.19, formula: "9,646.59 / 1.18 × 15% / 12", kinds: ["secondary", "assumption"], sourceUrl: "https://www.midrag.co.il/Content/PriceList/1589065" },
      { label: "מטף", monthly: 1.02, formula: "205.5 / 1.18 × 7% / 12", kinds: ["secondary"], sourceUrl: "https://www.d.co.il/priceList-20340/" },
    ],
  },
  {
    id: "software",
    title: "תוכנות, AI ותשתית דיגיטלית",
    lines: [
      { label: "Cubase Pro", monthly: 55.36, formula: "579 € × 3.4419 / 36", kinds: ["vendor", "assumption"], sourceUrl: "https://www.steinberg.net/cubase/" },
      { label: "Melodyne 5 studio", monthly: 72.17, formula: "849 $ × 3.06 / 36", kinds: ["vendor", "assumption"], sourceUrl: "https://shop.celemony.com/cgi-bin/WebObjects/CelemonyShop.woa" },
      { label: "iZotope RX 12 Standard", monthly: 33.91, formula: "399 $ × 3.06 / 36", kinds: ["vendor", "assumption"], sourceUrl: "https://www.izotope.com/en/products/rx.html" },
      { label: "Auto-Tune Unlimited", monthly: 76.5, formula: "300 $ × 3.06 / 12", kinds: ["vendor"], sourceUrl: "https://www.antarestech.com/blog/autotune-evolves-new-pricing-structure" },
      { label: "Waves Ultimate", monthly: 63.75, formula: "249.99 $ × 3.06 / 12", kinds: ["vendor"], sourceUrl: "https://www.waves.com/subscriptions" },
      { label: "UAD Spark", monthly: 38.25, formula: "149.99 $ × 3.06 / 12", kinds: ["vendor"], sourceUrl: "https://www.uaudio.com/blogs/press/ua-native-plugin-now-available" },
      { label: "Claude Pro", monthly: 61.2, formula: "20 $ × 3.06", kinds: ["vendor"], sourceUrl: "https://claude.com/pricing" },
      { label: "Suno Pro", monthly: 24.48, formula: "8 $ × 3.06", kinds: ["vendor"], sourceUrl: "https://suno.com/pricing" },
      { label: "גיבוי בענן", monthly: 25.25, formula: "99 $ × 3.06 / 12", kinds: ["vendor"], sourceUrl: "https://www.backblaze.com/cloud-backup/pricing" },
      { label: "אתר", monthly: 61.2, formula: "20 $ × 3.06", kinds: ["vendor"], sourceUrl: "https://vercel.com/pricing" },
      { label: "דומיין", monthly: 10.42, formula: "125 / 12", kinds: ["vendor"], sourceUrl: "https://www.domainthenet.com/en/tld/co.il.aspx" },
      { label: "אינטרנט", monthly: 166.61, formula: "196.60 / 1.18", kinds: ["vendor", "assumption"], sourceUrl: "https://www.bezeq.co.il/internetandphone/internet/price_rate/" },
      { label: "קו נייד עסקי", monthly: 29, formula: "29", kinds: ["secondary"], sourceUrl: "https://www.kamaze.co.il/Deals/39384/Hot-Mobile/unlimited-business-new" },
    ],
  },
  {
    id: "build",
    title: "בנייה: אקוסטיקה, תקרת עץ, נגישות",
    lines: [
      { label: "קירות ותקרה אקוסטיים", monthly: 333.76, formula: "(77.47 × 425 + 19 × 375) × 10% / 12", kinds: ["secondary", "estimate"], sourceUrl: "https://www.midrag.co.il/content/tip/9303" },
      { label: "תקרת עץ בחדר ההקלטה", monthly: 41.25, formula: "(6 × 1,200 − 6 × 375) × 10% / 12", kinds: ["secondary", "assumption"], sourceUrl: "https://www.midrag.co.il/Content/Tip/19774" },
      { label: "סקר נגישות", monthly: 29.17, formula: "3,500 × 10% / 12", kinds: ["vendor", "assumption"], sourceUrl: "https://www.tmnagish.co.il/%D7%9E%D7%90%D7%9E%D7%A8%D7%99%D7%9D-%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%D7%99%D7%99%D7%9D/%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%99%D7%99%D7%A2%D7%95%D7%A5-%D7%A0%D7%92%D7%99%D7%A9%D7%95%D7%AA" },
    ],
  },
  {
    id: "climate",
    title: "מיזוג וחשמל",
    lines: [
      { label: "חשמל", monthly: 153.17, formula: "284.55 קוט״ש × 0.5383", kinds: ["official", "estimate"], sourceUrl: "https://www.gov.il/BlobFolder/generalpage/tarriffbook/he/sefer_tariff_07_2026.pdf" },
      { label: "3 מזגנים (פחת)", monthly: 73.75, formula: "3 × (1,750 + 300 + 900) × 10% / 12", kinds: ["secondary", "official"], sourceUrl: "https://www.midrag.co.il/Content/Price/9260" },
    ],
  },
  {
    id: "education",
    title: "השכלה",
    lines: [
      { label: "לימודי הנדסאי קול, על פני 10 שנים", monthly: 133.33, formula: "16,000 / 120", kinds: ["secondary", "assumption"], sourceUrl: "https://www.study.co.il/%D7%9C%D7%99%D7%9E%D7%95%D7%93%D7%99-%D7%A1%D7%90%D7%95%D7%A0%D7%93/" },
    ],
  },
] as const;

export const SCENARIO_HOURS = [40, 60, 80] as const;
export const DEFAULT_HOURS = 60;
/** שווי זמן העבודה החודשי במודל. assumption, לא ההכנסה של אדם מסוים */
export const DEFAULT_WORK_VALUE = 12000;
export const ALT_WORK_VALUE = 15000;
/** שעת סשן ועוד 30-60 דקות סביבה, אמצע הטווח (יקיר, 3.10) */
export const SONG_HOURS = 1.75;
/** נקודות זיכוי במודל (assumption, יקיר 3.10) */
export const CREDIT_POINTS = 2.25;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function categoryMonthly(category: CostCategory): number {
  return round2(category.lines.reduce((sum, line) => sum + line.monthly, 0));
}

export function monthlyFixedCost(): number {
  return round2(STUDIO_COST_CATEGORIES.reduce((sum, c) => sum + categoryMonthly(c), 0));
}

/** c = (F + Y) / H */
export function hourCost(hours: number, workValue = DEFAULT_WORK_VALUE): number {
  return round2((monthlyFixedCost() + workValue) / hours);
}

/* שיעורי 2026 מ-cost-model-sources.md סעיפים 2-4 */
function nationalInsurance(y: number): number {
  return 0.077 * Math.min(y, 7703) + 0.18 * Math.max(0, Math.min(y, 51910) - 7703);
}
function incomeTax(y: number, creditPoints = CREDIT_POINTS): number {
  const brackets: [number, number][] = [
    [7010, 0.1], [10060, 0.14], [19000, 0.2], [25100, 0.31], [46690, 0.35], [Infinity, 0.47],
  ];
  let tax = 0;
  let prev = 0;
  for (const [cap, rate] of brackets) {
    if (y > prev) tax += (Math.min(y, cap) - prev) * rate;
    prev = cap;
  }
  return Math.max(0, tax - creditPoints * 242);
}
function pension(y: number): number {
  return 0.0445 * Math.min(y, 6884.5) + 0.1255 * Math.max(0, Math.min(y, 13769) - 6884.5);
}

export type BreakdownRow = {
  id: string;
  label: string;
  amount: number;
  note: string;
  lines?: readonly CostLine[];
  parts?: readonly { label: string; amount: number }[];
};

/* B לעמוד: 590 = מע״מ + חלק השיר בכל קטגוריה + מה שנשאר לזמן העבודה.
   השורה האחרונה היא היתרה (500 פחות העלויות), ולכן הסכום תמיד שווה למחיר
   הלקוח. אין שורת רווח או גירעון נפרדת (model-status.md, "לעמוד"). */
export function songBreakdown(hours = DEFAULT_HOURS, workValue = DEFAULT_WORK_VALUE): BreakdownRow[] {
  const exVat = getExVat("song_recording");
  const vat = round2(exVat * CATALOG_VAT_RATE);
  const rows: BreakdownRow[] = [
    { id: "vat", label: "מע״מ", amount: vat, note: `${Math.round(CATALOG_VAT_RATE * 100)}% שעוברים למדינה` },
  ];
  let costs = 0;
  for (const category of STUDIO_COST_CATEGORIES) {
    const share = round2((categoryMonthly(category) / hours) * SONG_HOURS);
    costs += share;
    rows.push({
      id: category.id,
      label: category.title,
      amount: share,
      note: `${categoryMonthly(category).toLocaleString("he-IL")} ₪ לחודש, חלקי ${hours} שעות, כפול ${SONG_HOURS} שעות לשיר`,
      lines: category.lines,
    });
  }
  const work = round2(exVat - costs);
  const rates = {
    ni: nationalInsurance(workValue) / workValue,
    tax: incomeTax(workValue) / workValue,
    pension: pension(workValue) / workValue,
  };
  const ni = round2(work * rates.ni);
  const tax = round2(work * rates.tax);
  const pen = round2(work * rates.pension);
  rows.push({
    id: "work",
    label: "זמן העבודה של הטכנאי",
    amount: work,
    note: "מה שנשאר אחרי המע״מ וההוצאות",
    parts: [
      { label: "ביטוח לאומי ובריאות", amount: ni },
      { label: "מס הכנסה", amount: tax },
      { label: "פנסיה חובה", amount: pen },
      { label: "נשאר ביד", amount: round2(work - ni - tax - pen) },
    ],
  });
  return rows;
}

export function nis(n: number, digits = 0): string {
  return `${n.toLocaleString("he-IL", { minimumFractionDigits: digits, maximumFractionDigits: digits })} ₪`;
}

/* studio_extra_participant (190) לא נמצא כאן בכוונה: מ-3.10.2026 הוא לא חל על שיר
   (החלטת בעלים, סבב רביעי). בשיר כל זמר נוסף הוא SONG_PARTICIPANT_RULES.extraId. */
export function consumerPrice(id: "song_recording" | "song_pitch_coaching" | typeof SONG_PARTICIPANT_RULES.extraId): number {
  return Math.round(getExVat(id) * (1 + CATALOG_VAT_RATE));
}

export function fullRouteConsumerPrice(): number {
  return Math.round((getExVat("song_recording") + getExVat("song_pitch_coaching")) * (1 + CATALOG_VAT_RATE));
}

/* COPY READY, model-status.md. המספרים נגזרים, לא נכתבים ידנית. */
export function speakableAnswer(): string {
  const vat = round2(getExVat("song_recording") * CATALOG_VAT_RATE);
  return (
    `הקלטת שיר עולה ${nis(consumerPrice("song_recording"))} כולל מע״מ. ${nis(vat)} מתוכם הם מע״מ. ` +
    `ה-${nis(getExVat("song_recording"))} שנשארים צריכים לכסות שעה ושלושת רבעי עבודה: ההכנה, הסשן והמסירה. ` +
    `לפי מודל של אולפן מקצועי בתל אביב, 24 מ״ר בשלושה חדרים, שעת עבודה עולה בערך ${nis(Math.round(hourCost(DEFAULT_HOURS)))}, ` +
    `כולל שווי זמן העבודה של הטכנאי, כשהאולפן עובד ${DEFAULT_HOURS} שעות בחודש עם לקוחות.`
  );
}

/* כרטיסים: ציטוטים מ-yakir-voice-studio-costs.md (voice), לפי COPY READY */
export const VOICE_CARDS: readonly { categoryId: string; title: string; quote: string }[] = [
  { categoryId: "space", title: "מקום ניטרלי", quote: "צריך מקום ניטרלי: בלי יוצאים ונכנסים, בלי רעשי בית" },
  { categoryId: "equipment", title: "ציוד כפול", quote: "לכל פעולה אני בודק איך מגיעים אליה בעוד דרך" },
  { categoryId: "build", title: "חדרים נפרדים ואקוסטיקה", quote: "בלי הפרדה קשה באמת לשמוע איך זה נכנס" },
  { categoryId: "climate", title: "מיזוג לכל חדר", quote: "סאונד טוב יוצא כשלא מטרידים אותך דברים בחדר, כולל חום וקור" },
  { categoryId: "education", title: "ידע", quote: "תעודה או תואר זה לא תחליף לאהבה למקצוע, אבל זו גושפנקה שעברת הרחבת ידע" },
];

export type StudioCostFaq = { id: string; question: string; answer: string };

export function studioCostFaqs(): StudioCostFaq[] {
  const minHour = Math.round(hourCost(80, DEFAULT_WORK_VALUE));
  const maxHour = Math.round(hourCost(40, ALT_WORK_VALUE));
  const vat = Math.round(getExVat("song_recording") * CATALOG_VAT_RATE);
  return [
    {
      id: "song-price-parts",
      question: "ממה מורכב המחיר של הקלטת שיר?",
      answer: `מתוך ${nis(consumerPrice("song_recording"))}, ${vat} הם מע״מ. השאר מכסה את המקום, הציוד, התוכנות, הביטוח וזמן העבודה. הפירוק המלא, עם מקור לכל שורה, נמצא בעמוד.`,
    },
    {
      id: "pitch-correction",
      question: `למה תיקון זיופים הוא תוספת של ${nis(consumerPrice("song_pitch_coaching"))}?`,
      answer: "זה עוד 20 עד 40 דקות עבודה על השיר, וטכנאי שמכוון ומנחה אתכם בזמן ההקלטה. Melodyne ו-Auto-Tune הם רישיונות בתשלום שהאולפן מחזיק.",
    },
    {
      id: "why-not-home",
      question: "למה לא להקליט בבית?",
      answer: "\"בבית קשה להיפתח\". אולפן נותן מקום ניטרלי, חדרים מבודדים ומישהו שמקשיב לתוצאה ולא לך.",
    },
    {
      id: "hour-cost",
      question: "כמה עולה שעת עבודה באולפן מקצועי?",
      answer: `במודל שלנו, בין ${minHour} ל-${maxHour} ₪, תלוי בכמה שעות בחודש האולפן עובד עם לקוחות ובשווי זמן העבודה. החישוב והמקורות נמצאים בעמוד.`,
    },
    {
      id: "group-song",
      question: "למה שיר של קבוצה עולה יותר?",
      answer: `כל זמר הוא ערוץ נפרד: עוד הקלטה, עוד איזון ועוד עריכה. "לפעמים שעת הקלטה הופכת להרבה שעות עריכה". כל זמר נוסף מוסיף ${nis(consumerPrice(SONG_PARTICIPANT_RULES.extraId))} כולל מע״מ, עד ${SONG_PARTICIPANT_RULES.max} זמרים בשיר.`,
    },
  ];
}

export const STUDIO_COST_METHODOLOGY = [
  "המודל מתאר אולפן מקצועי בינוני עד גדול: 24 מ״ר בתל אביב בשלושה חדרים (הקלטה, עריכה, פודקאסט), 3 מזגנים וציוד כפול לגיבוי. זה לא דוח של עסק מסוים.",
  "כל ההוצאות לפני מע״מ, כי עוסק מורשה מקזז מע״מ על הוצאות (הנחת מודל). רכישה חד-פעמית מחולקת על פני אורך החיים לפי שיעורי הפחת, ותוכנה חד-פעמית על פני 36 חודשים (הנחת מודל).",
  `שווי זמן העבודה במודל הוא ${nis(DEFAULT_WORK_VALUE)} לחודש (הנחת מודל, לפי טווחי שכר בשוק). ${nis(ALT_WORK_VALUE)} מוצג כתרחיש נוסף.`,
  `זמן לשיר: שעת סשן ועוד 30 עד 60 דקות סביבה. בחישוב: ${SONG_HOURS} שעות (הערכת האולפן).`,
  "עלות שעה = (הוצאות חודשיות + שווי זמן העבודה) חלקי שעות העבודה עם לקוחות בחודש.",
  "שני מספרים שונים לזמן העבודה, בכוונה: עלות השעה מחושבת עם שווי זמן העבודה המלא במודל. בפירוק התשלום, שורת זמן העבודה של הטכנאי היא היתרה מהתשלום, מה שנשאר אחרי המע״מ וההוצאות, ולא שווי זמן העבודה של המודל.",
  `מסים על זמן העבודה לפי שיעורי 2026: ביטוח לאומי ובריאות, מס הכנסה עם ${CREDIT_POINTS} נקודות זיכוי, ופנסיה חובה. הניכויים לא חושבו (פשטנות).`,
  "שורות שמסומנות \"הערכה\" או \"הנחת מודל\" אינן ציטוט ממקור. כל השאר מקושר למקור שנבדק ב-3.10.2026.",
] as const;

export const STUDIO_COST_CITATION = `מקור לציטוט: יקיר כהן, כמה עולה להפעיל אולפן הקלטות מקצועי, ${absoluteUrl(STUDIO_COST_SLUG)}`;

export const STUDIO_COST_DATASET_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "מודל עלות של אולפן הקלטות מקצועי בישראל, 2026",
  description: STUDIO_COST_DESCRIPTION,
  url: absoluteUrl(STUDIO_COST_SLUG),
  inLanguage: "he-IL",
  datePublished: STUDIO_COST_UPDATED_AT,
  dateModified: STUDIO_COST_UPDATED_AT,
  license: absoluteUrl("terms"),
  creator: { "@id": ENTITY_IDS.founder },
  publisher: { "@id": ENTITY_IDS.organization },
  isAccessibleForFree: true,
  variableMeasured: ["הוצאה חודשית לפני מע״מ", "עלות שעת עבודה", "חלק בתשלום הלקוח"],
  measurementTechnique:
    "מודל עלות מלמטה למעלה ממקורות ציבוריים (רשויות, ספקים, מדריכי מחירים) והנחות מודל מסומנות.",
};
