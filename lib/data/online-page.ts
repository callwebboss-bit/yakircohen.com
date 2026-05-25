export const ONLINE_HOW_IT_WORKS: readonly {
  icon: string;
  title: string;
  body: string;
}[] = [
  {
    icon: "📤",
    title: "שולחים את הקובץ",
    body: "דרך וואטסאפ, מייל או גוגל דרייב.",
  },
  {
    icon: "🎚️",
    title: "אנחנו עובדים",
    body: "מנקים, עורכים ומשפרים עם ציוד אולפני ו-AI.",
  },
  {
    icon: "📩",
    title: "מקבלים בחזרה",
    body: "קובץ מושלם ומוכן לשימוש תוך 24-48 שעות.",
  },
] as const;

export const ONLINE_SERVICES: readonly {
  icon: string;
  title: string;
  intro: string;
  includes: string;
  suited: string;
  href?: string;
}[] = [
  {
    icon: "🎉",
    title: "עריכת ברכות ומסרים אישיים",
    intro:
      "הקלטתם ברכה ליום הולדת בטלפון? אנחנו נגרום לזה להישמע כאילו הוקלט באולפן.",
    includes: "חיתוך גמגומים, הוספת מוזיקת רקע מרגשת ושיפור הסאונד.",
    suited: "ברכות מצולמות, מצגות לאירועים והודעות מרגשות.",
    href: "/studio/blessings",
  },
  {
    icon: "🎙️",
    title: 'שיפור איכות הקלטות ("ניקוי רעשים")',
    intro: "הקלטתם בנייד, בזום או בסביבה רועשת? אנחנו נהפוך את זה לנקי וברור.",
    includes: "הסרת רעשי רקע (מזגן/רחוב), איזון תדרים והגברת הבהירות.",
    suited: "ראיונות, הקלטות סתר, שיעורים ופגישות בזום.",
    href: "/online/vocal-fix",
  },
  {
    icon: "🔊",
    title: "שינוי והתאמת ווליום (נורמליזציה)",
    intro:
      "ההקלטה שקטה מדי? או שיש חלקים שצורמים באוזן? נסדר שהכל יהיה אחיד ונעים.",
    includes: "איזון עוצמה אחיד לכל ההקלטה.",
    suited: "סרטונים ליוטיוב/טיקטוק, פודקאסטים ומצגות.",
    href: "/online/vocal-fix",
  },
  {
    icon: "🎹",
    title: "מיקס, מאסטרינג ועריכת מוזיקה",
    intro: "יש לכם שיר, פודקאסט או רצועה שצריכה את הטאץ' הסופי?",
    includes: "איזון ערוצים, EQ, קומפרסיה ומאסטרינג לסטנדרט רדיו.",
    suited: "מוזיקאים, יוצרים ומפיקי פודקאסטים.",
    href: "/online/vocal-fix/mixing",
  },
  {
    icon: "🆘",
    title: "הצלת הקלטות פגומות",
    intro:
      "יש לכם הקלטה חשובה עם רעש נוראי, הד או עיוות? אל תמחקו אותה לפני שננסה להציל.",
    includes: "שחזור אודיו מתקדם, הסרת הד (Reverb) ותיקון דיסטורשן.",
    suited: "הקלטות חד-פעמיות שאי אפשר לשחזר.",
    href: "/blog/sound-recovery-ai-podcast",
  },
  {
    icon: "🤖",
    title: "שירותי AI מתקדמים לאודיו",
    intro: "שימוש בבינה מלאכותית לביצועים שהיו בלתי אפשריים פעם.",
    includes: "הפרדת קולות ממוזיקה (Stems), המרת טקסט לדיבור ועוד.",
    suited: "יוצרים שצריכים פתרון מהיר ומדויק.",
    href: "/online/online-ai-pricing",
  },
] as const;

export const ONLINE_WHY_US: readonly string[] = [
  "מקצועיות של אולפן פיזי: אותו המפיק (יקיר), אותו הציוד - רק מרחוק",
  "מהירות: רוב העבודות מוכנות מהיום למחר",
  "מחיר משתלם: חוסכים את עלויות האולפן והנסיעות",
  "תיקונים ללא הגבלה: עובדים עד שאתם מרוצים מהתוצאה",
] as const;

export const ONLINE_SUB_LINKS: readonly {
  label: string;
  href: string;
  desc: string;
}[] = [
  {
    label: "שיפור קול מהנייד",
    href: "/online/vocal-fix",
    desc: "הפכו הקלטה ביתית לאיכות אולפן - מ-250 ₪",
  },
  {
    label: "תיקון זיופים (Pitch Correction)",
    href: "/online/vocal-fix/pitch-correction",
    desc: "תיקון טבעי, בלי סאונד רובוטי",
  },
  {
    label: "שדרוג תמונות ב-AI",
    href: "/online/vocal-fix/photo-enhance",
    desc: "תמונות ישנות לאיכות HD - מ-50 ₪ לתמונה",
  },
  {
    label: "מיקס ומאסטרינג",
    href: "/online/vocal-fix/mixing",
    desc: "הקלטה ביתית שנשמעת כמו אולפן - 500 ₪ לשיר",
  },
  {
    label: "שליחת קבצים (אישור תנאים)",
    href: "/online/vocal-fix/send-file",
    desc: "הצהרת אחריות לפני עיבוד מרחוק",
  },
  {
    label: "מחירון AI מקוון",
    href: "/online/online-ai-pricing",
    desc: "תמחור שקוף לשירותי AI",
  },
  {
    label: "שירותים לעסקים",
    href: "/business/social-media",
    desc: "תוכן, פודקאסט ונוכחות דיגיטלית",
  },
] as const;
