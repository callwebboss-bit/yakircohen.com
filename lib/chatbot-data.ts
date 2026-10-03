import { formatAttractionPricingForChatbot } from "@/lib/data/attraction-book-pricing";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";
import { withVat } from "@/lib/data/pricing";
import { getBusinessOpenStatus } from "@/lib/business-hours";

export type ChatAnswer = {
  text: string;
  readMoreHref?: string;
  readMoreLabel?: string;
  whatsappMessage?: string;
  whatsappCta?: string;
  utm_campaign?: string;
};

export type ChatQuestion = {
  id: string;
  label: string;
  answer: ChatAnswer;
  /** When true, question is accessible via guided path only - hidden from main FAQ list */
  hidden?: boolean;
};

export type ChatbotData = {
  subGreeting: string;
  questions: ChatQuestion[];
};

export type GuidedOption = {
  label: string;
  nextStep?: string;
  questionId?: string;
};

export type GuidedStep = {
  question: string;
  options: GuidedOption[];
};

// Dynamic greeting based on studio hours
export function getGreeting(): string {
  const now = new Date();
  const open = getBusinessOpenStatus(now).isOpen;
  return open
    ? "שלום, האולפן פתוח כעת ומרכז המידע זמין לתשובות מהירות"
    : "שלום, האולפן סגור כעת. ריכזנו עבורך את כל התשובות והמחירים";
}

/* השעות נגזרות מ-BUSINESS_HOURS דרך lib/business-hours, לא קשיחות כאן. */
export function isStudioOpen(): boolean {
  return getBusinessOpenStatus().isOpen;
}

// Pathname → question IDs to surface at the top of the list
export const PATHNAME_PRIORITY: Record<string, string[]> = {
  "/studio":        ["chatbot_studio_physical", "chatbot_blessings", "chatbot_studio_price"],
  "/podcast":       ["chatbot_podcast"],
  "/events":                                ["chatbot_dj", "chatbot_attractions"],
  "/events/attractions":                    ["chatbot_attractions"],
  "/events/attractions/cold-fireworks":     ["chatbot_attractions"],
  "/events/attractions/confetti-cannon":    ["chatbot_attractions"],
  "/events/attractions/wedding-smoking-machine": ["chatbot_attractions"],
  "/events/attractions/bubble-machine":     ["chatbot_attractions"],
  "/events/attractions/smoke-cannons-for-events": ["chatbot_attractions"],
  "/photography":   ["chatbot_photography"],
  "/voiceover":     ["chatbot_voiceover"],
  "/academy":       ["chatbot_academy"],
  "/portfolio":     ["chatbot_portfolio"],
  "/pricing":       ["chatbot_studio_price", "chatbot_podcast", "chatbot_quote"],
};

// Guided discovery paths - implements "customer speaks first"
export const GUIDED_PATHS: Record<string, GuidedStep> = {
  root: {
    question: "מה אתם מחפשים?",
    options: [
      { label: "🎙️ הקלטה באולפן",              nextStep: "studio_type" },
      { label: "🎧 פודקאסט או פרויקט דיבור",    questionId: "chatbot_podcast" },
      { label: "🎵 DJ לאירוע",                  nextStep: "event_type" },
      { label: "✨ אטרקציות ופירוטכניקה",        questionId: "chatbot_attractions" },
      { label: "📸 צילום אירועים / וידאו",       questionId: "chatbot_photography" },
      { label: "💼 חבילה משולבת / אחר",          questionId: "chatbot_quote" },
    ],
  },
  studio_type: {
    question: "מה תרצו להקליט?",
    options: [
      { label: "🎤 שיר לאירוע או ברכה מוקלטת",      questionId: "chatbot_blessings" },
      { label: "🎙️ פודקאסט, הרצאה או שיחה",          questionId: "chatbot_podcast" },
      { label: "🎵 שיר מקורי, סינגל או קריינות",     nextStep: "studio_recording_mode" },
    ],
  },
  studio_recording_mode: {
    question: "מאיפה תקליטו?",
    options: [
      { label: "🎚️ ביקור פיזי באולפן",              questionId: "chatbot_studio_physical" },
      { label: "📱 מרחוק (שולחים קובץ מהטלפון)",    questionId: "chatbot_remote" },
    ],
  },
  event_type: {
    question: "מהו סוג האירוע?",
    options: [
      { label: "💍 חתונה או בר / בת מצווה",            questionId: "chatbot_dj" },
      { label: "🏢 אירוע חברה או כנס עסקי",             questionId: "chatbot_dj" },
      { label: "🎉 מסיבה פרטית או יום הולדת",           questionId: "chatbot_dj" },
    ],
  },
};

export const CHATBOT_DATA: ChatbotData = {
  subGreeting:
    "בחרו נושא לקבלת מידע ראשוני - ונמשיך לדבר בוואטסאפ להתאמה מדויקת.",

  questions: [
    {
      id: "chatbot_studio_price",
      label: "🎙️ מחיר אולפן הקלטות",
      answer: {
        /* מחירים לצרכן כולל מע״מ, כמו טופס השיר (2.10.2026) */
        text: `הקלטת שיר (הקלטה, מיקס ומאסטר בסשן של שעה) ₪${withVat(getExVat("song_recording")).toLocaleString("he-IL")} כולל מע״מ, ותיקון זיופים עם טכנאי מנחה בתוספת ₪${withVat(getExVat("song_pitch_coaching")).toLocaleString("he-IL")}. ברכה באולפן מ-₪${withVat(getExVat("blessing_recording")).toLocaleString("he-IL")}. הקלטה מהטלפון בלי להגיע - גם מ-₪${withVat(getExVat("studio_remote")).toLocaleString("he-IL")}. כל המחירים כוללים מע״מ. תספרו לי מה מתאים לכם.`,
        readMoreHref: "/studio/recording-song-modiin#song-offer",
        readMoreLabel: "בחירת תוספות ומחיר סופי לשיר",
        whatsappMessage: "שלום יקיר, אשמח לשמוע על הקלטת שיר - [מרחוק / באולפן]",
        whatsappCta: "ספרו לי מה מתאים לכם",
        utm_campaign: "chatbot_studio_price",
      },
    },
    {
      id: "chatbot_remote",
      label: "📱 הקלטה מרחוק (מהטלפון)",
      hidden: true,
      answer: {
        text: `שולחים קובץ הקלטה מהטלפון ומקבלים חזרה עם ניקוי רעשים ומיקס. תיקון זיופים לא כלול; אפשר להוסיף ב-${formatPrice(getExVat("studio_pitch_correction")).inline}. מתחיל ${formatFromPriceDual(getExVat("studio_remote"))}. ללא צורך בביקור באולפן.`,
        readMoreHref: "/online/vocal-fix",
        readMoreLabel: "פרטים על שירות שיפור קול",
        whatsappMessage: "שלום יקיר, מעוניין/ת בהקלטה מרחוק. מצרף/ת קובץ לבדיקה:",
        whatsappCta: "שלחו קובץ לבדיקה",
        utm_campaign: "chatbot_remote",
      },
    },
    {
      id: "chatbot_studio_physical",
      label: "🎚️ הקלטה פיזית באולפן",
      hidden: true,
      answer: {
        text: `הקלטת שיר באולפן ₪${withVat(getExVat("song_recording")).toLocaleString("he-IL")} כולל מע״מ - סשן של שעה עם הקלטה, מיקס ומאסטר, והשיר אצלכם בסוף הסשן. תיקון זיופים לא כלול, אפשר להוסיף. ברכה מ-₪${withVat(getExVat("blessing_recording")).toLocaleString("he-IL")} כולל מע״מ. שעת חדר בלי עריכה שייכת לפודקאסט ולקריינות.`,
        readMoreHref: "/studio/recording-song-modiin#song-offer",
        readMoreLabel: "בחירת תוספות ומחיר סופי לשיר",
        whatsappMessage: "שלום יקיר, אשמח לשמוע על הקלטה פיזית באולפן. מה הזמינות?",
        whatsappCta: "ספרו לי מה תרצו להקליט",
        utm_campaign: "chatbot_studio_physical",
      },
    },
    {
      id: "chatbot_blessings",
      label: "🎤 הקלטת ברכה לאירוע",
      answer: {
        text: `הקלטת ברכה לאירוע מתחילה ${formatFromPriceDual(getExVat("blessing_recording"))}, כולל ליווי קולי ועריכת סאונד בסיסית (אספקה תוך 24-48 שעות). תיקון זיופים בתוספת ${formatPrice(getExVat("studio_pitch_correction")).inline}. מוזיקת רקע בתוספת. המחיר משתנה לפי מספר המברכים. ספרו לי על האירוע.`,
        readMoreHref: "/studio/blessings",
        readMoreLabel: "פרטים על הקלטת ברכה",
        whatsappMessage: "שלום יקיר, אשמח לשמוע על הקלטת ברכה לאירוע שלנו.",
        whatsappCta: "ספרו לי על הברכה לאירוע",
        utm_campaign: "chatbot_blessings",
      },
    },
    {
      id: "chatbot_podcast",
      label: "🎧 מחיר פודקאסט",
      answer: {
        text: `פרק פודקאסט ערוך מתחיל ${formatFromPriceDual(getExVat("podcast_audio"))}. התמחור משתנה לפי הפורמט: אודיו, צילום וידאו או מספר משתתפים. נבין יחד מה הפורמט הנכון.`,
        readMoreHref: "/podcast",
        readMoreLabel: "חבילות ומחירי פודקאסט",
        whatsappMessage: "שלום, מעוניין/ת בפרטים על הקלטת פודקאסט. רוצה להבין מה מתאים לנו.",
        whatsappCta: "נבין יחד מה מתאים לכם",
        utm_campaign: "chatbot_podcast",
      },
    },
    {
      id: "chatbot_availability",
      label: "📅 יש זמינות לתאריך שלי?",
      answer: {
        text: "הזמינות ביומן משתנה מדי יום בהתאם לסוג השירות והתאריך המבוקש. שלחו הודעה מהירה עם התאריך והשירות שלכם כדי לקבל תשובה סופית.",
        readMoreHref: "/contact",
        readMoreLabel: "צור קשר",
        whatsappMessage: "שלום יקיר, אשמח לבדוק זמינות ביומן. התאריך שלי הוא [...] עבור שירות [...]",
        whatsappCta: "שלחו תאריך ושירות לבדיקה",
        utm_campaign: "chatbot_availability",
      },
    },
    {
      id: "chatbot_hours",
      label: "🕐 שעות פעילות ומיקום",
      answer: {
        text: "האולפן ממוקם במודיעין ופעיל בימים ראשון-חמישי בין 09:00 ל-22:00, בשישי עד 14:00 ובמוצאי שבת בין 21:00 ל-22:30. הכל בתיאום מראש. רוצים לבדוק אם התאריך שלכם פנוי?",
        readMoreHref: "/contact",
        readMoreLabel: "דרכי הגעה וצור קשר",
        whatsappMessage: "שלום, רציתי לבדוק זמינות להקלטה/אירוע בתאריך [...] בשעה [...]",
        whatsappCta: "בדקו זמינות לתאריך שלכם",
        utm_campaign: "chatbot_hours",
      },
    },
    {
      id: "chatbot_dj",
      label: "🎵 DJ לחתונה ואירועים",
      answer: {
        text: "שירותי DJ לאירוע מתחילים מ-₪5,000, ודיג'יי אישי של יקיר מ-₪8,305. כיוון שהמחיר וההתאמה תלויים לחלוטין בסוג האירוע והתאריך, השלב הראשון הוא בדיקת יומן.",
        readMoreHref: "/events",
        readMoreLabel: "מידע על שירותי DJ",
        whatsappMessage: "שלום, מחפש/ת DJ לאירוע ב-[תאריך]. האם התאריך פנוי?",
        whatsappCta: "בדקו זמינות לתאריך שלכם",
        utm_campaign: "chatbot_dj",
      },
    },
    {
      id: "chatbot_attractions",
      label: "✨ אטרקציות לאירוע",
      answer: {
        text: formatAttractionPricingForChatbot(),
        readMoreHref: "/book#events",
        readMoreLabel: "הזמנה מפורטת",
        whatsappMessage: "שלום יקיר, מעוניין/ת באטרקציות לאירוע ב-[תאריך]. מה פנוי?",
        whatsappCta: "ספרו לי על האירוע שלכם",
        utm_campaign: "chatbot_attractions",
      },
    },
    {
      id: "chatbot_photography",
      label: "📸 צילום חתונה ואירוע",
      answer: {
        text: "צילום אירוע מתחיל מ-₪1,500 לפי שעה, וחבילת צילום מלאה (עד 8 שעות) מתחילה מ-₪12,000. הפרט החשוב ביותר כרגע הוא בדיקת זמינות הצלמים לתאריך שלכם.",
        readMoreHref: "/photography",
        readMoreLabel: "פירוט חבילות צילום",
        whatsappMessage: "שלום, אשמח לבדוק זמינות צלם לאירוע בתאריך [תאריך].",
        whatsappCta: "בדקו זמינות צלם",
        utm_campaign: "chatbot_photography",
      },
    },
    {
      id: "chatbot_voiceover",
      label: "🎙️ קריינות מקצועית",
      answer: {
        text: "קריינות מקצועית מתומחרת באופן ישיר לפי אורך הסקריפט (מספר מילים) ואופי המדיה. שלחו את הטקסט או אפיון קצר ותקבלו הצעה מדויקת.",
        readMoreHref: "/voiceover",
        readMoreLabel: "מידע על שירותי קריינות",
        whatsappMessage: "שלום, אני צריך/ה קריינות מקצועית. מצרף/ת כאן את הטקסט או הפרטים:",
        whatsappCta: "שלחו טקסט לקבלת הצעה",
        utm_campaign: "chatbot_voiceover",
      },
    },
    {
      id: "chatbot_academy",
      label: "🎓 קורסים ואקדמיה",
      answer: {
        text: "האקדמיה מציעה קורסי DJ, הפקה מוזיקלית, קריינות והקמת סטודיו ביתי (במודיעין או אונליין). הלימודים מותאמים אישית לקצב ולידע שלכם. איזה תחום מעניין אתכם לפתח?",
        readMoreHref: "/academy",
        readMoreLabel: "סילבוס ופרטי הקורסים",
        whatsappMessage: "שלום, אשמח לשמוע פרטים על לימודים בתחום [תחום].",
        whatsappCta: "ספרו לי מה מעניין אתכם",
        utm_campaign: "chatbot_academy",
      },
    },
    {
      id: "chatbot_quote",
      label: "💬 הצעת מחיר מותאמת",
      answer: {
        text: "חבילות משולבות של DJ, צילום והפקה כוללת מותאמות אישית לפי סוג האירוע, המיקום והתאריך. שלחו 3 פרטים בסיסיים ותקבלו אפיון ראשוני תוך זמן קצר.",
        readMoreHref: "/contact",
        readMoreLabel: "מעבר לטופס פנייה",
        whatsappMessage: "שלום, אשמח לקבל הצעת מחיר מותאמת אישית. תאריך: / סוג האירוע: / שירותים מבוקשים:",
        whatsappCta: "שלחו פרטים - 3 שדות בלבד",
        utm_campaign: "chatbot_quote",
      },
    },
    {
      id: "chatbot_portfolio",
      label: "🎵 תיק עבודות ודוגמאות",
      answer: {
        text: "קטעי סאונד, פרקי פודקאסט, גלריות מאירועים וסרטוני וידאו זמינים עבורכם ישירות בגלריה ובעמודי השירות באתר.",
        readMoreHref: "/portfolio",
        readMoreLabel: "מעבר לתיק העבודות",
        utm_campaign: "chatbot_portfolio",
      },
    },
  ],
};
