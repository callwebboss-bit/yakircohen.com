/** מיקרו-קופי לוויזארד הזמנות אולפן */
export const BOOK_WIZARD_COPY = {
  nextStep: "המשך לשלב הבא ←",
  step3Closer: "נשאר רק עוד שלב אחד קצר לנעילת הסשן שלך",
  step3SummaryHeading: "סיכום קצר",
  step3ContactHeading: "פרטים לתיאום",
  notesOptional: "הערות נוספות (אופציונלי)",
  projectModeQuestion: "איזה סוג פרויקט?",
  projectPersonal: "פרטי וחווייתי",
  projectBusiness: "עסקי ושיווקי",
  fitMeterLabel: "התאמה לצרכים שלך",
  fitMeterDetail: "החבילה מתאימה — בלי תוספות מיותרות",
  splitCostLabel: "מתחלקים בעלות?",
  splitCostPerPerson: (amount: string) => `רק ${amount} ₪ למשתתף (לפני מע״מ)`,
  waEscape: "מעדיף לדבר עכשיו? שלחו את הבחירות עד כה בוואטסאפ",
  companyNameLabel: "שם החברה / הארגון",
  needsInvoiceLabel: "צריך חשבונית מס",
  sessionPriorityQuestion: "מה הכי חשוב לך בסשן?",
  sessionPriorityVocal: "אני קצת מזייף, צריך תיקון קולי חזק",
  sessionPriorityFast: "חשוב לי שהשירים יצאו מהר",
  sessionPriorityPrice: "שלא יהיו הפתעות ותוספות במחיר",
  welcomePerkQuestion: "בחרו צ'ופר הגעה ללא עלות",
  welcomePerkCoffee: "עמדת קפה מפנקת ונשנושים",
  welcomePerkPhotos: "3 תמונות אווירה מקצועיות לסטורי",
  welcomePerkWarmup: "15 דקות חימום קולי על חשבון הבית",
  travelModeQuestion: "איך מגיעים לאולפן?",
  travelModeCar: "רכב פרטי",
  travelModeTransit: "תחבורה ציבורית / אחר",
  parkingBanner:
    "סידרנו לך ראש שקט! חניה פרטית, מקורה ובחינם מחכה לך ישירות בכניסה לאולפן (כולל שלט רחוק לפתיחת המחסום שישלח אליך בוואטסאפ)",
  transitionMessages: [
    "בודק זמינות טכנאים...",
    "מחשב עלויות חבילה...",
    "מתאים הטבות אישיות...",
  ] as const,
} as const;

export const SESSION_PRIORITY_LABELS: Record<
  "vocal_fix" | "fast_delivery" | "no_surprises",
  string
> = {
  vocal_fix: BOOK_WIZARD_COPY.sessionPriorityVocal,
  fast_delivery: BOOK_WIZARD_COPY.sessionPriorityFast,
  no_surprises: BOOK_WIZARD_COPY.sessionPriorityPrice,
};

export const WELCOME_PERK_LABELS: Record<"coffee" | "photos" | "vocal_warmup", string> = {
  coffee: BOOK_WIZARD_COPY.welcomePerkCoffee,
  photos: BOOK_WIZARD_COPY.welcomePerkPhotos,
  vocal_warmup: BOOK_WIZARD_COPY.welcomePerkWarmup,
};

export const TRAVEL_MODE_LABELS: Record<"car" | "transit", string> = {
  car: BOOK_WIZARD_COPY.travelModeCar,
  transit: BOOK_WIZARD_COPY.travelModeTransit,
};

export const STUDIO_QUICK_UPGRADE_IDS = ["bts", "express", "vocal_coaching"] as const;
