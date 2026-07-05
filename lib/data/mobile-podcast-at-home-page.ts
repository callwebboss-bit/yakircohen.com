export const MOBILE_PODCAST_HERO_FEATURES: readonly string[] = [
  "האולפן מגיע אליכם, בית, משרד או אירוע",
  "ציוד הקלטה מקצועי + ליווי של מהנדס סאונד מקצועי - יקיר כהן",
  "תוצאה ברמת ספוטיפיי, בלי לצאת מהבית",
  "עריכה אופציונלית במקום או אחרי ההקלטה",
  "הגעה לכל הארץ, מודיעין, מרכז, ירושלים ועוד",
  "אפשרות לשלב צילום וידאו",
] as const;

export const MOBILE_PODCAST_WORKFLOW: readonly {
  emoji: string;
  title: string;
  body: string;
}[] = [
  {
    emoji: "📞",
    title: "יצירת קשר",
    body: "מתקשרים או משאירים פרטים, נחזור עם כל הפרטים.",
  },
  {
    emoji: "📅",
    title: "תיאום מועד",
    body: "קובעים תאריך ושעה נוחים לכם.",
  },
  {
    emoji: "🚐",
    title: "הגעת הצוות",
    body: "מגיעים עם כל הציוד הנדרש, אתם רק מכינים את התוכן.",
  },
  {
    emoji: "🎙️",
    title: "הקלטה",
    body: "מבצעים את ההקלטה בליווי מהנדס סאונד מקצועי - יקיר כהן.",
  },
  {
    emoji: "🎧",
    title: "עריכה (אופציונלי)",
    body: "שולחים קבצים לעריכה או מעבדים במקום, לפי מה שנוח.",
  },
  {
    emoji: "📦",
    title: "קבלת תוצר סופי",
    body: "פודקאסט מוכן במייל, וואטסאפ או USB.",
  },
] as const;

export const MOBILE_PODCAST_AUDIENCES: readonly {
  emoji: string;
  title: string;
  description: string;
  link?: { href: string; label: string };
}[] = [
  {
    emoji: "🏢",
    title: "עסקים וחברות",
    description:
      "פודקאסט ארגוני, הכשרות, תוכן שיווקי או ראיונות עם מנהלים, ישירות במשרד.",
  },
  {
    emoji: "🎓",
    title: "מוסדות חינוך",
    description:
      "פודקאסטים חינוכיים עם תלמידים, מורים או הורים, בלי הסעות למקום אחר.",
    link: {
      href: "/podcast/podcast-with-grandpa",
      label: "למידע על פודקאסט עם סבא",
    },
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "משפחות ואירועים",
    description:
      "ברכה מיוחדת או פודקאסט משפחתי, מגיעים לאולם או לבית עם הציוד.",
  },
  {
    emoji: "🎙️",
    title: "יוצרי תוכן עצמאיים",
    description:
      "מגישים, עיתונאים ובלוגרים, הקלטה בבית עם ליווי מקצועי.",
    link: {
      href: "/podcast/podcast-editing",
      label: "לשירותי עריכת פודקאסט",
    },
  },
  {
    emoji: "🏠",
    title: "אנשים פרטיים",
    description: "שיר, ברכה או פודקאסט אישי, בלי לצאת מהבית.",
    link: {
      href: "/studio/recording-song-modiin",
      label: "להקלטת שירים וברכות",
    },
  },
] as const;

export const MOBILE_PODCAST_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "range",
    question: "מה טווח ההגעה של השירות הנייד?",
    answer:
      "מגיעים לכל הארץ, מודיעין, ירושלים, תל אביב, השרון, השפלה ועוד. מחיר ההגעה משתנה לפי מרחק.",
  },
  {
    id: "quality",
    question: "האם איכות ההקלטה הניידת זהה לאולפן?",
    answer:
      "ציוד נייד מקצועי ברמה גבוהה. אולפן קבוע מבודד אקוסטית בצורה מושלמת, אבל יודעים לנטרל רעשים ולהפיק תוצאה מקצועית גם בנייד.",
  },
  {
    id: "prep",
    question: "האם צריך להכין משהו מראש?",
    answer:
      "מומלץ תסריט או נקודות לשיחה. מבחינת ציוד, אנחנו מביאים הכל. רק תבואו מוכנים לתוכן.",
  },
  {
    id: "video",
    question: "האם ניתן לשלב צילום וידאו?",
    answer:
      "בהחלט. צילום והפקת קליפים בהקלטה ניידת, כולל עריכת סרטונים קצרים לרשתות.",
  },
  {
    id: "noise",
    question: "מה קורה אם יש רעשי רקע בבית?",
    answer:
      "ציוד לנטרול רעשים + מציאת הנקודה השקטה ביותר. במידת הצורך, ניקוי בעריכה.",
  },
] as const;

export const MOBILE_PODCAST_ZERO_DISRUPTION_PHASES: readonly {
  duration: string;
  durationMinutes: number;
  title: string;
  description: string;
  type: "quiet" | "active";
}[] = [
  {
    duration: "15 דקות",
    durationMinutes: 15,
    title: "פריסה שקטה של הציוד",
    description: "מגיעים, פורסים, מסדרים. אף עובד לא מופרע.",
    type: "quiet",
  },
  {
    duration: "60 דקות",
    durationMinutes: 60,
    title: "הקלטת פודקאסט ממוקדת",
    description: "ההקלטה עצמה - ממוקדת, שקטה ומקצועית בחדר שתבחרו.",
    type: "active",
  },
  {
    duration: "15 דקות",
    durationMinutes: 15,
    title: "קיפול מלא, ניקוי המקום",
    description: "משאירים את המשרד בדיוק כפי שמצאנו אותו.",
    type: "quiet",
  },
] as const;

export const MOBILE_PODCAST_EQUIPMENT_GRID: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🎙️",
    title: "מיקרופונים מקצועיים",
    description: "ברמת אולפני שידור - רדיו ופודקאסט מובילים",
  },
  {
    emoji: "🎛️",
    title: "מיקסר דיגיטלי",
    description: "עמדת מיקסר חכמה עם עיבוד סאונד בזמן אמת",
  },
  {
    emoji: "💾",
    title: "גיבוי הקלטה כפול",
    description: "שני מכשירי הקלטה במקביל - ללא סיכון של אובדן חומר",
  },
  {
    emoji: "🎚️",
    title: "עיבוד סאונד נייד",
    description: "ינרוטל רעשים ואקוסטיקה בשטח בזמן ההקלטה",
  },
  {
    emoji: "💡",
    title: "תאורת וידאו (אופציה)",
    description: "תאורה מחמיאה לפנים - בחבילות שכוללות צילום",
  },
  {
    emoji: "📦",
    title: "הכל נארז במזוודה אחת",
    description: "פריסה ב-15 דקות, קיפול ב-15 דקות - ללא בלגן",
  },
] as const;

export const MOBILE_PODCAST_WHEN_MOBILE_WINS: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🏢",
    title: "הצוות גדול מדי לנסוע",
    description: "3 משתתפים, 2 מנהלים ומנחה - נסיעה לאולפן עולה יותר בזמן עבודה מאשר הגעתנו אליכם.",
  },
  {
    emoji: "⏱️",
    title: "לוח הזמנים צפוף",
    description: "לא מחכים לפגישות שיסתיימו מוקדם. ההקלטה קבועה לשעה שמתאימה לכם.",
  },
  {
    emoji: "🏠",
    title: "רוצים את הנוחות של הסביבה המוכרת",
    description: "הביטחון העצמי עולה כשמקליטים במשרד או בבית. פחות לחץ, תוצאה טובה יותר.",
  },
  {
    emoji: "🔒",
    title: "תוכן רגיש שלא יוצא ממשרד",
    description: "ראיון הנהלה, הכשרה פנימית, תוכן אסטרטגי - עדיף שיישאר בין הקירות שלכם.",
  },
  {
    emoji: "♿",
    title: "נגישות ושיקולי ניידות",
    description: "קשישים, אנשים עם מוגבלות ניידות, או כל מי שנסיעה לאולפן היא עיכוב מיותר.",
  },
  {
    emoji: "📍",
    title: "רחוק מהאולפן",
    description: "נמצאים בצפון, דרום או במקום שמרחקו מאולפן קבוע הוא שעת נהיגה - הנייד שווה את ההשקעה.",
  },
] as const;

export const MOBILE_PODCAST_RELATED_LINKS: readonly {
  emoji: string;
  label: string;
  href: string;
  description: string;
}[] = [
  {
    emoji: "🎧",
    label: "עריכת פודקאסט מלאה",
    href: "/podcast/podcast-editing",
    description: "חיתוך, ניקוי ומאסטרינג לפרק שכבר הקלטתם.",
  },
  {
    emoji: "🎬",
    label: "הפקת קליפים",
    href: "/studio/blessings/video-clip",
    description: "קליפ וידאו לשיר או ברכה מהאולפן.",
  },
  {
    emoji: "📱",
    label: "עריכת סרטונים קצרים",
    href: "/business/social-media",
    description: "רילז ושורטס לעסקים, גם מהחומר שהקלטנו אצלכם.",
  },
  {
    emoji: "🏠",
    label: "ייעוץ אקוסטיקה ובניית אולפן",
    href: "/academy/home-studio",
    description: "קורס לבניית אולפן ביתי שעובד.",
  },
  {
    emoji: "🎙️",
    label: "השכרת סטודיו במודיעין",
    href: "/podcast/podcast-studio-modiin",
    description: "מעדיפים להגיע אלינו? אולפן קבוע במודיעין.",
  },
  {
    emoji: "🎤",
    label: "הקלטת שירים וברכות",
    href: "/studio/recording-song-modiin",
    description: "שיר מקורי או ברכה לאירוע במתנה.",
  },
  {
    emoji: "📦",
    label: "הזמנה ומחירון",
    href: "/book",
    description: "בדיקת מחיר ותיאום דרך טופס ההזמנה.",
  },
] as const;
