import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";

export type QualificationFieldType = "text" | "date" | "tel" | "select";

export type QualificationField = {
  id: string;
  label: string;
  type: QualificationFieldType;
  options?: readonly string[];
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  waLabel: string;
  /** אם נבחרה האופציה הזו, מוצגת הודעה חלופית (ר' lowBudgetMessage) */
  lowBudgetOption?: string;
  /** הודעה כנה על חלופה זולה יותר - לא מוצגת אלא אם lowBudgetOption נבחר */
  lowBudgetMessage?: string;
};

const BUDGET_WA_LABEL = "תקציב";

const EVENT_DATE: QualificationField = {
  id: "eventDate",
  label: "תאריך האירוע",
  type: "text",
  placeholder: "למשל 15.8.2026",
  waLabel: "תאריך האירוע",
};

const VENUE: QualificationField = {
  id: "venueName",
  label: "שם האולם / מיקום",
  type: "text",
  placeholder: "שם האולם או עיר",
  waLabel: "מיקום",
};

const GUEST_COUNT: QualificationField = {
  id: "guestCount",
  label: "מספר אורחים (בערך)",
  type: "select",
  options: ["עד 100", "100-300", "300+"],
  waLabel: "מספר אורחים",
};

const BUDGET_FAMILY_GIFTS: QualificationField = {
  id: "budgetRange",
  label: "מה טווח התקציב שלך?",
  type: "select",
  required: false,
  options: ["עד 300 ₪", "300-800 ₪", "800+ ₪", "לא יודע/ת עדיין"],
  waLabel: BUDGET_WA_LABEL,
  lowBudgetOption: "עד 300 ₪",
  lowBudgetMessage:
    `המחיר ההתחלתי להקלטת ברכה באולפן: ${formatFromPriceDual(getExVat("blessing_recording"))}. ` +
    `אם התקציב נמוך מזה - יש גם שיפור וניקוי להקלטה שכבר יש לך, ` +
    `${formatFromPriceDual(getExVat("ai_voice_enhance"))} בשירותי ה-AI שלנו.`,
};

const BUDGET_PODCAST: QualificationField = {
  id: "budgetRange",
  label: "מה טווח התקציב שלך?",
  type: "select",
  required: false,
  options: ["עד 400 ₪", "400-1,000 ₪", "1,000+ ₪", "לא יודע/ת עדיין"],
  waLabel: BUDGET_WA_LABEL,
  lowBudgetOption: "עד 400 ₪",
  lowBudgetMessage:
    `חצי שעה באולפן: ${formatFromPriceDual(getExVat("studio_half_hour"))}. ` +
    `אם התקציב נמוך יותר - אפשר שיפור קול חכם להקלטה עצמאית שכבר הקלטת, ` +
    `${formatFromPriceDual(getExVat("ai_voice_enhance"))}.`,
};

const BUDGET_ONLINE_RESTORE: QualificationField = {
  id: "budgetRange",
  label: "מה טווח התקציב שלך?",
  type: "select",
  required: false,
  options: ["לא בטוח/ה - קודם רוצה בדיקה", "עד 500 ₪", "500+ ₪"],
  waLabel: BUDGET_WA_LABEL,
  lowBudgetOption: "לא בטוח/ה - קודם רוצה בדיקה",
  lowBudgetMessage:
    "אין בעיה - יש בדיקת היתכנות חינם. שלחו קטע של כ-30 שניות מהקובץ ונגיד לכם בכנות מה אפשר להציל, בלי התחייבות.",
};

export const QUALIFICATION_FIELDS_BY_ROUTE_ID: Record<
  string,
  readonly QualificationField[]
> = {
  "family-gifts": [
    EVENT_DATE,
    {
      id: "celebrantName",
      label: "שם החוגג/ת",
      type: "text",
      placeholder: "מי מקליט / מי חוגג",
      waLabel: "שם החוגג/ת",
    },
    {
      id: "occasionType",
      label: "מה ההזדמנות?",
      type: "select",
      options: ["בר/בת מצווה", "חתונה", "יום הולדת", "אחר"],
      waLabel: "סוג אירוע",
    },
    BUDGET_FAMILY_GIFTS,
  ],
  "podcast-content": [
    {
      id: "firstEpisodeDate",
      label: "מתי להתחיל?",
      type: "select",
      options: ["השבוע", "החודש", "גמיש"],
      waLabel: "מתי להתחיל",
    },
    {
      id: "participantCount",
      label: "כמה משתתפים בפרק?",
      type: "select",
      options: ["1", "2", "3+"],
      waLabel: "משתתפים",
    },
    {
      id: "episodeFrequency",
      label: "תדירות?",
      type: "select",
      options: ["פרק בודד", "שבועי", "חודשי"],
      waLabel: "תדירות",
    },
    BUDGET_PODCAST,
  ],
  "events-attractions": [EVENT_DATE, VENUE, GUEST_COUNT],
  "dj-vip": [EVENT_DATE, VENUE, GUEST_COUNT],
  "singer-amplification": [
    EVENT_DATE,
    VENUE,
    {
      id: "performerCount",
      label: "כמה מבצעים על הבמה?",
      type: "select",
      options: ["1", "2-3", "4+"],
      waLabel: "מבצעים על הבמה",
    },
  ],
  "photo-clips": [
    {
      id: "eventDate",
      label: "תאריך הצילום",
      type: "text",
      placeholder: "למשל 20.9.2026",
      waLabel: "תאריך צילום",
    },
    {
      id: "shootType",
      label: "מה מצלמים?",
      type: "select",
      options: ["חתונה / אירוע", "קליפ", "תוכן לרשתות", "אחר"],
      waLabel: "סוג צילום",
    },
    {
      id: "hoursNeeded",
      label: "כמה שעות (בערך)?",
      type: "select",
      options: ["1-2", "3-4", "5+"],
      waLabel: "שעות צילום",
    },
  ],
  "academy-learn": [
    {
      id: "preferredDay",
      label: "יום מועדף",
      type: "select",
      options: ["ראשון-חמישי", "שישי", "גמיש"],
      waLabel: "יום מועדף",
    },
    {
      id: "experienceLevel",
      label: "רמת ניסיון",
      type: "select",
      options: ["מתחיל/ה", "בינוני/ת", "מתקדם/ת"],
      waLabel: "רמת ניסיון",
    },
    {
      id: "contactPhone",
      label: "טלפון ליצירת קשר",
      type: "tel",
      placeholder: "05X-XXXXXXX",
      waLabel: "טלפון",
    },
  ],
  "online-restore": [
    {
      id: "fileLength",
      label: "אורך הקובץ (בערך)",
      type: "text",
      placeholder: "למשל 12 דקות",
      waLabel: "אורך קובץ",
    },
    {
      id: "issueDescription",
      label: "מה הבעיה?",
      type: "text",
      placeholder: "רעש, הקלטה ישנה, זום…",
      maxLength: 80,
      waLabel: "תיאור הבעיה",
    },
    BUDGET_ONLINE_RESTORE,
  ],
  "pro-b2b": [
    {
      id: "serviceNeeded",
      label: "איזה שירות?",
      type: "select",
      options: ["תג קולי", "מאשאפ / עריכה", "פודקאסט / אולפן", "השכרת ציוד"],
      waLabel: "שירות נדרש",
    },
    {
      id: "quantity",
      label: "כמות / היקף",
      type: "text",
      placeholder: "למשל 5 תגים",
      waLabel: "כמות",
    },
    {
      id: "timeline",
      label: "עד מתי?",
      type: "select",
      options: ["דחוף", "השבוע", "החודש", "גמיש"],
      waLabel: "לוח זמנים",
    },
  ],
};
