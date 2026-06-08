export type GreetingTip = {
  routes: string[];
  tip: string;
};

export const GREETING_TIPS: GreetingTip[] = [
  { routes: ["/studio"], tip: "שיר קאבר מ-590 ₪ · ניתן להביא מלווה" },
  { routes: ["/studio/recording-song-modiin"], tip: "הקלטה, מיקס ומאסטרינג - בשעה אחת" },
  { routes: ["/podcast"], tip: "עריכת פרק כלולה בחבילות ההפקה" },
  { routes: ["/podcast/podcast-editing"], tip: "גם הקלטות ישנות - שחזור סאונד AI" },
  { routes: ["/events"], tip: "אפשר לשלב עשן + זיקוקים + LED במחיר חבילה" },
  { routes: ["/events/dj-events"], tip: "DJ + הגברה + אטרקציה - חבילה אחת" },
  { routes: ["/voiceover"], tip: "מסירה תוך ימים, גם לפרויקטים דחופים" },
  { routes: ["/voiceover/services"], tip: "קריינות ל-IVR, פרסומות ותוכן דיגיטלי" },
  { routes: ["/online"], tip: "שולחים קובץ - מקבלים תוצאה תוך ימים בודדים" },
  { routes: ["/online/vocal-fix"], tip: "סקיצה לפני/אחרי חינמית - לפני שמזמינים" },
  { routes: ["/online/vocal-fix/mixing"], tip: "מיקס + מאסטרינג - מוכן לספוטיפיי" },
  { routes: ["/academy"], tip: "שיעור ניסיון ראשון - בתיאום אישי" },
  { routes: ["/photography"], tip: "צילום אירוע + עריכה מלאה" },
  { routes: ["/video"], tip: "סרט תדמית מ-2,200 ₪ · מסירה תוך שבוע" },
];

const GENERAL_TIPS = [
  "אולפן, פודקאסט, אירועים - הכל במקום אחד",
  "מגיבים בוואטסאפ תוך 15 דקות בשעות הפעילות",
  "תמחור שקוף - ראו מחירון מרכזי",
];

export function getTipForPath(pathname: string): string {
  const match = GREETING_TIPS.find((t) =>
    t.routes.some((r) => pathname === r || pathname.startsWith(`${r}/`)),
  );
  if (match) return match.tip;
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return GENERAL_TIPS[week % GENERAL_TIPS.length]!;
}
