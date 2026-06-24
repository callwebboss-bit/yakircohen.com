export type GreetingTip = {
  routes: string[];
  tip: string;
  href: string;
};

export const GREETING_TIPS: GreetingTip[] = [
  { routes: ["/studio"], tip: "שיר קאבר מ-590 ₪ - ניתן להביא מלווה", href: "/studio" },
  { routes: ["/studio/recording-song-modiin"], tip: "הקלטה, מיקס ומאסטרינג - בשעה אחת", href: "/studio/recording-song-modiin" },
  { routes: ["/podcast"], tip: "עריכת פרק כלולה בחבילות ההפקה", href: "/podcast" },
  { routes: ["/podcast/podcast-editing"], tip: "גם הקלטות ישנות - שחזור סאונד AI", href: "/podcast/podcast-editing" },
  { routes: ["/events"], tip: "אפשר לשלב עשן + זיקוקים + LED במחיר חבילה", href: "/events" },
  { routes: ["/events/dj-events"], tip: "DJ + הגברה + אטרקציה - חבילה אחת", href: "/events/dj-events" },
  { routes: ["/voiceover"], tip: "מסירה תוך ימים, גם לפרויקטים דחופים", href: "/voiceover" },
  { routes: ["/voiceover/services"], tip: "קריינות ל-IVR, פרסומות ותוכן דיגיטלי", href: "/voiceover/services" },
  { routes: ["/online"], tip: "שולחים קובץ - מקבלים תוצאה תוך ימים בודדים", href: "/online" },
  { routes: ["/online/vocal-fix"], tip: "סקיצה לפני/אחרי חינמית - לפני שמזמינים", href: "/online/vocal-fix" },
  { routes: ["/online/vocal-fix/mixing"], tip: "מיקס + מאסטרינג - מוכן לספוטיפיי", href: "/online/vocal-fix/mixing" },
  { routes: ["/academy"], tip: "שיעור ניסיון ראשון - בתיאום אישי", href: "/academy" },
  { routes: ["/photography"], tip: "צילום אירוע + עריכה מלאה", href: "/photography" },
  { routes: ["/video"], tip: "סרט תדמית מ-2,200 ₪ - מסירה תוך שבוע", href: "/video" },
];

export const GENERAL_TIPS = [
  { tip: "אולפן, פודקאסט, אירועים - הכל במקום אחד", href: "/" },
  { tip: "מגיבים בוואטסאפ תוך 15 דקות בשעות הפעילות", href: "/book" },
  { tip: "תמחור שקוף - ראו מחירון מרכזי", href: "/pricing" },
];

export function getTipForPath(pathname: string): { tip: string; href: string } {
  const match = GREETING_TIPS.find((t) =>
    t.routes.some((r) => pathname === r || pathname.startsWith(`${r}/`)),
  );
  if (match) return { tip: match.tip, href: match.href };
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return GENERAL_TIPS[week % GENERAL_TIPS.length]!;
}
