export const PAYMENT_SECURITY_LINE =
  "פרטי התשלום אינם נשמרים באתר, והסליקה מתבצעת דרך ספק מאושר.";

export const CANCELLATION_SHORT_LINE =
  "ביטול עד 14 יום לפני, החזר מלא. שינוי תאריך, חינם.";

export const LEGAL_TRUST_LINKS = [
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/terms#cancellation", label: "תנאי שירות (ביטולים)" },
] as const;

/** תנאי תשלום מורחבים, אירועים B2B */
export const EVENTS_PAYMENT_TERMS_LINES = [
  "עד 3 תשלומים · שוטף +60 יום עם חתימה (אפשרי +90 בתיאום)",
  "* איחור בתשלום יחויב בריבית חוזית והצמדה למדד, בהתאם לחוק פסיקת ריבית והצמדה.",
] as const;
