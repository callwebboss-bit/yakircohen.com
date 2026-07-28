import type { LeadFlowServiceId } from "./services";

export type DiscoveryQuestionOption = {
  id: string;
  label: string;
};

export type DiscoveryQuestion = {
  id: string;
  prompt: string;
  options: readonly DiscoveryQuestionOption[];
};

const EVENT_COMMON: readonly DiscoveryQuestion[] = [
  {
    id: "eventType",
    prompt: "סוג האירוע?",
    options: [
      { id: "wedding", label: "חתונה / חופה" },
      { id: "bar", label: "בר / בת מצווה" },
      { id: "corporate", label: "אירוע עסקי" },
      { id: "other", label: "אחר" },
    ],
  },
  {
    id: "guestCount",
    prompt: "כמה אורחים בערך?",
    options: [
      { id: "up100", label: "עד 100" },
      { id: "100-250", label: "100-250" },
      { id: "250-500", label: "250-500" },
      { id: "500plus", label: "מעל 500" },
    ],
  },
  {
    id: "eventArea",
    prompt: "איפה בארץ האירוע?",
    options: [
      { id: "modiin-area", label: "מודיעין והסביבה" },
      { id: "jerusalem", label: "ירושלים" },
      { id: "center", label: "מרכז" },
      { id: "north-south", label: "צפון / דרום / נסיעה ארוכה" },
    ],
  },
  {
    id: "venue",
    prompt: "איפה מתקיים האירוע?",
    options: [
      { id: "indoor", label: "אולם סגור" },
      { id: "outdoor", label: "חוץ / גן" },
      { id: "home", label: "בית / חצר" },
      { id: "unknown", label: "עדיין לא יודע" },
    ],
  },
  {
    id: "dateReady",
    prompt: "יש תאריך סגור?",
    options: [
      { id: "yes", label: "כן, תאריך ידוע" },
      { id: "flexible", label: "גמיש" },
      { id: "soon", label: "בחודש הקרוב" },
    ],
  },
  {
    id: "techNeed",
    prompt: "מה חשוב בתפעול?",
    options: [
      { id: "operator", label: "מפעיל במקום" },
      { id: "timing", label: "תזמון מדויק עם DJ / טקס" },
      { id: "backup", label: "גיבוי ציוד" },
      { id: "basic", label: "ציוד בסיסי בלבד" },
    ],
  },
];

export const DISCOVERY_QUESTIONS: Record<
  LeadFlowServiceId,
  readonly DiscoveryQuestion[]
> = {
  confetti: EVENT_COMMON,
  bubbles: EVENT_COMMON,
  "heavy-smoke": [
    ...EVENT_COMMON.slice(0, 4),
    {
      id: "smokeApproval",
      prompt: "יש אישור אולם לעשן / תקרה גבוהה?",
      options: [
        { id: "yes", label: "כן, מאושר" },
        { id: "check", label: "צריך לבדוק עם האולם" },
        { id: "no", label: "לא / מוגבל" },
      ],
    },
  ],
  song: [
    {
      id: "songGoal",
      prompt: "למה מיועדת ההקלטה?",
      options: [
        { id: "gift", label: "מתנה / ברכה" },
        { id: "cover", label: "קאבר אישי" },
        { id: "release", label: "שחרור / סטרימינג" },
        { id: "audition", label: "אודישן" },
      ],
    },
    {
      id: "songReady",
      prompt: "יש פלייבק או מילים מוכנים?",
      options: [
        { id: "playback", label: "יש פלייבק" },
        { id: "lyrics", label: "יש מילים בלבד" },
        { id: "needHelp", label: "צריך עזרה בבחירה" },
      ],
    },
    {
      id: "songWhere",
      prompt: "מאיפה מגיעים לאולפן?",
      options: [
        { id: "modiin-area", label: "מודיעין והסביבה" },
        { id: "jerusalem", label: "ירושלים" },
        { id: "center", label: "מרכז" },
        { id: "other", label: "אזור אחר" },
      ],
    },
    {
      id: "songExperience",
      prompt: "ניסיון בהקלטה?",
      options: [
        { id: "first", label: "פעם ראשונה" },
        { id: "some", label: "הקלטתי בעבר" },
        { id: "pro", label: "עובד באופן קבוע" },
      ],
    },
    {
      id: "songDelivery",
      prompt: "מתי צריך את הקובץ?",
      options: [
        { id: "asap", label: "עד 24 שעות" },
        { id: "week", label: "תוך שבוע" },
        { id: "flexible", label: "גמיש" },
      ],
    },
  ],
  podcast: [
    {
      id: "podcastFormat",
      prompt: "פורמט?",
      options: [
        { id: "audio", label: "אודיו בלבד" },
        { id: "video", label: "וידאו" },
        { id: "unsure", label: "עדיין לא בטוח" },
      ],
    },
    {
      id: "participants",
      prompt: "כמה משתתפים בהקלטה?",
      options: [
        { id: "1-2", label: "1-2" },
        { id: "3-4", label: "3-4" },
        { id: "5plus", label: "5+" },
      ],
    },
    {
      id: "podcastPlace",
      prompt: "איפה להקליט?",
      options: [
        { id: "studio", label: "באולפן במודיעין" },
        { id: "mobile", label: "נייד עד אליכם" },
        { id: "either", label: "גמיש" },
      ],
    },
    {
      id: "podcastArea",
      prompt: "מאיזה אזור אתם?",
      options: [
        { id: "modiin-area", label: "מודיעין והסביבה" },
        { id: "jerusalem", label: "ירושלים" },
        { id: "center", label: "מרכז" },
        { id: "north-south", label: "צפון / דרום" },
      ],
    },
    {
      id: "podcastSeries",
      prompt: "פרק בודד או סדרה?",
      options: [
        { id: "pilot", label: "פיילוט / פרק אחד" },
        { id: "series", label: "סדרה קבועה" },
        { id: "brand", label: "תוכן מותג / עסק" },
      ],
    },
  ],
  "mobile-studio": [
    {
      id: "mobileUse",
      prompt: "למה צריך אולפן נייד?",
      options: [
        { id: "podcast", label: "פודקאסט / ראיון" },
        { id: "event", label: "אירוע / כנס" },
        { id: "school", label: "בית ספר / מוסד" },
        { id: "other", label: "אחר" },
      ],
    },
    {
      id: "mobileLocation",
      prompt: "אזור הגעה?",
      options: [
        { id: "modiin", label: "מודיעין והסביבה" },
        { id: "jerusalem", label: "ירושלים" },
        { id: "center", label: "מרכז (רחובות / פ\"ת / אשדוד)" },
        { id: "far", label: "צפון / דרום / נסיעה ארוכה" },
      ],
    },
    {
      id: "mobileDuration",
      prompt: "משך ההקלטה המשוער?",
      options: [
        { id: "2h", label: "עד שעתיים" },
        { id: "half", label: "חצי יום" },
        { id: "full", label: "יום מלא" },
      ],
    },
    {
      id: "mobileTech",
      prompt: "מה נדרש במקום?",
      options: [
        { id: "audio", label: "אודיו בלבד" },
        { id: "av", label: "אודיו + וידאו" },
        { id: "edit", label: "גם עריכה ומסירה" },
      ],
    },
  ],
  "used-gear": [
    {
      id: "gearType",
      prompt: "איזה ציוד מחפשים?",
      options: [
        { id: "controller", label: "קונטרולר / עמדת DJ" },
        { id: "pa", label: "הגברה / רמקולים" },
        { id: "effects", label: "אפקטים (עשן / בועות)" },
        { id: "other", label: "אחר / לא בטוח" },
      ],
    },
    {
      id: "gearBudget",
      prompt: "תקציב משוער?",
      options: [
        { id: "under2k", label: "עד 2,000 ₪" },
        { id: "2-5k", label: "2,000-5,000 ₪" },
        { id: "5kplus", label: "מעל 5,000 ₪" },
        { id: "talk", label: "לפי מה שיש במלאי" },
      ],
    },
    {
      id: "gearArea",
      prompt: "מאיזה אזור אתם?",
      options: [
        { id: "modiin-area", label: "מודיעין והסביבה" },
        { id: "jerusalem", label: "ירושלים" },
        { id: "center", label: "מרכז" },
        { id: "north-south", label: "צפון / דרום" },
      ],
    },
    {
      id: "gearWhen",
      prompt: "מתי צריך את הציוד?",
      options: [
        { id: "asap", label: "בהקדם" },
        { id: "month", label: "בחודש הקרוב" },
        { id: "flexible", label: "גמיש" },
      ],
    },
    {
      id: "gearPickup",
      prompt: "איסוף ממודיעין אפשרי?",
      options: [
        { id: "yes", label: "כן" },
        { id: "delivery", label: "צריך משלוח / הבאה" },
        { id: "visit", label: "רוצה לבדוק במקום קודם" },
      ],
    },
  ],
};
