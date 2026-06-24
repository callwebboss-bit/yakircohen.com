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
  const day = now.getDay();
  const hour = now.getHours();
  const open =
    day !== 6 && (day === 5 ? hour >= 9 && hour < 14 : hour >= 9 && hour < 20);
  return open
    ? "שלום, האולפן פתוח כעת ומרכז המידע זמין לתשובות מהירות"
    : "שלום, האולפן סגור כעת. ריכזנו עבורך את כל התשובות והמחירים";
}

export function isStudioOpen(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if (day === 6) return false;
  if (day === 5) return hour >= 9 && hour < 14;
  return hour >= 9 && hour < 20;
}

// Pathname → question IDs to surface at the top of the list
export const PATHNAME_PRIORITY: Record<string, string[]> = {
  "/studio":        ["chatbot_studio_price", "chatbot_blessings"],
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

// Guided discovery paths — implements "customer speaks first"
export const GUIDED_PATHS: Record<string, GuidedStep> = {
  root: {
    question: "מה אתם מחפשים?",
    options: [
      { label: "הקלטה באולפן",              nextStep: "studio_type" },
      { label: "פודקאסט או פרויקט דיבור",    questionId: "chatbot_podcast" },
      { label: "DJ לאירוע",                  nextStep: "event_type" },
      { label: "אטרקציות ופירוטכניקה",        questionId: "chatbot_attractions" },
      { label: "צילום אירועים / וידאו",       questionId: "chatbot_photography" },
      { label: "חבילה משולבת / אחר",          questionId: "chatbot_quote" },
    ],
  },
  studio_type: {
    question: "מה תרצו להקליט באולפן?",
    options: [
      { label: "שיר לאירוע או ברכה מוקלטת",      questionId: "chatbot_blessings" },
      { label: "פודקאסט, הרצאה או שיחה",          questionId: "chatbot_podcast" },
      { label: "שיר מקורי, סינגל או קריינות",     questionId: "chatbot_studio_price" },
    ],
  },
  event_type: {
    question: "מהו סוג האירוע המתוכנן?",
    options: [
      { label: "חתונה או בר / בת מצווה",            questionId: "chatbot_dj" },
      { label: "אירוע חברה או כנס עסקי",             questionId: "chatbot_dj" },
      { label: "מסיבה פרטית או חגיגת יום הולדת",    questionId: "chatbot_dj" },
    ],
  },
};

export const CHATBOT_DATA: ChatbotData = {
  subGreeting:
    "בחרו נושא לקבלת מידע ראשוני - ונמשיך לדבר בוואטסאפ להתאמה מדויקת.",

  questions: [
    {
      id: "chatbot_studio_price",
      label: "מחיר אולפן הקלטות",
      answer: {
        text: "הקלטת שיר באולפן מתחילה מ-₪590. המחיר הסופי נקבע לפי סוג ההקלטה, מספר המשתתפים ורמת העריכה הדרושה. בואו נבין יחד מה מדויק עבורכם.",
        readMoreHref: "/studio/pricing",
        readMoreLabel: "מחירון אולפן מלא",
        whatsappMessage: "שלום יקיר, אשמח לקבל פרטים על הקלטת שיר באולפן.",
        whatsappCta: "ספרו לי על ההקלטה שלכם",
        utm_campaign: "chatbot_studio_price",
      },
    },
    {
      id: "chatbot_blessings",
      label: "הקלטת ברכה לאירוע",
      answer: {
        text: "הקלטת ברכה לאירוע מתחילה מ-₪590, כולל ליווי קולי מלא ועריכת סאונד (אספקה תוך 24-48 שעות). המחיר משתנה בהתאם למספר המברכים ומורכבות ההפקה. ספרו לי על האירוע שלכם ונבחר את הפורמט.",
        readMoreHref: "/studio/blessings",
        readMoreLabel: "פרטים על הקלטת ברכה",
        whatsappMessage: "שלום יקיר, אשמח לשמוע על הקלטת ברכה לאירוע שלנו.",
        whatsappCta: "ספרו לי על הברכה לאירוע",
        utm_campaign: "chatbot_blessings",
      },
    },
    {
      id: "chatbot_podcast",
      label: "מחיר פודקאסט",
      answer: {
        text: "הקלטת פרק פודקאסט מתחילה מ-₪950. התמחור משתנה לפי הפורמט הנבחר: אודיו בלבד, צילום וידאו רב-מצלמתי או כמות המשתתפים. נבין יחד מה הפורמט הנכון עבורכם.",
        readMoreHref: "/podcast",
        readMoreLabel: "חבילות ומחירי פודקאסט",
        whatsappMessage: "שלום, מעוניין/ת בפרטים על הקלטת פודקאסט. רוצה להבין מה מתאים לנו.",
        whatsappCta: "נבין יחד מה מתאים לכם",
        utm_campaign: "chatbot_podcast",
      },
    },
    {
      id: "chatbot_availability",
      label: "יש זמינות לתאריך שלי?",
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
      label: "שעות פעילות ומיקום",
      answer: {
        text: "האולפן ממוקם במודיעין ופעיל בימים ראשון-חמישי בין השעות 09:00-20:00, ובימי שישי עד 14:00 (שבת סגור). רוצים לבדוק אם השעה או התאריך שלכם פנויים?",
        readMoreHref: "/contact",
        readMoreLabel: "דרכי הגעה וצור קשר",
        whatsappMessage: "שלום, רציתי לבדוק זמינות להקלטה/אירוע בתאריך [...] בשעה [...]",
        whatsappCta: "בדקו זמינות לתאריך שלכם",
        utm_campaign: "chatbot_hours",
      },
    },
    {
      id: "chatbot_dj",
      label: "DJ לחתונה ואירועים",
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
      label: "אטרקציות לאירוע",
      answer: {
        text: "אטרקציה אחת — ₪1,750. חבילות: 2 אטרקציות ₪3,200 · 3 אטרקציות ₪4,450 · 4+ ₪5,500 + קליפ היילייטס מתנה.\n\nלכל אטרקציה בוחרים כמות הפעלות:\n• זיקוקים קרים / קונפטי — לפי רגעי שיא (הפעלה שנייה/שלישית = +₪1,750 כל אחת, כי כל הפעלה = מלאי גלם חדש)\n• עשן כבד / בועות — לפי תדירות: הפעלה אחת · 2 מדורגות (+35%) · 2 מלאות (+50%) · אקסטרים כל הערב (+100%)\n\nמה האירוע שלכם ואיזה רגעים הכי חשוב לכם לצלם?",
        readMoreHref: "/events/attractions",
        readMoreLabel: "מחשבון אטרקציות",
        whatsappMessage: "שלום יקיר, מעוניין/ת באטרקציות לאירוע ב-[תאריך]. מה פנוי?",
        whatsappCta: "ספרו לי על האירוע שלכם",
        utm_campaign: "chatbot_attractions",
      },
    },
    {
      id: "chatbot_photography",
      label: "צילום חתונה ואירוע",
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
      label: "קריינות מקצועית",
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
      label: "קורסים ואקדמיה",
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
      label: "הצעת מחיר מותאמת",
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
      label: "תיק עבודות ודוגמאות",
      answer: {
        text: "קטעי סאונד, פרקי פודקאסט, גלריות מאירועים וסרטוני וידאו זמינים עבורכם ישירות בגלריה ובעמודי השירות באתר.",
        readMoreHref: "/portfolio",
        readMoreLabel: "מעבר לתיק העבודות",
        utm_campaign: "chatbot_portfolio",
      },
    },
  ],
};
