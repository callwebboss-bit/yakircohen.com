export const PODCAST_GRANDPA_EXAMPLE_VIDEO = {
  videoId: "GFYoIU-UseE",
  title: "פודקאסט עם סבא או סבתא — דוגמה מהאולפן",
} as const;

export const PODCAST_GRANDPA_HERO_FEATURES: readonly string[] = [
  "פודקאסט משפחתי + הקלטת שיר באולפן",
  "חוויה של כשעה–שעתיים באולפן במודיעין",
  "תיעוד סיפורי חיים והגשמת חלום",
  "פודקאסט ערוך, שיר מוקלט וקליפ וידאו",
  "גלריית תמונות ועמוד פרטי למשפחה",
  "מתנה מקורית ליום הולדת ויובל",
] as const;

export const PODCAST_GRANDPA_DAY_PARTS: readonly {
  emoji: string;
  title: string;
  description: string;
  link?: { href: string; label: string };
}[] = [
  {
    emoji: "☕",
    title: "קבלת פנים כמו שצריך",
    description:
      "מתחילים רגוע  -  קפה, משהו קטן לנשנש, וזמן לצלם סלפי משפחתי לפני ההקלטה. אין לחץ, אין לוח זמנים קפדני.",
  },
  {
    emoji: "🎙️",
    title: "חלק ראשון: הפודקאסט המשפחתי (כשעה)",
    description:
      "סיפורים מהחיים, אנקדוטות ורגעים מיוחדים עם סבא וסבתא  -  מתועדים לנצח. «שאלות מהלב»  -  כל בן משפחה שואל שאלה אחת ומקבל תשובה כנה, מוקלטת.",
    link: {
      href: "/podcast/podcast-recording",
      label: "למידע על הקלטת פודקאסטים",
    },
  },
  {
    emoji: "🎵",
    title: "חלק שני: השיא  -  הקלטת השיר באולפן",
    description:
      "סבא או סבתא בוחרים שיר, והמשפחה מעודדת מאחורי החלון. אנחנו דואגים לסאונד, עיבוד ואיכות  -  אתם רק חווים את הרגע.",
    link: {
      href: "/studio/pricing",
      label: "לצפייה במחירון אולפן",
    },
  },
] as const;

export const PODCAST_GRANDPA_DELIVERABLES: readonly {
  title: string;
  description: string;
  link?: { href: string; label: string };
}[] = [
  {
    title: "פודקאסט משפחתי ערוך",
    description: "קובץ MP3 איכותי עם כל השיחה, ערוך בצורה מקצועית.",
  },
  {
    title: "שיר מוקלט",
    description: "השיר של סבא/סבתא, מעובד סאונד  -  מוכן להאזנה שוב ושוב.",
  },
  {
    title: "סרטון וידאו מרגש",
    description: "קליפ ערוך של 3–5 דקות מהרגעים היפים באולפן.",
    link: { href: "/studio/blessings/video-clip", label: "פרטים על הפקת קליפים" },
  },
  {
    title: "גלריית תמונות",
    description: "כל התמונות מהחוויה  -  מסודרות ונגישות.",
    link: { href: "/photo-slideshow", label: "פרטים על מצגת תמונות" },
  },
  {
    title: "עמוד אינטרנט פרטי",
    description: "לינק אחד עם כל התוצרים  -  לשיתוף עם משפחה בחו\"ל.",
  },
  {
    title: "אפשרות לשדרוג",
    description: "מצגת תמונות מורחבת או קליפ ארוך יותר.",
  },
] as const;

export const PODCAST_GRANDPA_AUDIENCES: readonly {
  emoji: string;
  title: string;
  description: string;
  link?: { href: string; label: string };
}[] = [
  {
    emoji: "🎂",
    title: "מתנת יום הולדת מיוחדת",
    description: "גיל 70, 80, 90  -  מתנה שתישאר לדורות במקום עוד ארוחה.",
    link: { href: "/voucher", label: "רעיונות נוספים למתנות" },
  },
  {
    emoji: "💍",
    title: "יום נישואין משמעותי",
    description: "נישואי זהב, כסף או כל יובל  -  חגיגת הדרך המשותפת.",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "שמירת זיכרונות משפחתיים",
    description: "הזמן עובר  -  הגיע הזמן לתעד את הסיפורים כמו שצריך.",
  },
  {
    emoji: "🎉",
    title: "פעילות משפחתית מחברת",
    description: "זמן איכות ביחד, עם משהו משמעותי שקורה.",
  },
] as const;

export const PODCAST_GRANDPA_PRICING_ARTICLE = {
  href: "/studio/pricing",
  title: "מחירי אולפני הקלטות: מה באמת קובע את המחיר",
  subtitle: "שירות, זמן או תוצאה? תכל׳ס: כך בוחרים אולפן נכון.",
} as const;

export const PODCAST_GRANDPA_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "prep",
    question: "האם צריך להכין חומרים מראש?",
    answer:
      "מומלץ להכין רשימת שאלות ולבחור שיר להקלטה. נשמח לייעץ ולעזור בבחירה.",
  },
  {
    id: "participants",
    question: "כמה אנשים יכולים להשתתף?",
    answer:
      "עד 6–8 משתתפים בו-זמנית. למשפחות גדולות  -  תיאום בתורות או במועדים נפרדים.",
  },
  {
    id: "singing",
    question: "האם סבא/סבתא צריכים לדעת לשיר?",
    answer:
      "ממש לא. מלווים מקצועית, מכוונים את הקול ומפיקים תוצאה נהדרת גם בלי ניסיון קודם.",
  },
  {
    id: "video",
    question: "האם ניתן לצלם וידאו במהלך ההקלטה?",
    answer:
      "בהחלט. כולל צילום וידאו של הרגעים ועריכת קליפ מסכם.",
  },
  {
    id: "price",
    question: "מה המחיר של החוויה?",
    answer:
      "המחיר משתנה לפי החבילה (פודקאסט בלבד, שיר בלבד, או חבילה מלאה). ראו את מחירון האולפן לפרטים.",
  },
] as const;

export const PODCAST_GRANDPA_RELATED_LINKS: readonly {
  emoji: string;
  label: string;
  href: string;
}[] = [
  { emoji: "🎙️", label: "אולפן הקלטות במודיעין", href: "/podcast/podcast-studio-modiin" },
  { emoji: "🎵", label: "הקלטת שירים וברכות", href: "/studio/recording-song-modiin" },
  { emoji: "🎬", label: "הפקת קליפים", href: "/studio/blessings/video-clip" },
  { emoji: "🖼️", label: "מצגת תמונות לאירוע", href: "/photo-slideshow" },
  { emoji: "🎁", label: "שיר/קליפ במתנה", href: "/voucher" },
  { emoji: "📦", label: "הזמנת שירותים", href: "/book" },
] as const;
