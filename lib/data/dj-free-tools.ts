export type DjFreeTool = {
  id: string;
  name: string;
  url: string;
  summary: string;
  freeTier: string;
  paidNote?: string;
  whenProBetter: string;
};

export type DjToolCategory = {
  id: string;
  title: string;
  intro: string;
  tools: readonly DjFreeTool[];
};

export type DjPromptTemplate = {
  id: string;
  title: string;
  prompt: string;
  useCase: string;
};

export const DJ_FREE_TOOLS_LAST_VERIFIED = "2026-06";

export const DJ_FREE_TOOL_CATEGORIES: readonly DjToolCategory[] = [
  {
    id: "stems",
    title: "פיצול ערוצים (Stems)",
    intro:
      "מפרידים ווקאל, תופים, בס ומלודיה - לפני מאשאפ, אקפלה או עריכה. חלק מהכלים חינמיים לשימוש בסיסי.",
    tools: [
      {
        id: "fadr",
        name: "Fadr",
        url: "https://fadr.com/stems",
        summary: "פיצול stems, זיהוי BPM, סולם ואקורדים. יש גם Remix Maker ו-DJ Controller.",
        freeTier: "Fadr Basic - stems ו-MP3 בחינם, ללא הגבלת שימוש בסיסי",
        paidNote: "Fadr Plus - $10/חודש: WAV, stems נפרדים לתופים, פלאגין VST",
        whenProBetter:
          "כשצריך מאשאפ מוכן לאירוע מחר - עריכה ידנית באולפן חוסכת שעות ניסוי.",
      },
      {
        id: "moises",
        name: "Moises",
        url: "https://moises.ai",
        summary: "הפרדת ווקאל וכלים, שינוי קצב וסולם בדפדפן.",
        freeTier: "גרסה חינמית מוגבלת - מספיקה לבדיקה מהירה",
        whenProBetter: "למאשאפ מדויק עם מעברים - כלי AI לא מחליף עורך.",
      },
      {
        id: "uvr5",
        name: "Ultimate Vocal Remover (UVR5)",
        url: "https://github.com/Anjok07/ultimatevocalremovergui",
        summary: "תוכנה חינמית למחשב - הפרדה אופליין באיכות גבוהה.",
        freeTier: "חינם לחלוטין - דורש התקנה מקומית",
        whenProBetter: "אם אין זמן להתעסק עם מודלים - שולחים לנו את השירים.",
      },
    ],
  },
  {
    id: "ai-music",
    title: "יצירת מוזיקה ב-AI",
    intro:
      "לרעיונות, לופים וגרסאות ניסיון. לפני שמנגנים באירוע - בודקים רישוי ואיכות.",
    tools: [
      {
        id: "suno",
        name: "Suno",
        url: "https://suno.com",
        summary: "יצירת שירים ולופים מטקסט. אפשר לייצא stems בחבילות מתקדמות.",
        freeTier: "קרדיטים יומיים חינם - מספיק לניסוי",
        paidNote: "Premier - ייצוא stems ו-Suno Studio",
        whenProBetter:
          "מוזיקת AI לא תמיד מורשית לאירועים חיים. לרמיקס מוכן לרחבה - עדיף עריכה מקצועית.",
      },
      {
        id: "udio",
        name: "Udio",
        url: "https://udio.com",
        summary: "יצירת טראקים מלאים לפי סגנון וטקסט.",
        freeTier: "קרדיטים חינמיים מוגבלים",
        whenProBetter: "למאשאפ שעובד בפועל בחתונה - עריכה על שירים מוכרים.",
      },
    ],
  },
  {
    id: "dj-software",
    title: "תוכנת DJ וניתוח",
    intro: "כלים שכבר בתוך הנגן שלכם, או לבדיקת BPM וסולם לפני עריכה.",
    tools: [
      {
        id: "rekordbox_stems",
        name: "Rekordbox 7 Stems",
        url: "https://rekordbox.com",
        summary: "פיצול stems בזמן אמת על הדק - Vocal, Drums, Bass, Instrumental.",
        freeTier: "כלול ב-Rekordbox - עובד על CDJ-3000 ו-DDJ-FLX10",
        whenProBetter:
          "למאשאפים מתוכננים מראש - stems אופליין (Fadr/UVR) נקיים יותר מ-stems חיים.",
      },
      {
        id: "tunebat",
        name: "Tunebat",
        url: "https://tunebat.com",
        summary: "BPM, סולם Camelot ואנרגיה לשירים - לפני שמתחילים לערוך.",
        freeTier: "חיפוש חינמי - מספיק לרוב השירים הפופולריים",
        whenProBetter: "יודעים את הסולמות אבל אין זמן לערוך? אנחנו בונים את המאשאפ.",
      },
      {
        id: "serato",
        name: "Serato DJ",
        url: "https://serato.com",
        summary: "ניהול ספרייה, Stems (בגרסאות נתמכות) ופלייליסטים.",
        freeTier: "תלוי בחבילה - Stems ב-Performance mode",
        whenProBetter: "סט שלם מחובר בקצב - ראו סטים מוכנים או מאשאפים מהמאגר.",
      },
    ],
  },
  {
    id: "yakir-online",
    title: "שירותים באתר",
    intro: "כשהקובץ צריך יותר מכלי חינמי - אותה צוות, אותו אולפן.",
    tools: [
      {
        id: "vocal_fix",
        name: "שיפור קול ואודיו",
        url: "/online/vocal-fix",
        summary: "ניקוי רעשים, איזון ווליום, תיקון זיופים.",
        freeTier: "ייעוץ היתכנות - בוואטסאפ לפני הזמנה",
        whenProBetter: "הקלטה גרועה שצריכה הצלה לפני שילוב בסט.",
      },
      {
        id: "voice_tags",
        name: "תג קולי לדיג'יי",
        url: "/events/dj/voice-tags",
        summary: "משפט ממותג עם אפקטים - מוכן לנגן.",
        freeTier: "--",
        whenProBetter: "מיתוג סט בלי לשבת על עריכה.",
      },
    ],
  },
] as const;

export const DJ_GEMINI_PROMPT_TEMPLATES: readonly DjPromptTemplate[] = [
  {
    id: "wedding_set_plan",
    title: "תכנון סט חתונה",
    useCase: "לפני פגישה עם הזוג - מבנה ערב מסודר",
    prompt: `אני דיג'יי לחתונה בישראל. עזור לי לבנות מבנה ערב:
- קבלת פנים (60 דק', BPM נמוך)
- כניסה לחופה (שיר אחד)
- רחבה (3 שעות, מזרחית + מיינסטרים)
- סלואו הורים
- שירים אסורים: [רשימה]
- שירים חובה: [רשימה]
תן לי סדר שירים לוגי עם הערות BPM ורגעי שיא.`,
  },
  {
    id: "mashup_feasibility",
    title: "בדיקת היתכנות מאשאפ",
    useCase: "לפני שמתחילים לערוך - האם השילוב בכלל עובד",
    prompt: `שיר א: [שם + אמן]
שיר ב: [שם + אמן]
אני רוצה לשלב אותם למאשאפ לחתונה.
תבדוק: BPM משוער, סולמות (Camelot), איזה חלק מכל שיר לשלב, ומה נקודת המיזוג הטובה ביותר.
תן תשובה קצרה ומעשית.`,
  },
  {
    id: "do_not_play",
    title: "רשימת שירים אסורים - ניסוח לזוג",
    useCase: "לשלוח לזוג לפני האירוע",
    prompt: `נסח לי הודעה מקצועית ונעימה לזוג מתחתנים:
אני צריך רשימת שירים שלא לנגן (do-not-play) ורשימת שירים חובה.
הסבר למה זה חשוב לזרימת הערב, בטון חם ולא פורמלי.`,
  },
] as const;
