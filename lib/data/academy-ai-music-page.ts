export const AI_MUSIC_LEARN_MODULES: readonly {
  icon: string;
  title: string;
  body: string;
}[] = [
  {
    icon: "🎓",
    title: "ללמוד לעבוד נכון עם AI",
    body: "איזה כלי לבחור, איך לפרקומט, ואיך לא לאבד שליטה על התוצאה. קורס 1:1 באולפן.",
  },
  {
    icon: "🎵",
    title: "רמיקסים וביטים",
    body: "מפרקים שיר, בונים גרסה חדשה, מייצרים גרוב משלכם - עם AI כמאיץ, לא כתחליף לאוזן.",
  },
  {
    icon: "🎤",
    title: "משיר במגירה לשיר אמיתי",
    body: "מלודיה בראש → ליווי, עיבוד והפקה. גם בשניות - אבל עם בקרת איכות אנושית.",
  },
  {
    icon: "⚙️",
    title: "שילוב ב-DAW",
    body: "Ableton / Logic / FL: איך להכניס פלט מ-AI לזרימת עבודה מקצועית.",
  },
] as const;

/** שירותים קיימים באתר - בליווי, לא DIY */
export const AI_MUSIC_GUIDED_SERVICES: readonly {
  icon: string;
  title: string;
  description: string;
  href: string;
  priceHint?: string;
  cta: string;
}[] = [
  {
    icon: "🎚️",
    title: "פיצול לערוצים (Stems)",
    description:
      "הפרדת שיר לתופים, בס, גיטרה, פסנתר, ווקאל ועוד - לרמיקס, עיבוד או תיקון נקודתי.",
    href: "/studio/recording-song-modiin",
    priceHint: "בתוך חבילת הפקה / לפי הצעה",
    cta: "הפקה באולפן",
  },
  {
    icon: "📼",
    title: "שיר ישן → שיר חדש",
    description:
      "הקלטה ישנה, קסט או דמו - שחזור, ניקוי AI ועריכה עד קובץ שמיש לפרסום או לאירוע.",
    href: "/blog/sound-recovery-ai-podcast",
    cta: "שחזור סאונד ב-AI",
  },
  {
    icon: "✨",
    title: "מלודיה במגירה → שיר מלא",
    description:
      "רעיון, שרימפ או מילים - ליווי בהפקה, עיבוד ומיקס עד שיר מוגמר באולפן.",
    href: "/studio/recording-song-modiin",
    cta: "הקלטת שיר",
  },
  {
    icon: "🎙️",
    title: "שיפור ווקאל (AI Tuning)",
    description:
      "ניקוי רעשים, תיקון זיופים ונוכחות קולית - לפודקאסט, שיר או קריינות.",
    href: "/podcast/podcast-editing",
    cta: "עריכת פודקאסט",
  },
  {
    icon: "🌐",
    title: "שירותי AI מקוונים",
    description:
      "שליחת קבצים מכל הארץ - ניקוי, שחזור והגברה. מחירון שקוף + הצעה אישית.",
    href: "/online/online-ai-pricing",
    priceHint: "מ־350 ₪",
    cta: "מחירון AI מקוון",
  },
  {
    icon: "☁️",
    title: "מרכז שירותים מרחוק",
    description: "עריכה, ייעוץ לפני הקלטה ומסירה דיגיטלית - בלי חובה להגיע פיזית.",
    href: "/online",
    cta: "שירותים מקוונים",
  },
  {
    icon: "🎛️",
    title: "הפקה מוזיקלית מלאה",
    description:
      "DAW, מיקס ומאסטרינג עם שילוב AI - קורס או ליווי פרויקט באולפן.",
    href: "/academy/music-production",
    cta: "קורס הפקה",
  },
] as const;

export const AI_MUSIC_WARNINGS: readonly string[] = [
  "AI יכול לייצר תוצאה מהירה - אבל בלי ידע קל לטעות (זיופים, זכויות, איכות נמוכה).",
  "אנחנו לא מוכרים „לחץ כפתור ולך לבד״ - הליווי הוא חלק מהשירות.",
  "רוצים ללמוד לעשות לבד? יש קורס. רוצים תוצאה מוכנה? יש שירות בליווי.",
] as const;
