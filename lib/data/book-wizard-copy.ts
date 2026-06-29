/** מיקרו-קופי לוויזארד הזמנות אולפן */
export const BOOK_WIZARD_COPY = {
  nextStep: "המשך לשלב הבא ←",
  step3Closer: "נשאר רק עוד שלב אחד קצר לנעילת הסשן שלך",
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
} as const;

export const STUDIO_QUICK_UPGRADE_IDS = ["bts", "express", "vocal_coaching"] as const;
