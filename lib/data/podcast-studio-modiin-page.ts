export const STUDIO_MODIIN_HERO_IMAGE = {
  src: "/images/services/studio/hub/ישראל אהרוני באולפן.webp",
  alt: "ישראל אהרוני בסטודיו לפודקאסט במודיעין",
} as const;

export const STUDIO_MODIIN_HERO_FEATURES: readonly string[] = [
  "השכרת סטודיו לפודקאסט במודיעין והסביבה",
  "ציוד הקלטה מתקדם + חדר מבודד אקוסטית",
  "ליווי טכני מלא  -  מתמקדים בתוכן, לא בטכניקה",
  "מיקום מרכזי  -  כביש 6 ו-1, חניה בשפע",
  "אופציות עריכה, וידאו והפקה מלאה",
] as const;

export const STUDIO_MODIIN_WHY_US: readonly string[] = [
  "ציוד מקצועי: Shure SM7B, Electro-Voice RE20, מיקסרים דיגיטליים ומעבדי קול",
  "חדר מבודד אקוסטית  -  ללא הדים, רעשי רקע או הסחות",
  "מיקום מרכזי במודיעין  -  נגיש מירושלים, תל אביב והמרכז",
  "ליווי טכני בהקלטה  -  אנחנו מנהלים את הטכני, אתם מדברים",
  "אופציות עריכה והפקה  -  מעטפת מלאה מאותו מקום",
  "מתאים לכל סוג: ראיונות, סיפורים, פודקאסט עם סבא ועוד",
] as const;

export const STUDIO_MODIIN_RELATED_SERVICES: readonly {
  emoji: string;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    emoji: "🎧",
    title: "עריכת פודקאסט מקצועית",
    description:
      "ניקוי רעשים, מוזיקת רקע, מיקס ומאסטרינג  -  כשאין זמן לערוך בעצמכם.",
    href: "/podcast/podcast-editing",
  },
  {
    emoji: "🎬",
    title: "הפקת וידאו לפודקאסט (Vodcast)",
    description:
      "צילום באיכות גבוהה וקבצים מוכנים ליוטיוב ורשתות חברתיות.",
    href: "/podcast/podcast-recording",
  },
  {
    emoji: "📱",
    title: "עריכת סרטונים קצרים",
    description: "קטעים שיווקיים מהפודקאסט  -  Reels ו-TikTok.",
    href: "/business/social-media",
  },
  {
    emoji: "🏠",
    title: "ייעוץ אקוסטיקה ובניית אולפן",
    description: "אולפן ביתי, פודקאסט או משדר - תכנון אקוסטי וליווי.",
    href: "/academy/home-studio",
  },
] as const;

export const STUDIO_MODIIN_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "multi-guest",
    question: "האם ניתן להקליט פודקאסט עם מספר משתתפים?",
    answer:
      "בהחלט. הסטודיו מאובזר להקלטת מספר משתתפים בו-זמנית, בנפרד או יחד, בהתאם לצורך.",
  },
  {
    id: "pricing",
    question: "כמה עולה השכרת סטודיו לפודקאסט במודיעין?",
    answer:
      "המחיר משתנה לפי משך ההקלטה ושירותים נלווים (עריכה, צילום וידאו). מחירונים גמישים  -  ראו את מחירון הפודקאסט בעמוד הראשי.",
  },
  {
    id: "equipment",
    question: "האם צריך להביא ציוד משלנו?",
    answer:
      "לא. הסטודיו כולל מיקרופונים, אוזניות, מעבדים ומחשבים. מגיעים עם הרעיון.",
  },
  {
    id: "parking",
    question: "האם יש חניה במקום?",
    answer: "כן  -  חניה נוחה ונגישה לכל מי שמגיע להקלטה.",
  },
] as const;
