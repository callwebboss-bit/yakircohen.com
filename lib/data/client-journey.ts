import { DATE_HOLD_TERMS_BODY, TIME_CLAIMS } from "@/lib/data/conversion-copy";

export type JourneyVariant = "general" | "studio" | "events" | "online" | "podcast";

export type JourneyStep = {
  number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
};

export type JourneyVariantConfig = {
  id: JourneyVariant;
  label: string;
  anchor: string;
  steps: JourneyStep[];
};

export const CLIENT_JOURNEY_VARIANTS: readonly JourneyVariantConfig[] = [
  {
    id: "general",
    label: "כללי",
    anchor: "general",
    /* תוכנית הבהירות, שלב 7 (בחירת הבעלים 12.10.2026): במקום "ניתוח, ביצוע, מסירה"
       המופשט, שלושה צעדים מוחשיים. רק עובדות מאושרות: זמן התשובה מ-TIME_CLAIMS
       (D62), "ביד בסוף ההקלטה" לשיר (S1002-01) ולפודקאסט, ודוגמה לפני תשלום
       בשירותים מרחוק (/whats-included, החלטת הבעלים 11.10.2026). */
    steps: [
      {
        number: 1,
        title: "פונים",
        description: `שולחים הודעה בוואטסאפ או מזמינים באתר. הצעה ${TIME_CLAIMS.quoteHour}.`,
      },
      {
        number: 2,
        title: "קובעים",
        description:
          "סוגרים מה עושים, איפה ומתי: באולפן במודיעין, מרחוק או באירוע שלכם.",
      },
      {
        number: 3,
        title: "מקבלים",
        description:
          "שיר או פרק פודקאסט מקבלים ביד בסוף ההקלטה. בשירות מרחוק רואים דוגמה לפני שמשלמים.",
      },
    ],
  },
  {
    id: "studio",
    label: "אולפן",
    anchor: "studio",
    /* תוכנית הבהירות, שלב 8 (בחירת הבעלים 12.10.2026): במקום "קליטת דרישות
       טכניות, התאמת ציוד ואקוסטיקה" המקצועי, ארבעה צעדים מוחשיים שמתאימים לכל
       שירות באולפן, כולל קריינות. רק עובדות מאושרות: זמן התשובה (D62), שריון
       במקדמה (DATE_HOLD_TERMS_BODY), הטכנאי מקליט ומנחה (D82), ו"ביד בסוף
       הסשן" רק לשיר ולפודקאסט (S1002-01, D107). */
    steps: [
      {
        number: 1,
        title: "פונים",
        description: `הודעה בוואטסאפ או הזמנה באתר. הצעה ${TIME_CLAIMS.quoteHour}.`,
      },
      {
        number: 2,
        title: "קובעים מועד",
        description: `סוגרים מה מקליטים ומתי, ${DATE_HOLD_TERMS_BODY}.`,
      },
      {
        number: 3,
        title: "באולפן",
        description: "הטכנאי מקליט ומנחה בזמן אמת. לא צריך ניסיון.",
      },
      {
        number: 4,
        title: "מקבלים",
        description: "קובץ מוכן, WAV או MP3. שיר ופודקאסט ביד בסוף הסשן.",
      },
    ],
  },
  {
    id: "events",
    label: "אירועים",
    anchor: "events",
    /* תוכנית הבהירות (בחירת הבעלים 12.10.2026): במקום "קליטת דרישות טכניות,
       התאמת מפרט החומרה" המקצועי, ארבעה צעדים מוחשיים. רק עובדות מאושרות: זמן
       התשובה (D62), שריון במקדמה (DATE_HOLD_TERMS_BODY), פגישה ורשימות
       (dj-events-page.ts), וציוד גיבוי (services.ts, שאלות ה-DJ). */
    steps: [
      {
        number: 1,
        title: "פונים",
        description: `שולחים תאריך, מקום ומספר אורחים. הצעה ${TIME_CLAIMS.quoteHour}.`,
      },
      {
        number: 2,
        title: "משריינים",
        description: `התאריך שלכם ${DATE_HOLD_TERMS_BODY}.`,
      },
      {
        number: 3,
        title: "מתכננים",
        description: "פגישה, רשימות שירים ורגעי השיא של הערב.",
      },
      {
        number: 4,
        title: "באירוע",
        description:
          "מגיעים, מקימים ובודקים סאונד לפני הפתיחה, עם ציוד גיבוי לכל דבר קריטי.",
      },
    ],
  },
  {
    id: "online",
    label: "עריכה מרחוק",
    anchor: "online",
    /* תוכנית הבהירות (בחירת הבעלים 12.10.2026): במקום "ניתוח, ביצוע, מסירה",
       הצעדים של הדוגמה לפני תשלום, באותן עובדות של ONLINE_SAMPLE_RULES
       (legal-trust-copy.ts, /whats-included). */
    steps: [
      {
        number: 1,
        title: "שולחים",
        description:
          "שולחים את הקובץ. יקיר שומע או רואה אותו ואומר מה אפשר להוציא ממנו.",
      },
      {
        number: 2,
        title: "דוגמה חינם",
        description:
          "קטע של 30 שניות לפני ואחרי, או תמונה אחת. אם אי אפשר לשפר, לא משלמים.",
      },
      {
        number: 3,
        title: "מקבלים",
        description:
          "משלמים רק אם רוצים את הקובץ המלא, ומקבלים אותו מוכן להעלאה.",
      },
    ],
  },
  {
    id: "podcast",
    label: "פודקאסט",
    anchor: "podcast",
    /* תוכנית הבהירות (בחירת הבעלים 12.10.2026): במקום "ניתוח, ביצוע, מסירה",
       שלושה צעדים מוחשיים. רק עובדות מאושרות: שריון במקדמה
       (DATE_HOLD_TERMS_BODY), החיתוך בין המצלמות והפרק "באותה שנייה"
       (TIME_CLAIMS.podcastSameSecond, D107). */
    steps: [
      {
        number: 1,
        title: "קובעים",
        description: `מספרים כמה משתתפים ואיזה פורמט, ומשריינים מועד ${DATE_HOLD_TERMS_BODY}.`,
      },
      {
        number: 2,
        title: "מקליטים",
        description:
          "באולפן במודיעין או באולפן נייד. החיתוך בין המצלמות לפי מי שמדבר קורה תוך כדי ההקלטה.",
      },
      {
        number: 3,
        title: "מקבלים",
        description: `${TIME_CLAIMS.podcastSameSecond}.`,
      },
    ],
  },
] as const;

export function getJourneyVariant(id: JourneyVariant): JourneyVariantConfig {
  const found = CLIENT_JOURNEY_VARIANTS.find((v) => v.id === id);
  return found ?? CLIENT_JOURNEY_VARIANTS[0];
}
