export type TechBarrierReliefConfig = {
  title: string;
  intro: string;
  items: readonly {
    title: string;
    body: string;
  }[];
  closer: string;
};

const REMOTE_AUDIO_CONFIG: TechBarrierReliefConfig = {
  title: "חסמים טכנולוגיים שלא צריכים לעצור אתכם",
  intro:
    "השירות הזה בנוי למי שרוצה לשלוח קובץ ולקבל תוצאה, בלי להיכנס לעולם של ציוד, תוכנות והגדרות.",
  items: [
    {
      title: "אין צורך בידע בסאונד",
      body: "לא צריך להבין ב-EQ, קומפרסיה, LUFS או תיקון זיופים. מספיק להסביר מה מפריע לכם בקובץ.",
    },
    {
      title: "אין צורך ברכישת תוכנות",
      body: "לא צריך לקנות תוכנת עריכה, פלאגינים או כלי AI לפני שמתחילים. העבודה נעשית אצלנו.",
    },
    {
      title: "אין צורך בהבנה טכנית",
      body: "לא צריך לדעת פורמטים, הגדרות יצוא או שרשרת עיבוד. שולחים קובץ, מקבלים קובץ מוכן.",
    },
  ],
  closer:
    "אצלנו זה עובד פשוט: שולחים קובץ, מסבירים מה מפריע, ומקבלים חזרה קובץ מסודר והסבר קצר מה תוקן.",
};

const PODCAST_CONFIG: TechBarrierReliefConfig = {
  title: "לא צריך להפוך לטכנאי כדי להוציא פודקאסט",
  intro:
    "העמוד הזה מיועד למי שרוצה לבוא, לדבר ולצאת עם פרק, בלי לבנות לבד שרשרת של ציוד, צילום ועריכה.",
  items: [
    {
      title: "אין צורך בידע בסאונד",
      body: "לא צריך לדעת איך עובדים עם מיקרופונים, עוצמות, אקוסטיקה או ניקוי רעשים.",
    },
    {
      title: "אין צורך ברכישת תוכנות",
      body: "לא צריך לקנות DAW, תוכנת עריכה, כתוביות או כלי הפצה רק כדי להתחיל.",
    },
    {
      title: "אין צורך בהבנה טכנית",
      body: "לא צריך להבין ב-RSS, codecs, מצלמות או routing. אתם מתמקדים בתוכן, אנחנו בשרשרת הטכנית.",
    },
  ],
  closer:
    "אצלנו לא מלמדים את הלקוח איך להפיק פודקאסט לפני שמתחילים. מגיעים, מדברים, ומקבלים חומר מוכן להעלאה.",
};

const STUDIO_CONFIG: TechBarrierReliefConfig = {
  title: "לא צריך להגיע עם רקע טכני",
  intro:
    "עמודי האולפן מיועדים גם למי שלא עמד מול מיקרופון בחיים. המטרה היא תוצאה טובה, לא מבחן במונחים.",
  items: [
    {
      title: "אין צורך בידע בסאונד",
      body: "לא צריך לדעת איך עומדים מול מיקרופון, איך עובדים עם אוזניות או איך שומרים על דינמיקה.",
    },
    {
      title: "אין צורך ברכישת תוכנות",
      body: "לא צריך לבוא עם תוכנת הפקה, פלאגינים או כלי תיקון קול. סביבת העבודה כבר קיימת באולפן.",
    },
    {
      title: "אין צורך בהבנה טכנית",
      body: "לא צריך להבין פורמטים, קצב דגימה או מושגי הקלטה. אתם מביאים את התוכן, ואנחנו את הביצוע הטכני.",
    },
  ],
  closer:
    "אצלנו ההדרכה, ההקלטה והליטוש קורים בתוך הסשן. אתם מגיעים עם רעיון, ואנחנו מחזיקים את כל הצד הטכני.",
};

const VOICEOVER_CONFIG: TechBarrierReliefConfig = {
  title: "לא צריך ידע טכני כדי להפיק קול נקי וברור",
  intro:
    "השירות מתאים גם למי שצריך קול ברור ומסודר, בלי להבין בהקלטה, טלפוניה, עריכה או מסירה.",
  items: [
    {
      title: "אין צורך בידע בסאונד",
      body: "לא צריך להבין במיקרופונים, רעש, מרחק מהפה או עריכת נשימות.",
    },
    {
      title: "אין צורך ברכישת תוכנות",
      body: "לא צריך לקנות תוכנת הקלטה או כלי processing כדי להפיק קריינות usable.",
    },
    {
      title: "אין צורך בהבנה טכנית",
      body: "לא צריך לדעת איך מרכזייה מקבלת קבצים או איך לחלק גרסאות. אנחנו מוסרים קבצים בפורמט המתאים.",
    },
  ],
  closer:
    "אצלנו הלקוח מתמקד במסר ובטקסט. ההקלטה, העריכה והקבצים הסופיים נסגרים אצלנו.",
};

const BUSINESS_AUDIO_CONFIG: TechBarrierReliefConfig = {
  title: "תעבירו חומרים — לא צריך מחלקת סאונד",
  intro:
    "העמודים האלה לעסקים שרוצים בריף, טקסט או הקלטה קצרה, וקבצים מוכנים לשימוש. לא צריך להפוך את השיווק, HR או התפעול למחלקת הפקה.",
  items: [
    {
      title: "אין צורך בידע בסאונד",
      body: "לא צריך להבין במיקרופונים, loudness, אקוסטיקה או עריכת קול. מספיק לדעת מה צריך לצאת ולאן זה הולך.",
    },
    {
      title: "אין צורך ברכישת תוכנות",
      body: "לא צריך רישוי לכלי עריכה, כתוביות, קריינות או AI בשביל פרויקט אחד. העבודה נסגרת אצלנו.",
    },
    {
      title: "אין צורך בהבנה טכנית",
      body: "לא צריך לנהל פורמטים, גרסאות או מסירות. מעבירים חומרים, מאשרים כיוון, ומקבלים נכס מוכן.",
    },
  ],
  closer:
    "אצלנו זה עובד כך: מעבירים חומרים, מאשרים, ומקבלים קבצים מוכנים לפרסום, לעובדים או ללקוחות — בלי workflow טכני באמצע.",
};

const LEARNING_CONFIG: TechBarrierReliefConfig = {
  title: "לא צריך setup מושלם כדי להתחיל ללמוד",
  intro:
    "בעמודי הלימוד הרלוונטיים אפשר להתחיל גם בלי בסיס טכני. קודם מבינים כיוון ושיטה — לא קונים ציוד.",
  items: [
    {
      title: "אין צורך בידע בסאונד",
      body: "לא צריך להגיע עם מושגים סגורים או ניסיון קודם. מתחילים מהרמה שלכם ומתקדמים משם.",
    },
    {
      title: "אין צורך ברכישת תוכנות",
      body: "לא צריך לקנות DAW, פלאגינים או ציוד לפני שמבינים מה באמת צריך. בוחרים כלים רק אחרי כיוון ברור.",
    },
    {
      title: "אין צורך בהבנה טכנית",
      body: "לא צריך לבוא עם setup מושלם, מונחים או רשימת ציוד. בונים הבנה תוך כדי עבודה, לא לפני.",
    },
  ],
  closer:
    "אצלנו לא מתחילים מרשימת קניות. קודם בונים אוזן, שיטה ובסיס עבודה — ורק אחר כך מחליטים מה באמת חסר.",
};

export function resolveTechBarrierRelief(
  pathname?: string | null,
): TechBarrierReliefConfig | null {
  if (!pathname) return null;

  if (pathname === "/online/vocal-fix/send-file") return null;
  if (pathname === "/podcast/self-service-studio") return null;
  if (pathname === "/studio/pricing" || pathname === "/studio/upload") return null;

  if (pathname.startsWith("/online")) return REMOTE_AUDIO_CONFIG;
  if (pathname.startsWith("/podcast")) return PODCAST_CONFIG;
  if (pathname.startsWith("/studio")) return STUDIO_CONFIG;
  if (pathname.startsWith("/voiceover")) return VOICEOVER_CONFIG;

  if (
    pathname === "/academy" ||
    pathname === "/academy/dj-course" ||
    pathname === "/academy/music-production" ||
    pathname === "/academy/voiceover" ||
    pathname === "/academy/ai-music" ||
    pathname === "/academy/home-studio"
  ) {
    return LEARNING_CONFIG;
  }

  if (
    pathname === "/business/professional-voiceover" ||
    pathname === "/business/audio-branding" ||
    pathname === "/business/audiobooks" ||
    pathname === "/business/on-site-studio" ||
    pathname === "/business/content-studio"
  ) {
    return BUSINESS_AUDIO_CONFIG;
  }

  return null;
}
