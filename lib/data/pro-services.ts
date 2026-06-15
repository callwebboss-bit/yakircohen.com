import type { BookCategoryId } from "@/lib/book-url";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import type { ProcessStep } from "@/components/marketing/ProcessSteps";
import type { PlaylistId } from "@/lib/data/video-playlists";

export type ProServiceId =
  | "dj-voice-tags"
  | "mashup-fixer"
  | "pre-built-sets"
  | "studio-in-a-box"
  | "bulk-production"
  | "dry-hire"
  | "system-tuning";

export type ProWizardField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "date" | "multiselect";
  placeholder?: string;
  options?: readonly { value: string; label: string }[];
  required?: boolean;
};

export type ProServicePrompt = {
  system: string;
  userTemplate: string;
};

export type ProServiceSimpleCta = {
  title: string;
  fieldLabel: string;
  placeholder: string;
  buttonLabel: string;
  calculatorSummary?: string;
};

export type ProService = {
  id: ProServiceId;
  slug: string;
  path: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  /** פסקאות תוכן לעמוד השירות - עוזרות לאינדוקס ולקריאה נעימה */
  seoParagraphs: readonly string[];
  /** כותרת גלויה לבלוק התוכן (ברירת מחדל: "על השירות") */
  aboutHeading?: string;
  /** פלייליסט וידאו מתיק העבודות */
  showcasePlaylistId?: PlaylistId;
  /** מאמרים מהבלוג לעמוד זה */
  relatedBlogSlugs?: readonly string[];
  /** קישורי שירותים משלימים */
  crossLinks?: readonly {
    title: string;
    text: string;
    href: string;
    linkLabel?: string;
  }[];
  scarcityLabel?: string;
  features: readonly string[];
  processSteps: readonly ProcessStep[];
  faqs: readonly { question: string; answer: string }[];
  closerServiceId: string;
  bookCategoryId: BookCategoryId;
  pricingId: PriceItemId;
  utmCampaign: string;
  department: "dj" | "podcast" | "pro-audio";
  departmentLabel: string;
  icon: string;
  wizardTitle: string;
  wizardFields: readonly ProWizardField[];
  prompt: ProServicePrompt;
  whatsappIntro: string;
  canonicalNote?: string;
  /** CTA יחיד לוואטסאפ במקום וויזארד כראשי */
  simpleCta?: ProServiceSimpleCta;
};

export const PRO_DEPARTMENTS = [
  {
    id: "dj" as const,
    label: "תקליטנים ויוצרי מוזיקה",
    description:
      "תגים קוליים, מאשאפים, סטים מוכנים ומרכז כלים — חומר שמרים את האירוע בלי שתשבו על כל רמיקס.",
  },
  {
    id: "podcast" as const,
    label: "פודקאסטים ויוצרי תוכן לעסקים",
    description:
      "אולפן בקופסה ופס ייצור - אתם מגדירים את החזון, אנחנו מביאים את הביצוע.",
  },
  {
    id: "pro-audio" as const,
    label: "הגברה ותאורה",
    description:
      "השלמת ריידרים ותכנון מערכות - פתרונות גיבוי והשכרת ציוד לפי צורך.",
  },
] as const;

export const PRO_SERVICES: readonly ProService[] = [
  {
    id: "dj-voice-tags",
    slug: "events/dj/voice-tags",
    path: "/events/dj/voice-tags",
    title: "תג קולי וקריינות לדיג'יי",
    subtitle:
      "שולחים משפט קצר, מקבלים קריינות מעוצבת עם הדהוד, הד מושהה ואפקטים. קובץ מוכן להטמעה בסט.",
    metaTitle: "תג קולי לדיג'יי | קריינות ממותגת לסט",
    metaDescription:
      "תג קולי לדיג'ייז עם אפקטי מועדון. הקלטה באולפן במודיעין, מסירה בדרך כלל תוך יומיים. מ-350 ₪ לפני מע״מ.",
    keywords: [
      "תג קולי לדיג'יי",
      "קריינות לסט",
      "קריינות DJ",
      "פתיחה לסט DJ",
      "מיתוג דיג'יי",
      "אפקטים למועדון",
      "הקלטת תג קולי",
    ],
    aboutHeading: "איך זה עובד",
    showcasePlaylistId: "dj-voice-tags",
    relatedBlogSlugs: [
      "commercial-voiceover-guide",
      "dj-course-guide",
      "professional-voiceover-for-business",
    ],
    crossLinks: [
      {
        title: "חבילת קריינות לסט",
        text: "חמישה משפטים שונים לערב שלם, לא רק תג בודד.",
        href: "/business/professional-voiceover",
        linkLabel: "קריינות לסט DJ",
      },
      {
        title: "מאשאפים ומוזיקה מותאמת",
        text: "שילוב שירים, גרסאות מוכנות, סט לכושר או רקע לעסק.",
        href: "/online/mashup-fixer",
        linkLabel: "מאשאפים וסטים",
      },
      {
        title: "סטים מוכנים",
        text: "סט מקצועי לחתונה או לאירוע, בלי להתחיל מאפס.",
        href: "/events/dj/pre-built-sets",
        linkLabel: "סטים מוכנים לדיג'יי",
      },
    ],
    scarcityLabel: "לרוב מסירים תוך יומיים",
    seoParagraphs: [
      "תג קולי הוא המשפט שמזהה אתכם בסט: השם, סלוגן או קריאה לרחבה. מקליטים באולפן, מוסיפים אפקטים שמתאימים למועדון, ושולחים קובץ מוכן.",
      "מיועד לדיג'ייז שלא רוצים לשבת על עריכה. אפשר תג בודד, חמישה או עשרה, לפי מה שצריך.",
    ],
    features: [
      "הקלטה ועריכה מהירה - בדרך כלל תוך יומיים",
      "אפקטי מועדון: הדהוד, הד מושהה, לייזר ומסנן",
      "גרסאות קצרות וארוכות לפי הצורך",
      "קבצי איכות גבוהה מוכנים לנגן מקצועי",
      "חבילות של תג אחד, חמישה או עשרה במחיר מוזל",
    ],
    processSteps: [
      { number: 1, title: "שולחים את המשפט", description: "טקסט קצר, שם הדיג'יי וסגנון מועדף - אנרגטי, יוקרתי או נקי." },
      { number: 2, title: "הצעת עריכה", description: "המחשבון באתר מציע אפקטים וקצב - אתם מאשרים או מבקשים שינוי." },
      { number: 3, title: "הקלטה ועיבוד", description: "קריינות מקצועית ועריכה מוזיקלית ברמת מועדון." },
      { number: 4, title: "מסירה", description: "קבצים מוכנים להטמעה בסט - באיכות מקסימלית ובגרסה דחוסה." },
    ],
    faqs: [
      { question: "כמה זמן לוקח תג קולי?", answer: "רוב הפרויקטים נמסרים תוך יומיים. דחוף לאירוע מחר? ציינו בבקשה - נבדוק זמינות." },
      { question: "איזה אפקטים אפשר?", answer: "הדהוד, הד מושהה, אפקט לייזר, מסנן תדרים ועוד - לפי הסגנון שבחרתם." },
      { question: "באיזה פורמט מקבלים?", answer: "קבץ באיכות מקסימלית וגרסה דחוסה - מוכנים לכל נגן דיג'יי מקצועי." },
      { question: "אפשר בעברית ובאנגלית?", answer: "כן. כותבים את המשפט בשפה שבה תרצו לשמוע אותו בסט." },
      {
        question: "מה ההבדל בין תג קולי לחבילת קריינות?",
        answer:
          "תג זה משפט אחד עם אפקטים. חבילת קריינות כוללת חמישה משפטים שונים לסט שלם.",
      },
      {
        question: "איך משלבים את התג בסט?",
        answer:
          "מקבלים קובץ מוכן, גוררים לנגן שלכם או משמיעים מהמגירה. מתאים לפתיחה, בין שירים או לפני דרופ.",
      },
    ],
    closerServiceId: "dj_voice_tags",
    bookCategoryId: "dj",
    pricingId: "dj_voice_tag_single",
    utmCampaign: "pro_voice_tags",
    department: "dj",
    departmentLabel: "תקליטנים",
    icon: "🎤",
    wizardTitle: "מחשבון תג קולי",
    wizardFields: [
      { id: "phrase", label: "המשפט לקריינות", type: "textarea", placeholder: "לדוגמה: דיג'יי יקיר - חי ממודיעין", required: true },
      { id: "style", label: "סגנון", type: "select", options: [
        { value: "club", label: "מועדון / אנרגטי" },
        { value: "luxury", label: "יוקרתי / אירוע גדול" },
        { value: "festival", label: "פסטיבל / עוצמתי" },
        { value: "minimal", label: "מינימלי / נקי" },
      ], required: true },
      { id: "effects", label: "אפקטים מועדפים", type: "multiselect", options: [
        { value: "reverb", label: "הדהוד" },
        { value: "delay", label: "הד מושהה" },
        { value: "laser", label: "אפקט לייזר" },
        { value: "filter", label: "מסנן תדרים" },
      ] },
    ],
    prompt: {
      system: "אתה יועץ סאונד לדיג'ייז מקצועיים. הצע עריכה מוזיקלית לתג קולי. כתוב רק בעברית פשוטה וברורה. החזר JSON בלבד.",
      userTemplate: "משפט: {{phrase}}\nסגנון: {{style}}\nאפקטים: {{effects}}",
    },
    whatsappIntro: "שלום, מעוניין/ת בתג קולי לסט דיג'יי.",
  },
  {
    id: "mashup-fixer",
    slug: "online/mashup-fixer",
    path: "/online/mashup-fixer",
    title: "מרכז הדיג'יי — רעיונות, כלים וייצור",
    subtitle:
      "דיג'יי עם לוח שנה צפוף לא צריך לשבת על כל מעבר. שילובים יצירתיים, רעיונות לרחבה וכלים בחינם — וייצור מקצועי כשאין זמן.",
    metaTitle: "מרכז הדיג'יי | רעיונות מאשאפ, כלים חינמיים וייצור",
    metaDescription:
      "שילובי מאשאפ עם BPM וסולם, דוגמאות ביוטיוב, חבילות לדיג'יי וייצור באולפן. מוכן מ-650 ₪, מותאם עד 3 ימי עסקים.",
    keywords: [
      "מאשאפ לדיג'יי",
      "רעיונות למאשאפ",
      "כלים לדיג'יי",
      "פיצול ערוצים",
      "רמיקס לחתונה",
      "מאשאפ מוכן לרכישה",
      "שילוב שירים",
      "סט מוזיקה לחדר כושר",
      "מוזיקת רקע לעסק",
      "עריכת מוזיקה לאירוע",
    ],
    aboutHeading: "למי זה מתאים",
    showcasePlaylistId: "mashup-fixer",
    relatedBlogSlugs: [
      "wedding-dj-selection-guide-2026",
      "dj-course-guide",
      "how-to-choose-wedding-dj-israel",
    ],
    crossLinks: [
      {
        title: "סטים מוכנים לאירוע",
        text: "קבלת פנים, להיטים וערב חתונה — בלי לבנות הכל מאפס.",
        href: "/events/dj/pre-built-sets",
        linkLabel: "סטים מוכנים",
      },
      {
        title: "תג קולי לסט",
        text: "משפט ממותג עם אפקטים — משלים את המאשאפים בפתיחה.",
        href: "/events/dj/voice-tags",
        linkLabel: "תג קולי",
      },
      {
        title: "DJ לאירוע שלם",
        text: "צריך מישהו שינגן ולא רק קבצים? אפשר גם הפעלה בשטח.",
        href: "/events/dj-events",
        linkLabel: "תקליטן לאירועים",
      },
      {
        title: "ללמוד לערוך בעצמך",
        text: "קורס DJ עם עריכה ומעברים — לדיג'ייז שרוצים שליטה מלאה.",
        href: "/academy/dj-course",
        linkLabel: "קורס DJ",
      },
    ],
    scarcityLabel: "מסירה עד 3 ימי עסקים — לפי תור באולפן",
    seoParagraphs: [
      "דיג'יי עם לוח שנה מלא לא חייב לשבת על כל רמיקס. כאן יש שילובים עם BPM, סולם והרמוניה — אפשר לקחת רעיון ולערוך לבד, או לבקש גרסה מהאולפן.",
      "לפני שמזמינים — שמעו דוגמאות ביוטיוב, שמרו שילובים לסט, ובחרו חבילה אם צריך כמה מאשאפים בעונה.",
      "עריכה ידנית: סולמות, קצב, מעברים. לא stems מ-Fadr ולא קובץ AI גנרי.",
    ],
    features: [
      "שילובים עם BPM, Camelot והרמוניה — בחינם",
      "דוגמאות ביוטיוב + שמירה לסט",
      "חבילות 3 / 5 / 10 עם הנחה",
      "מאשאפ מוכן או מותאם — עד 3 ימי עסקים",
      "דרוג+ לשילובים יצירתיים (stems, משקל)",
      "סטים לכושר ומוזיקה לעסק",
    ],
    processSteps: [
      { number: 1, title: "בוחרים", description: "רעיון מהקטלוג, מאגר מוכן, או שילוב משלכם." },
      { number: 2, title: "שולחים פרטים", description: "טופס או וואטסאפ — כולל BPM וסולם אם ידוע." },
      { number: 3, title: "עריכה באולפן", description: "יקיר עורך, בודק, שולח לתיקון אם צריך." },
      { number: 4, title: "מסירה", description: "קובץ מוכן לנגן + גיבוי. חבילה — כמה קבצים ברצף." },
    ],
    faqs: [
      {
        question: "מה ההבדל בין מאשאפ מותאם למוכן?",
        answer:
          "מותאם נבנה לפי שני שירים שאתם בוחרים. מוכן כבר קיים במאגר — בוחרים מהרשימה ומקבלים קובץ בלי להמתין לעריכה.",
      },
      {
        question: "מה זה שיר אחד על אחד?",
        answer:
          "עובדים על שילוב אחד בכל פעם: איזה חלק מכל שיר, באיזה קצב, ולאן המעבר הולך. אפשר שיחת ייעוץ קצרה לפני שמתחייבים.",
      },
      {
        question: "כמה זמן לוקח מאשאפ מותאם?",
        answer:
          "עד 3 ימי עסקים מרגע אישור ההזמנה. צריך מהר יותר? שואלים בוואטסאפ — רק אם יש מקום ביומן, בלי הבטחה באתר.",
      },
      {
        question: "איך עובדות חבילות מאשאפ?",
        answer:
          "בוחרים 3, 5 או 10 שילובים — מוכנים מהמאגר או מותאמים. המחיר בחבילה נמוך מרכישה בודדת. שולחים רשימה בטופס או בוואטסאפ.",
      },
      {
        question: "מה זה דרוג+?",
        answer:
          "שילוב יצירתי שדורש עריכה עמוקה: stems, שינוי משקל, מודולציה. לא crossfade פשוט — הפקה באולפן.",
      },
      {
        question: "איך עובד סט לחדר כושר?",
        answer:
          "בוחרים סוג אימון (HIIT, כוח, יוגה). מקבלים פלייליסט מחובר בקצב יציב — מתאים להפעלה בלופ או לפי שיעור.",
      },
      {
        question: "מוזיקה לעסק — מה צריך לספר?",
        answer:
          "סוג המקום, שעות עומס, האם יש דיבור מול לקוחות, ומה רמת האנרגיה שמתאימה. בונים פלייליסט בהתאם.",
      },
      {
        question: "צריך לשלוח קבצים?",
        answer:
          "למאשאפ מותאם — אחרי אישור, בוואטסאפ או בדרייב. אין לכם את הקבצים? נשתמש בגרסאות איכותיות מהספרייה.",
      },
      {
        question: "אפשר לשלב עם סטים מוכנים לאירוע?",
        answer:
          "כן. מאשאפים בודדים משלימים סט קבלת פנים או ערב חתונה. ראו גם את קטלוג הסטים המלאים.",
      },
      {
        question: "אפשר להוריד מאשאפ מהרשימה?",
        answer:
          "לא — הרשימה היא השראה בלבד. רוצים את השילוב? מזמינים גרסה מוכנה או מאשאפ מותאם, ומקבלים קובץ לנגן.",
      },
      {
        question: "מוזיקת Suno — אפשר לנגן באירוע?",
        answer:
          "תלוי ברישוי ובאיכות. לרחבת ריקודים מקצועית עדיף רמיקס על שירים מוכרים או ייצור באולפן — לא תמיד AI מתאים לשידור חי.",
      },
      {
        question: "מה ההבדל בין Fadr לעריכה אצלכם?",
        answer:
          "Fadr מפריד ערוצים ועוזר לניסוי. עריכה אצלנו כוללת מעברים, סולמות, קצב וסבב בדיקה לפני מסירה — קובץ מוכן לאירוע, לא רק stems.",
      },
    ],
    closerServiceId: "mashup_fixer",
    bookCategoryId: "online",
    pricingId: "mashup_custom_planned",
    utmCampaign: "pro_mashup_fixer",
    department: "dj",
    departmentLabel: "תקליטנים",
    icon: "🔀",
    wizardTitle: "הזמנת מאשאפ",
    wizardFields: [
      {
        id: "orderType",
        label: "סוג הזמנה",
        type: "select",
        options: [
          { value: "ready", label: "מוכן מהמאגר" },
          { value: "custom", label: "מותאם — עד 3 ימי עסקים" },
          { value: "creative", label: "יצירתי / דרוג+" },
          { value: "bundle", label: "חבילה (3+ שילובים)" },
        ],
        required: true,
      },
      { id: "songA", label: "שיר ראשון", type: "text", required: true },
      { id: "songB", label: "שיר שני", type: "text", required: true },
      {
        id: "quantity",
        label: "כמות (לחבילה)",
        type: "select",
        options: [
          { value: "1", label: "1" },
          { value: "3", label: "3" },
          { value: "5", label: "5" },
          { value: "10", label: "10" },
        ],
      },
      { id: "eventDate", label: "תאריך אירוע (אם רלוונטי)", type: "date" },
      { id: "bpmHint", label: "BPM / סולם (אם ידוע)", type: "text", placeholder: "128, 8B" },
      { id: "notes", label: "הערות", type: "textarea", placeholder: "איזה חלק לשלב, רעיון מהקטלוג..." },
    ],
    prompt: {
      system: "אתה עורך מאשאפים מקצועי. הצע נקודת מיזוג, סולמות ואורך. כתוב רק בעברית פשוטה. החזר JSON בלבד.",
      userTemplate:
        "סוג: {{orderType}}\nשיר א: {{songA}}\nשיר ב: {{songB}}\nכמות: {{quantity}}\nתאריך: {{eventDate}}\nBPM/סולם: {{bpmHint}}\nהערות: {{notes}}",
    },
    whatsappIntro: "שלום, רוצה להזמין מאשאפ מהאתר.",
  },
  {
    id: "pre-built-sets",
    slug: "events/dj/pre-built-sets",
    path: "/events/dj/pre-built-sets",
    title: "סטים מוכנים לאירועי חברה",
    subtitle:
      "מאגרי מוזיקה ערוכים ומסודרים לפי קטגוריות - לדיג'ייז מתחילים או כאלה שאין להם זמן לערוך. מחוברים בקצב קבוע, מוכנים להפעלה.",
    metaTitle: "סט מוזיקה מוכן לדיג'יי | קבלת פנים ואירועי חברה",
    metaDescription:
      "סטי דיג'יי מוכנים לפי קטגוריה - קבלת פנים, להיטים ואירועי חברה. ערוכים ומחוברים בקצב. החל מ-450 שקלים לפני מע״מ.",
    keywords: [
      "סט מוזיקה מוכן",
      "מוזיקה לאירוע חברה",
      "קבלת פנים דיג'יי",
      "סט לחתונה",
      "מוזיקה לאירוע",
      "סט לחדר כושר",
    ],
    crossLinks: [
      {
        title: "מאשאפים בודדים",
        text: "שילוב בין שני שירים או גרסה מוכנה — משלים סט שלם.",
        href: "/online/mashup-fixer",
        linkLabel: "מאשאפים ומוזיקה",
      },
      {
        title: "תג קולי",
        text: "משפט ממותג לפתיחת הסט.",
        href: "/events/dj/voice-tags",
        linkLabel: "תג קולי",
      },
    ],
    seoParagraphs: [
      "לא תמיד יש זמן לבנות סט מאפס לפני כל אירוע. הסטים המוכנים שלנו בנויים לפי סוג אירוע - קבלת פנים, רחבת ריקודים או ערב חברה.",
      "כל סט כולל רשימת שירים, אורך וקצב ממוצע. אפשר לקבל על דיסק און קי או בהורדה - עם הדרכה קצרה לטעינה בנגן.",
    ],
    features: [
      "סטים לפי קטגוריה: קבלת פנים, להיטים, אירוע חברה",
      "מחוברים בקצב קבוע - מוכנים להפעלה",
      "רשימת שירים מפורטת לכל סט",
      "דיסק און קי מוכן או הורדה מקוונת",
      "עדכון לשנת 2026",
    ],
    processSteps: [
      { number: 1, title: "בוחרים קטגוריה", description: "קבלת פנים, להיטים, חברה או מסיבה." },
      { number: 2, title: "מאזינים לדוגמה", description: "תצוגה מקדימה של כמה דקות מהסט." },
      { number: 3, title: "רכישה", description: "תשלום ומסירה בדיסק או הורדה." },
      { number: 4, title: "תמיכה", description: "הדרכה קצרה לטעינה בנגן מקצועי." },
    ],
    faqs: [
      { question: "האם אפשר לבקש שינויים?", answer: "כן - התאמות קטנות (הסרת או הוספת שיר בודד) בתוספת תשלום סמלי." },
      { question: "באיזה פורמט?", answer: "דיסק און קי מוכן לתוכנת ניהול מוזיקה, או קבצים בדרייב." },
      { question: "מה לגבי זכויות יוצרים?", answer: "הסטים מיועדים לשימוש מקצועי באירועים פרטיים. רישוי לשידור - באחריות הלקוח." },
    ],
    closerServiceId: "prebuilt_sets",
    bookCategoryId: "dj",
    pricingId: "prebuilt_set_corporate",
    utmCampaign: "pro_prebuilt_sets",
    department: "dj",
    departmentLabel: "תקליטנים",
    icon: "📀",
    wizardTitle: "מחשבון בחירת סט",
    wizardFields: [
      { id: "category", label: "קטגוריה", type: "select", options: [
        { value: "reception_2026", label: "קבלת פנים 2026" },
        { value: "mainstream", label: "להיטים / רחבת ריקודים" },
        { value: "corporate", label: "אירוע חברה" },
        { value: "wedding", label: "חתונה - ערב" },
        { value: "gym", label: "חדר כושר" },
      ], required: true },
      { id: "duration", label: "אורך רצוי (דקות)", type: "number", placeholder: "60" },
      { id: "format", label: "אופן מסירה", type: "select", options: [
        { value: "usb", label: "דיסק און קי מוכן" },
        { value: "drive", label: "הורדה מדרייב" },
      ] },
    ],
    prompt: {
      system: "אתה יועץ מוזיקה לדיג'ייז. המלץ על סט מוכן לפי קטגוריה. כתוב רק בעברית פשוטה. החזר JSON בלבד.",
      userTemplate: "קטגוריה: {{category}}\nאורך: {{duration}} דקות\nמסירה: {{format}}",
    },
    whatsappIntro: "שלום, מעוניין/ת בסט מוזיקה מוכן לדיג'יי.",
  },
  {
    id: "studio-in-a-box",
    slug: "podcast/studio-in-a-box",
    path: "/podcast/studio-in-a-box",
    title: "אולפן בקופסה - תכנון חדר הקלטה",
    subtitle:
      "ייעוץ ותכנון אקוסטי ותאורה לפי מידות החדר. שולחים שרטוט או תמונה - מקבלים מפרט ציוד מדויק ועריכה לעשרת הפרקים הראשונים.",
    metaTitle: "תכנון אולפן פודקאסט | אולפן בקופסה לעסקים",
    metaDescription:
      "ייעוץ אקוסטיקה, תאורה ומפרט ציוד לאולפן פודקאסט - לפי מידות החדר. כולל עריכה ל-10 פרקים ראשונים. החל מ-2,500 שקלים.",
    keywords: [
      "בניית אולפן",
      "אולפן פודקאסט",
      "ייעוץ אקוסטיקה",
      "תכנון חדר הקלטה",
      "אולפן לעסק",
    ],
    seoParagraphs: [
      "רוצים אולפן בחדר משרד, בבית או בסטודיו קטן? אנחנו מתכננים לפי המידות האמיתיות - אקוסטיקה, מיקרופונים, תאורה ומצלמה אם צריך.",
      "החבילה כוללת דוח מפרט, שיחת ייעוץ ועריכת עשרה פרקים ראשונים - כדי שתתחילו לפרסם בלי לנחש מה חסר.",
    ],
    features: [
      "תכנון אקוסטי לפי מידות החדר",
      "מפרט מיקרופונים, מיקסר, תאורה ומצלמות",
      "שליחת שרטוט, תמונה או קישור לדרייב",
      "חבילת עריכה לעשרה פרקים ראשונים",
      "ליווי טלפוני בביצוע",
    ],
    processSteps: [
      { number: 1, title: "מידות ותמונה", description: "אורך, רוחב וגובה + תמונה או שרטוט." },
      { number: 2, title: "מפרט מוצע", description: "רשימת ציוד מדויקת לתקציב ולשימוש." },
      { number: 3, title: "ייעוץ אישי", description: "שיחת וידאו לעדכון והתאמות." },
      { number: 4, title: "עשרה פרקים", description: "עריכת עשרה פרקים ראשונים בחבילה." },
    ],
    faqs: [
      { question: "מה ההבדל מייעוץ אקוסטיקה רגיל?", answer: "אולפן בקופסה כולל מפרט ציוד מלא, תאורה לוידאו וחבילת עריכה - מוצר שלם לעסקים." },
      { question: "איך שולחים שרטוט?", answer: "במחשבון - קישור לדרייב, תיאור מילולי או תמונה. לא חובה להעלות קובץ לשרת." },
      { question: "האם אתם קונים את הציוד בשבילנו?", answer: "אנחנו ממליצים על דגמים וספקים. הרכישה - אצלכם, עם ליווי אם צריך." },
    ],
    closerServiceId: "studio_in_box",
    bookCategoryId: "podcast",
    pricingId: "studio_in_box_consult",
    utmCampaign: "pro_studio_in_box",
    department: "podcast",
    departmentLabel: "פודקאסט לעסקים",
    icon: "📦",
    wizardTitle: "מחשבון תכנון אולפן",
    wizardFields: [
      { id: "dimensions", label: "מידות החדר (מטר)", type: "text", placeholder: "3 על 2.5 על 2.7", required: true },
      { id: "useCase", label: "שימוש עיקרי", type: "select", options: [
        { value: "podcast_audio", label: "פודקאסט אודיו" },
        { value: "podcast_video", label: "פודקאסט וידאו" },
        { value: "stream", label: "שידור חי" },
      ], required: true },
      { id: "budget", label: "תקציב ציוד (שקלים)", type: "select", options: [
        { value: "5000", label: "עד 5,000" },
        { value: "15000", label: "5,000 עד 15,000" },
        { value: "30000", label: "15,000 עד 30,000" },
        { value: "50000", label: "מעל 30,000" },
      ] },
      { id: "roomNotes", label: "תיאור החדר או קישור לתמונה", type: "textarea", placeholder: "קישור לדרייב או תיאור קצר" },
    ],
    prompt: {
      system: "אתה יועץ אקוסטיקה ואולפן פודקאסט. הצע מפרט ציוד ותאורה. כתוב רק בעברית פשוטה. החזר JSON בלבד.",
      userTemplate: "מידות: {{dimensions}}\nשימוש: {{useCase}}\nתקציב: {{budget}}\nתיאור: {{roomNotes}}",
    },
    whatsappIntro: "שלום, מעוניין/ת בתכנון אולפן בקופסה.",
    canonicalNote: "לייעוץ אקוסטיקה כללי ראו גם /academy/home-studio",
  },
  {
    id: "bulk-production",
    slug: "podcast/bulk-production",
    path: "/podcast/bulk-production",
    title: "הפודקאסט יוצא לבד ואתם חוזרים לעסק",
    subtitle:
      "מקליטים בחברה או באולפן. שולחים גולמי. אנחנו מחזירים פרק מוכן עם פתיח וסגיר קבועים ושלושה קליפים לרשתות. כל שבוע, באותו קצב.",
    metaTitle: "פס ייצור פודקאסט לעסקים | עריכה שוטפת וקליפים",
    metaDescription:
      "מקליטים, שולחים גולמי, מקבלים פרק מוגמר ושלושה סרטונים קצרים. עריכה שוטפת לחברות. מ-950 ₪ לפרק.",
    keywords: [
      "פס ייצור פודקאסט",
      "עריכת פודקאסט לעסק",
      "סרטונים קצרים מפודקאסט",
      "עריכה שוטפת לפודקאסט",
      "הפקת פודקאסט לחברה",
      "פודקאסט B2B",
    ],
    aboutHeading: "למי שמאס לרדוף אחרי עריכה כל שבוע",
    showcasePlaylistId: "bulk-production",
    relatedBlogSlugs: [
      "podcast-production-guide-israel",
      "podcast-needs-professional-editing",
      "business-podcast-roi-2026",
    ],
    crossLinks: [
      {
        title: "עריכת פרק בודד",
        text: "רוצים לנסות פרק אחד לפני שמתחייבים לקצב חודשי?",
        href: "/podcast/podcast-editing",
        linkLabel: "עריכת פודקאסט",
      },
      {
        title: "הפקה מלאה מא׳ עד ת׳",
        text: "הקלטה, עריכה, כיסוי ופרסום. בלי לנהל כל שלב בנפרד.",
        href: "/podcast/podcast-production",
        linkLabel: "ליווי הפקה",
      },
      {
        title: "אולפן בחברה",
        text: "מקליטים בחדר ישיבות? אפשר לחבר הקלטה ועריכה שוטפת.",
        href: "/business/on-site-studio",
        linkLabel: "אולפן זמני בחברה",
      },
      {
        title: "אולפן במודיעין",
        text: "רוצים להקליט אצלנו? אולפן מבודד עם ליווי טכני.",
        href: "/podcast/podcast-studio-modiin",
        linkLabel: "השכרת אולפן",
      },
      {
        title: "אולפן בקופסה",
        text: "בונים אולפן בחברה? אפשר לחבר תכנון ועריכה שוטפת.",
        href: "/podcast/studio-in-a-box",
        linkLabel: "אולפן בקופסה",
      },
      {
        title: "רילז מתוך הפרק",
        text: "שלושה קליפים כלולים. רוצים יותר תוכן לרשתות?",
        href: "/business/reel-factory",
        linkLabel: "מפעל הרילז",
      },
    ],
    scarcityLabel: "לרוב 3 עד 5 ימי עסקים לפרק",
    seoParagraphs: [
      "פעם אחת מגדירים פתיח, סגיר וסגנון. מכאן אתם מדברים ואנחנו מסדרים. כל פרק חדש נכנס לאותו מסלול בלי שתתחילו מחדש.",
      "מתאים לחברות שמקליטות בפנים או באולפן. אפשר להתחיל מפרק ניסיון אחד ולהמשיך לקצב חודשי כשמרגישים בנוח.",
    ],
    features: [
      "פרק מוכן לפרסום בלי שתיגעו בעריכה",
      "אותו סאונד ואותו מיתוג בכל פרק",
      "שלושה קליפים קצרים מכל פרק ללינקדאין ולאינסטגרם",
      "אותו צוות מפרק לפרק",
      "מחיר לפי נפח. יודעים מראש מה זה עולה",
    ],
    processSteps: [
      { number: 1, title: "יום הגדרה", description: "פתיח, סגיר, ואיך הפרק נשמע." },
      { number: 2, title: "אתם מקליטים", description: "בחברה, באולפן שלנו, או בדרייב." },
      { number: 3, title: "אנחנו עורכים", description: "ניקוי, חיתוך ועוצמת שמע אחידה. לרוב 3 עד 5 ימי עסקים." },
      { number: 4, title: "מקבלים פרק מוכן", description: "אודיו, קליפים וגרסת גיבוי." },
    ],
    faqs: [
      {
        question: "מה המינימום?",
        answer: "ארבעה פרקים בחודש, או פרק ניסיון בודד ב-950 ₪ לפני שמתחייבים לקצב.",
      },
      {
        question: "האם כולל תמלול?",
        answer: "תמלול בתוספת. הקליפים הקצרים נבנים מהקטעים שתסמנו או שנבחר יחד.",
      },
      {
        question: "אפשר לשנות את הפתיח?",
        answer: "כן. מעדכנים פעם בשנה או כשמתחדש המיתוג, בתיאום מראש.",
      },
      {
        question: "מקליטים אצלכם או אצלנו?",
        answer: "שניהם. מקליטים איפה שנוח לכם. אנחנו עורכים ומחזירים פרק מוכן.",
      },
      {
        question: "כמה זמן לוקח פרק?",
        answer: "בדרך כלל 3 עד 5 ימי עסקים. לקצב דחוף נבדוק זמינות בוואטסאפ.",
      },
    ],
    closerServiceId: "bulk_podcast",
    bookCategoryId: "podcast",
    pricingId: "bulk_podcast_episode",
    utmCampaign: "pro_bulk_podcast",
    department: "podcast",
    departmentLabel: "פודקאסט לעסקים",
    icon: "🏭",
    wizardTitle: "מחשבון פס ייצור",
    wizardFields: [
      { id: "episodesPerMonth", label: "פרקים בחודש", type: "number", placeholder: "4", required: true },
      { id: "avgDuration", label: "אורך ממוצע (דקות)", type: "number", placeholder: "45" },
      { id: "shortsCount", label: "סרטונים קצרים לפרק", type: "select", options: [
        { value: "3", label: "3 (כלול)" },
        { value: "5", label: "5 (בתוספת תשלום)" },
      ] },
      { id: "company", label: "שם החברה או הארגון", type: "text" },
    ],
    prompt: {
      system: "אתה מנהל הפקת פודקאסט לעסקים. העריך עומס ומחיר חודשי. כתוב רק בעברית פשוטה. החזר JSON בלבד.",
      userTemplate: "פרקים/חודש: {{episodesPerMonth}}\nאורך: {{avgDuration}} דק׳\nסרטונים קצרים: {{shortsCount}}\nארגון: {{company}}",
    },
    whatsappIntro: "שלום, אנחנו מעוניינים בפס ייצור לפודקאסט. הנושא שלנו:",
    simpleCta: {
      title: "בואו נדבר על הפודקאסט שלכם",
      fieldLabel: "על מה הפודקאסט שלכם?",
      placeholder: "למשל יזמות, HR, טכנולוגיה",
      buttonLabel: "שליחה",
      calculatorSummary: "רוצים הערכת מחיר מדויקת?",
    },
    canonicalNote: "לעריכת פרק בודד ראו /podcast/podcast-editing",
  },
  {
    id: "dry-hire",
    slug: "events/equipment/dry-hire",
    path: "/events/equipment/dry-hire",
    title: "השכרת ציוד הגברה",
    subtitle:
      "חסר מיקסר ליום אחד? בוחרים תאריך וציוד, רואים מה פנוי וכמה זה עולה.",
    metaTitle: "השכרת ציוד הגברה ליום | מיקסרים, רמקולים וסאב",
    metaDescription:
      "השכרת ציוד הגברה ליום — מיקסרים, סאבים, רמקולים RCF ו-CDJ. לחברות הגברה, מפיקים ו-DJ שמכירים את הציוד. מ-450 ₪ ליום, איסוף עצמי.",
    keywords: [
      "השכרת ציוד הגברה",
      "השכרת מיקסר",
      "השכרת רמקולים לאירוע",
      "ציוד DJ להשכרה",
      "RCF להשכרה",
      "dry hire הגברה",
    ],
    aboutHeading: "למי זה מתאים",
    showcasePlaylistId: "dry-hire",
    relatedBlogSlugs: [
      "wedding-dj-selection-guide-2026",
      "live-singer-sound-engineer-guide",
      "singer-amplification-booking",
    ],
    crossLinks: [
      {
        title: "הגברה עם טכנאי",
        text: "צריך מישהו שמגיע, מקים ומפעיל? זה שירות נפרד.",
        href: "/events/equipment",
        linkLabel: "חבילות הגברה לאירוע",
      },
      {
        title: "הגברה לזמרים",
        text: "הופעה חיה עם צ'ק סאונד וסאונדמן בשטח.",
        href: "/events/equipment/singer-amplification",
        linkLabel: "הגברה לזמרים",
      },
      {
        title: "תכנון פריסה באולם",
        text: "אולם גדול? אפשר לתכנן מראש איפה לשים רמקולים.",
        href: "/events/equipment/system-tuning",
        linkLabel: "תכנון הגברה",
      },
    ],
    scarcityLabel: "מלאי לפי תאריך — כדאי לאשר מוקדם",
    seoParagraphs: [
      "חברת הגברה שחסר לה מיקסר לסוף שבוע, DJ שמגיש חתונה וצריך סאב נוסף, מפיק שמכיר את הציוד — המחשבון בודק מה פנוי בתאריך שלכם.",
      "זו השכרה בלבד, בלי טכנאי בשטח. אתם אוספים, מחברים ומחזירים. אם צריך מישהו להפעיל, יש חבילת הגברה מלאה בנפרד.",
    ],
    features: [
      "מיקסרים, סאבים, רמקולים ותאורה",
      "בדיקת זמינות לפי תאריך",
      "התאמה לרשימת דרישות האמן",
      "איסוף עצמי או משלוח בתיאום",
      "ציוד מתוחזק ומוכן לשטח",
    ],
    processSteps: [
      { number: 1, title: "תאריך ורשימת ציוד", description: "בוחרים תאריך ומסמנים מה חסר." },
      { number: 2, title: "זמינות", description: "המחשבון בודק מלאי מול הזמנות פעילות." },
      { number: 3, title: "הצעת מחיר", description: "סיכום יומי לפי פריט." },
      { number: 4, title: "איסוף", description: "תיאום איסוף והחזרה." },
    ],
    faqs: [
      {
        question: "האם כולל טכנאי?",
        answer: "לא. רק ציוד. לחבילה עם טכנאי ואיסוף — עמוד ההגברה לאירועים.",
      },
      {
        question: "DJ פרטי יכול לשכור?",
        answer: "כן, אם אתם יודעים לחבר ולהפעיל. הרבה תקליטנים שוכרים סאב או מיקסר ליום בודד.",
      },
      {
        question: "איך יודעים מה פנוי?",
        answer: "המחשבון בודק מול הזמנות פעילות. לתאריך קרוב — עדיף לאשר בוואטסאפ.",
      },
      {
        question: "מה אם פריט תפוס?",
        answer: "נראה חלופה או תאריך אחר. לפעמים אותו סוג ציוד במלאי כפול.",
      },
      {
        question: "איך האיסוף וההחזרה?",
        answer: "בתיאום מראש. אפשר איסוף עצמי או משלוח — לפי מה שסיכמנו.",
      },
    ],
    closerServiceId: "dry_hire",
    bookCategoryId: "singer",
    pricingId: "dry_hire_day",
    utmCampaign: "pro_dry_hire",
    department: "pro-audio",
    departmentLabel: "הגברה",
    icon: "📋",
    wizardTitle: "מחשבון זמינות ציוד",
    wizardFields: [
      { id: "eventDate", label: "תאריך אירוע", type: "date", required: true },
      { id: "items", label: "ציוד נדרש", type: "multiselect", options: [
        { value: "mixer_ah_qu", label: "מיקסר אלן אנד הית' QU" },
        { value: "sub_rcf_15", label: "סאב RCF 15 אינץ'" },
        { value: "speaker_rcf_745", label: "זוג רמקולים RCF 745" },
        { value: "dj_cdj_pair", label: "זוג נגני CDJ 3000" },
        { value: "led_wash", label: "תאורת ווש צבעונית" },
      ], required: true },
      { id: "riderNotes", label: "פירוט דרישות האמן", type: "textarea" },
    ],
    prompt: {
      system: "אתה מנהל מלאי הגברה. סכם זמינות והמלץ על חלופות. כתוב רק בעברית פשוטה. החזר JSON בלבד.",
      userTemplate: "תאריך: {{eventDate}}\nפריטים: {{items}}\nדרישות: {{riderNotes}}",
    },
    whatsappIntro: "שלום, צריך לשכור ציוד הגברה ליום אחד.",
  },
  {
    id: "system-tuning",
    slug: "events/equipment/system-tuning",
    path: "/events/equipment/system-tuning",
    title: "תכנון הגברה ומדידות באולם",
    subtitle:
      "אירוע מורכב? תכנון פריסת רמקולים במחשב ומדידות בשטח - כדי שכל הקהל שומע טוב בלי החזרים מהקירות.",
    metaTitle: "תכנון הגברה לאירוע | פריסת רמקולים ומדידות",
    metaDescription:
      "תכנון פריסת רמקולים במחשב ומדידות מקצועיות בשטח לאירועים גדולים. לחברות הגברה. החל מ-3,500 שקלים.",
    keywords: [
      "תכנון הגברה",
      "פריסת רמקולים",
      "מדידות סאונד באולם",
      "הגברה לאירוע גדול",
      "ייעוץ הגברה",
    ],
    seoParagraphs: [
      "באולם גדול או באירוע חוץ, מיקום הרמקולים קובע אם הקהל שומע ברור. אנחנו בונים מודל ממידות האולם וממליצים על פריסה, עיכובים ואיזון.",
      "אפשר תכנון מרחוק בלבד, או גם הגעה לשטח למדידות לפני האירוע - לפי מורכבות המקום.",
    ],
    features: [
      "מודל ממוחשב לפי מידות האולם",
      "מדידות בשטח לפני האירוע (אופציונלי)",
      "דוח פריסה והמלצות איזון",
      "ייעוץ לחברות הגברה קטנות ובינוניות",
      "תיאום עם דרישות האמן",
    ],
    processSteps: [
      { number: 1, title: "מידות וסוג אירוע", description: "תוכנית אולם או מידות + סוג קהל." },
      { number: 2, title: "מודל", description: "בניית מודל והצעת פריסה." },
      { number: 3, title: "מדידות", description: "בדיקה בשטח לפני האירוע אם נדרש." },
      { number: 4, title: "דוח", description: "מסמך פריסה והגדרות מומלצות." },
    ],
    faqs: [
      { question: "מה צריך לספק?", answer: "מידות אולם, תוכנית או תמונה, סוג אירוע, וריידר אם קיים." },
      { question: "האם אתם מגיעים לשטח?", answer: "תכנון במחשב - מרחוק. מדידות בשטח - בתיאום ובתוספת נסיעה." },
      { question: "למי השירות מתאים?", answer: "לחברות הגברה שמפיקות כנסים, חתונות גדולות והופעות באולמות לא מוכרים." },
    ],
    closerServiceId: "system_tuning",
    bookCategoryId: "singer",
    pricingId: "system_tuning_ease",
    utmCampaign: "pro_system_tuning",
    department: "pro-audio",
    departmentLabel: "הגברה",
    icon: "📐",
    wizardTitle: "מחשבון תכנון מערכת",
    wizardFields: [
      { id: "venueSize", label: "גודל אולם (אורחים)", type: "select", options: [
        { value: "100", label: "עד 100" },
        { value: "250", label: "100 עד 250" },
        { value: "500", label: "250 עד 500" },
        { value: "1000", label: "מעל 500" },
      ], required: true },
      { id: "eventType", label: "סוג אירוע", type: "select", options: [
        { value: "concert", label: "הופעה / קונצרט" },
        { value: "conference", label: "כנס / הרצאות" },
        { value: "wedding", label: "חתונה" },
        { value: "outdoor", label: "חוץ / פתוח" },
      ], required: true },
      { id: "dimensions", label: "מידות (אופציונלי)", type: "text", placeholder: "20 על 12 על 4 מטר" },
      { id: "needsSmaart", label: "מדידות בשטח לפני האירוע?", type: "select", options: [
        { value: "yes", label: "כן" },
        { value: "no", label: "לא - תכנון במחשב בלבד" },
      ] },
    ],
    prompt: {
      system: "אתה מהנדס סאונד. הצע פריסת רמקולים ושירות תכנון. כתוב רק בעברית פשוטה. החזר JSON בלבד.",
      userTemplate: "קהל: {{venueSize}}\nסוג: {{eventType}}\nמידות: {{dimensions}}\nמדידות בשטח: {{needsSmaart}}",
    },
    whatsappIntro: "שלום, מעוניינים בתכנון הגברה לאירוע.",
  },
] as const;

const proById = new Map(PRO_SERVICES.map((s) => [s.id, s]));

export function getProService(id: ProServiceId): ProService {
  const svc = proById.get(id);
  if (!svc) throw new Error(`Unknown pro service: ${id}`);
  return svc;
}

export function getProServiceBySlug(slug: string): ProService | undefined {
  const normalized = slug.replace(/^\/+/, "");
  return PRO_SERVICES.find((s) => s.slug === normalized);
}

export function metadataFromProService(id: ProServiceId) {
  const svc = getProService(id);
  return {
    title: svc.metaTitle,
    description: svc.metaDescription,
    slug: svc.slug,
    keywords: [...svc.keywords],
  };
}
