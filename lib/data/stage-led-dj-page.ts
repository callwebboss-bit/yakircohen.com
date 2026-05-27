export type LedBoothExampleVideo = {
  videoId: string;
  title: string;
};

export const LED_BOOTH_EXAMPLE_VIDEOS: readonly LedBoothExampleVideo[] = [
  { videoId: "hnjqvwHaWiU", title: "עמדת LED באירוע" },
  { videoId: "E76RqzSZSq0", title: "עמדת DJ LED  -  ויז'ואלס" },
  { videoId: "nBtKa0JZfL0", title: "מסך LED ברחבה" },
  { videoId: "rsZjbz1rld0", title: "עמדת לד  -  רגעים מהשטח" },
] as const;

export const LED_BOOTH_HIGHLIGHTS: readonly { emoji: string; title: string; text: string }[] = [
  {
    emoji: "📸",
    title: "תיעוד מקצועי",
    text: "אידיאלי לסטילס ווידאו  -  הרחבה מתחילה בעיניים.",
  },
  {
    emoji: "🎨",
    title: "מיתוג ויזואלי",
    text: "לוגו, שמות חוגגים, ויז'ואלס  -  מסך רציף באיכות שידור.",
  },
  {
    emoji: "☀️",
    title: "גם באור יום",
    text: "עד 4,500 Nits  -  נראה מעולה בחוץ ובאולם מואר.",
  },
] as const;

export const LED_BOOTH_CONTENT_TYPES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🖼️",
    title: "לוגו ומיתוג",
    description: "לוגו DJ או חברה בלופ, אנימציות, צבעי מותג  -  נראה מכל זווית.",
  },
  {
    emoji: "📹",
    title: "שידור חי",
    description: "רחף, סלפי DJ, מצגות  -  רעיון מיוחד? נממש.",
  },
  {
    emoji: "🌈",
    title: "ויז'ואלס (VJ)",
    description: "צורות וצבעים לפי הקצב  -  טרופי, רטרו, מינימליסטי.",
  },
  {
    emoji: "💕",
    title: "שמות החוגגים",
    description: "חתן-כלה, בר/בת מצווה, תמונות ילדות  -  טקסט מעוצב.",
  },
] as const;

export const LED_BOOTH_COMBOS: readonly { title: string; description: string }[] = [
  {
    title: "עמדת LED + תותחי עשן",
    description: "עשן צבעוני בצדדי העמדה  -  עומק ויזואלי.",
  },
  {
    title: "עמדת LED + זיקוקים קרים",
    description: "ניצוצות זהובות על רקע המסך.",
  },
  {
    title: "עמדת LED + בועות עשן",
    description: "אפקט משולש קסום לרחבה.",
  },
  {
    title: "עמדת LED + תאורת LED",
    description: "תאורה צבעונית מסביב  -  מסך חי.",
  },
] as const;

export const LED_BOOTH_USE_CASES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🎧",
    title: "תקליטנים",
    description: "לוגו ענק וויז'ואלס לפי הקצב  -  בידול מתחרים.",
  },
  {
    emoji: "💍",
    title: "חתונות ובר/בת מצווה",
    description: "שמות, לוגו, ויז'ואלס לפי המוזיקה  -  אווירה נוצצת.",
  },
  {
    emoji: "🏢",
    title: "אירועים עסקיים",
    description: "לוגו, מצגות, שידור חי  -  חדשנות ויוקרה.",
  },
  {
    emoji: "🎭",
    title: "בית / גינה / בר",
    description: "אירועים קטנים וגדולים  -  הבמה שלכם.",
  },
] as const;

export const LED_BOOTH_PROCESS: readonly {
  step: string;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    title: "זמינות והצעת מחיר",
    description: "בדיקת תאריך, גודל עמדה ומיקום  -  הצעה תוך שעות.",
  },
  {
    step: "02",
    title: "תיאום תוכן ועיצוב",
    description: "לוגו, וידאו, שמות  -  שליחת חומרים עד 3 ימים לפני.",
  },
  {
    step: "03",
    title: "התקנה, תמיכה ופירוק",
    description:
      "הגעה 2-3 שעות לפני, התקנה ~30 דקות, בדיקות, טכנאי אופציונלי, פירוק בסוף.",
  },
] as const;

export const LED_BOOTH_TECH: readonly string[] = [
  "מעבדי תמונה: Novastar / Linsn",
  "רזולוציה: P3.91",
  "בהירות: עד 4,500 Nits",
  "תוכנה: Resolume Arena",
] as const;

export const LED_BOOTH_LED_VS_TV: readonly { label: string; bad: string; good: string }[] = [
  { label: "מראה", bad: "נראה זול, לא מרחוק", good: "הפקה מקצועית, מסך רציף" },
  { label: "בהירות", bad: "לא מתאים לאור יום", good: "4,500 Nits  -  גם בחוץ" },
  { label: "רזולוציה", bad: "טלוויזיה רגילה", good: "P3.91  -  חד ממרחק" },
  { label: "מיתוג", bad: "מוגבל", good: "לוגו, VJ, שידור חי" },
] as const;

export const LED_BOOTH_WHY_US: readonly string[] = [
  "גמישות ושירות אישי  -  תוכן ותזמון מותאמים",
  "תמיכה טכנית  -  הגעה מוקדמת, בדיקות, טכנאי אופציונלי",
  "שקיפות  -  הכל כלול, בלי הפתעות",
  "20 שנות ניסיון · 1,800+ אירועים · 280+ המלצות",
] as const;
