import type { BookCategoryId } from "@/lib/book-url";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import type { ProcessStep } from "@/components/marketing/ProcessSteps";

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

export type ProService = {
  id: ProServiceId;
  slug: string;
  path: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  /** פסקאות תוכן לעמוד השירות — עוזרות לאינדוקס ולקריאה נעימה */
  seoParagraphs: readonly string[];
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
};

export const PRO_DEPARTMENTS = [
  {
    id: "dj" as const,
    label: "תקליטנים ויוצרי מוזיקה",
    description:
      "תגים קוליים, מאשאפים דחופים וסטים מוכנים — חומר שמרים את האירוע ונשמע מקצועי.",
  },
  {
    id: "podcast" as const,
    label: "פודקאסטים ויוצרי תוכן לעסקים",
    description:
      "אולפן בקופסה ופס ייצור — אתם מגדירים את החזון, אנחנו מביאים את הביצוע.",
  },
  {
    id: "pro-audio" as const,
    label: "הגברה ותאורה",
    description:
      "השלמת ריידרים ותכנון מערכות — פתרונות גיבוי והשכרת ציוד לפי צורך.",
  },
] as const;

export const PRO_SERVICES: readonly ProService[] = [
  {
    id: "dj-voice-tags",
    slug: "events/dj/voice-tags",
    path: "/events/dj/voice-tags",
    title: "תג קולי וקריינות לדיג'יי",
    subtitle:
      "שולחים את המשפט שרוצים לשמוע בסט — מקבלים קריינות מעוצבת עם הדהוד, הד מושהה ואפקטים נוספים. מוכן להטמעה באירוע.",
    metaTitle: "תג קולי לדיג'יי | קריינות ממותגת לסט",
    metaDescription:
      "קריינות מותאמת לדיג'ייז עם אפקטי מועדון — הדהוד, הד מושהה ועוד. מסירה תוך יומיים. החל מ-350 שקלים לפני מע״מ.",
    keywords: [
      "תג קולי לדיג'יי",
      "קריינות לסט",
      "אפקטים למועדון",
      "קריינות ממותגת",
      "שירות לדיג'יי מקצועי",
    ],
    seoParagraphs: [
      "תג קולי הוא המשפט הקצר שמלווה את הסט שלכם — שם, סלוגן או קריאה לאנרגיה. אנחנו מקליטים, מעצבים ומוסיפים אפקטים שמתאימים לאווירת המועדון.",
      "השירות מיועד לדיג'ייז שרוצים סאונד מלוטש בלי לבזבז שעות על עריכה. מקבלים קבצים מוכנים לנגן מקצועי — באיכות גבוהה ובגרסה נוחה להפצה.",
    ],
    features: [
      "הקלטה ועריכה מהירה — בדרך כלל תוך יומיים",
      "אפקטי מועדון: הדהוד, הד מושהה, לייזר ומסנן",
      "גרסאות קצרות וארוכות לפי הצורך",
      "קבצי איכות גבוהה מוכנים לנגן מקצועי",
      "חבילות של תג אחד, חמישה או עשרה במחיר מוזל",
    ],
    processSteps: [
      { number: 1, title: "שולחים את המשפט", description: "טקסט קצר, שם הדיג'יי וסגנון מועדף — אנרגטי, יוקרתי או נקי." },
      { number: 2, title: "הצעת עריכה", description: "המחשבון באתר מציע אפקטים וקצב — אתם מאשרים או מבקשים שינוי." },
      { number: 3, title: "הקלטה ועיבוד", description: "קריינות מקצועית ועריכה מוזיקלית ברמת מועדון." },
      { number: 4, title: "מסירה", description: "קבצים מוכנים להטמעה בסט — באיכות מקסימלית ובגרסה דחוסה." },
    ],
    faqs: [
      { question: "כמה זמן לוקח תג קולי?", answer: "רוב הפרויקטים נמסרים תוך יומיים. דחוף לאירוע מחר? ציינו בבקשה — נבדוק זמינות." },
      { question: "איזה אפקטים אפשר?", answer: "הדהוד, הד מושהה, אפקט לייזר, מסנן תדרים ועוד — לפי הסגנון שבחרתם." },
      { question: "באיזה פורמט מקבלים?", answer: "קבץ באיכות מקסימלית וגרסה דחוסה — מוכנים לכל נגן דיג'יי מקצועי." },
      { question: "אפשר בעברית ובאנגלית?", answer: "כן. כותבים את המשפט בשפה שבה תרצו לשמוע אותו בסט." },
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
      { id: "phrase", label: "המשפט לקריינות", type: "textarea", placeholder: "לדוגמה: דיג'יי יקיר — חי ממודיעין", required: true },
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
    title: "מאשאפ חירום — שילוב שירים מהיר",
    subtitle:
      "צריכים גרסה מיוחדת שמשלבת שני שירים לחתונה מחר? עריכה מהירה מהיום למחר — התאמת סולמות וקצב מדויק.",
    metaTitle: "מאשאפ חירום לדיג'יי | עריכה תוך 24 שעות",
    metaDescription:
      "שילוב שני שירים לדיג'ייז — התאמת סולמות, קצב ומעברים חלקים. עד 24 שעות. החל מ-1,800 שקלים לפני מע״מ.",
    keywords: [
      "מאשאפ לדיג'יי",
      "שילוב שירים",
      "עריכה דחופה",
      "מאשאפ לחתונה",
      "עריכת מוזיקה לאירוע",
    ],
    seoParagraphs: [
      "לפעמים האירוע דורש שילוב של שני שירים שלא ישבו יחד על הדיסק. אנחנו בונים מאשאפ מדויק — עם מעברים נקיים וקצב אחיד.",
      "השירות מיועד לדיג'ייז ומפיקים שצריכים פתרון מהיר לפני אירוע. ממלאים את המחשבון, מקבלים הערכת מחיר, ואחרי אישור שולחים את הקבצים בוואטסאפ.",
    ],
    features: [
      "מסירה עד 24 שעות לאירועים דחופים",
      "התאמת סולמות וקצב מקצועית",
      "מעברים חלקים — פתיחה, שיא וסיום",
      "קבצים מוכנים לנגן מקצועי",
      "סבב תיקון אחד כלול במחיר",
    ],
    processSteps: [
      { number: 1, title: "פרטי השירים", description: "שם שני השירים, קצב אם ידוע, ואיזה חלק לשלב." },
      { number: 2, title: "הערכה באתר", description: "המחשבון מציע נקודת מיזוג, סולם ואורך משוער." },
      { number: 3, title: "עריכה ידנית", description: "מיקס מקצועי — לא אוטומציה עיוורת." },
      { number: 4, title: "מסירה", description: "קובץ מוכן וגרסת גיבוי." },
    ],
    faqs: [
      { question: "מה המינימום זמן?", answer: "לרוב עד 24 שעות. לאירוע היום — צרו קשר בוואטסאפ לבדיקת זמינות מיידית." },
      { question: "צריך לשלוח את הקבצים?", answer: "כן — אחרי אישור תנאים, שלחו בוואטסאפ או בדרייב. אם אין לכם את הקבצים, נשתמש בגרסאות איכותיות מהספרייה." },
      { question: "האם התאמת הסולמות מובטחת?", answer: "אנחנו מתאימים סולמות וקצב במקצועיות. יקיר בודק ידנית לפני מסירה." },
    ],
    closerServiceId: "mashup_fixer",
    bookCategoryId: "online",
    pricingId: "mashup_fixer_express",
    utmCampaign: "pro_mashup_fixer",
    department: "dj",
    departmentLabel: "תקליטנים",
    icon: "🔀",
    wizardTitle: "מחשבון מאשאפ חירום",
    wizardFields: [
      { id: "songA", label: "שיר ראשון", type: "text", required: true },
      { id: "songB", label: "שיר שני", type: "text", required: true },
      { id: "eventDate", label: "תאריך האירוע", type: "date", required: true },
      { id: "bpmHint", label: "קצב מוזיקלי (אם ידוע)", type: "text", placeholder: "לדוגמה: 128" },
      { id: "notes", label: "הערות", type: "textarea", placeholder: "איזה חלק לשלב, אורך רצוי..." },
    ],
    prompt: {
      system: "אתה עורך מאשאפים מקצועי. הצע נקודת מיזוג, סולמות ואורך. כתוב רק בעברית פשוטה. החזר JSON בלבד.",
      userTemplate: "שיר א: {{songA}}\nשיר ב: {{songB}}\nתאריך: {{eventDate}}\nקצב: {{bpmHint}}\nהערות: {{notes}}",
    },
    whatsappIntro: "שלום, צריך מאשאפ דחוף לאירוע.",
  },
  {
    id: "pre-built-sets",
    slug: "events/dj/pre-built-sets",
    path: "/events/dj/pre-built-sets",
    title: "סטים מוכנים לאירועי חברה",
    subtitle:
      "מאגרי מוזיקה ערוכים ומסודרים לפי קטגוריות — לדיג'ייז מתחילים או כאלה שאין להם זמן לערוך. מחוברים בקצב קבוע, מוכנים להפעלה.",
    metaTitle: "סט מוזיקה מוכן לדיג'יי | קבלת פנים ואירועי חברה",
    metaDescription:
      "סטי דיג'יי מוכנים לפי קטגוריה — קבלת פנים, להיטים ואירועי חברה. ערוכים ומחוברים בקצב. החל מ-450 שקלים לפני מע״מ.",
    keywords: [
      "סט מוזיקה מוכן",
      "מוזיקה לאירוע חברה",
      "קבלת פנים דיג'יי",
      "סט לחתונה",
      "מוזיקה לאירוע",
    ],
    seoParagraphs: [
      "לא תמיד יש זמן לבנות סט מאפס לפני כל אירוע. הסטים המוכנים שלנו בנויים לפי סוג אירוע — קבלת פנים, רחבת ריקודים או ערב חברה.",
      "כל סט כולל רשימת שירים, אורך וקצב ממוצע. אפשר לקבל על דיסק און קי או בהורדה — עם הדרכה קצרה לטעינה בנגן.",
    ],
    features: [
      "סטים לפי קטגוריה: קבלת פנים, להיטים, אירוע חברה",
      "מחוברים בקצב קבוע — מוכנים להפעלה",
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
      { question: "האם אפשר לבקש שינויים?", answer: "כן — התאמות קטנות (הסרת או הוספת שיר בודד) בתוספת תשלום סמלי." },
      { question: "באיזה פורמט?", answer: "דיסק און קי מוכן לתוכנת ניהול מוזיקה, או קבצים בדרייב." },
      { question: "מה לגבי זכויות יוצרים?", answer: "הסטים מיועדים לשימוש מקצועי באירועים פרטיים. רישוי לשידור — באחריות הלקוח." },
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
        { value: "wedding", label: "חתונה — ערב" },
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
    title: "אולפן בקופסה — תכנון חדר הקלטה",
    subtitle:
      "ייעוץ ותכנון אקוסטי ותאורה לפי מידות החדר. שולחים שרטוט או תמונה — מקבלים מפרט ציוד מדויק ועריכה לעשרת הפרקים הראשונים.",
    metaTitle: "תכנון אולפן פודקאסט | אולפן בקופסה לעסקים",
    metaDescription:
      "ייעוץ אקוסטיקה, תאורה ומפרט ציוד לאולפן פודקאסט — לפי מידות החדר. כולל עריכה ל-10 פרקים ראשונים. החל מ-2,500 שקלים.",
    keywords: [
      "בניית אולפן",
      "אולפן פודקאסט",
      "ייעוץ אקוסטיקה",
      "תכנון חדר הקלטה",
      "אולפן לעסק",
    ],
    seoParagraphs: [
      "רוצים אולפן בחדר משרד, בבית או בסטודיו קטן? אנחנו מתכננים לפי המידות האמיתיות — אקוסטיקה, מיקרופונים, תאורה ומצלמה אם צריך.",
      "החבילה כוללת דוח מפרט, שיחת ייעוץ ועריכת עשרה פרקים ראשונים — כדי שתתחילו לפרסם בלי לנחש מה חסר.",
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
      { question: "מה ההבדל מייעוץ אקוסטיקה רגיל?", answer: "אולפן בקופסה כולל מפרט ציוד מלא, תאורה לוידאו וחבילת עריכה — מוצר שלם לעסקים." },
      { question: "איך שולחים שרטוט?", answer: "במחשבון — קישור לדרייב, תיאור מילולי או תמונה. לא חובה להעלות קובץ לשרת." },
      { question: "האם אתם קונים את הציוד בשבילנו?", answer: "אנחנו ממליצים על דגמים וספקים. הרכישה — אצלכם, עם ליווי אם צריך." },
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
    title: "פס ייצור לפודקאסט — עריכה וסרטונים קצרים",
    subtitle:
      "לחברות וארגונים שמקליטים פודקאסטים: שולחים חומר גולמי, מקבלים פרק ערוך, סאונד מנורמל, פתיח וסגיר קבועים, ושלושה סרטונים קצרים לרשתות — לכל פרק.",
    metaTitle: "עריכת פודקאסט לעסקים | פס ייצור וסרטונים קצרים",
    metaDescription:
      "חבילת עריכה לחברות — פרק מוגמר, נורמליזציה, פתיח וסגיר קבועים ושלושה סרטונים קצרים לפרק. החל מ-950 שקלים לפרק.",
    keywords: [
      "עריכת פודקאסט לעסק",
      "פס ייצור פודקאסט",
      "סרטונים קצרים מפודקאסט",
      "עריכה שוטפת",
      "הפקת פודקאסט לחברה",
    ],
    seoParagraphs: [
      "כשמפיקים פודקאסט באופן קבוע, צריך תבנית אחידה — פתיח, סגיר, עוצמת שמע וסרטונים לרשתות. פס הייצור נבנה פעם אחת ואז רצים חודש אחר חודש.",
      "המחשבון באתר מעריך עלות חודשית לפי מספר הפרקים ואורכם. אחרי פיילוט לפרק בודד — ממשיכים בקצב קבוע עם מנהל פרויקט ייעודי.",
    ],
    features: [
      "פרק ערוך עם עוצמת שמע אחידה",
      "פתיח וסגיר קבועים (מיתוג)",
      "שלושה סרטונים קצרים לרשתות לכל פרק",
      "מחירון מדורג לפי נפח חודשי",
      "מנהל פרויקט ייעודי",
    ],
    processSteps: [
      { number: 1, title: "הגדרת פס ייצור", description: "פתיח, סגיר, סגנון עריכה ותבנית לסרטונים קצרים." },
      { number: 2, title: "שליחת חומר", description: "דרייב או העברת קבצים — כל פרק בתיקייה." },
      { number: 3, title: "עריכה שוטפת", description: "לרוב שלושה עד חמישה ימי עסקים לפרק." },
      { number: 4, title: "מסירה", description: "פרק, סרטונים קצרים וגרסת גיבוי." },
    ],
    faqs: [
      { question: "מה המינימום?", answer: "מארבעה פרקים בחודש — או חבילת ניסיון לפרק בודד ב-950 שקלים." },
      { question: "האם כולל תמלול?", answer: "תמלול בתוספת תשלום. הסרטונים הקצרים נבנים מהקטעים שתסמנו או שנבחר." },
      { question: "אפשר לשנות את פתיח הסגיר?", answer: "כן — מעדכנים פעם בשנה או כשמתחדש המיתוג, בתיאום מראש." },
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
    whatsappIntro: "שלום, מעוניינים בפס ייצור לעריכת פודקאסט.",
    canonicalNote: "לעריכת פרק בודד ראו /podcast/podcast-editing",
  },
  {
    id: "dry-hire",
    slug: "events/equipment/dry-hire",
    path: "/events/equipment/dry-hire",
    title: "השכרת ציוד הגברה בלבד",
    subtitle:
      "חברת הגברה קיבלה אירוע אבל חסר מיקסר או סאב? השכרת ציוד בלי אנשי צוות — בדיקת זמינות לפי תאריך ישירות באתר.",
    metaTitle: "השכרת ציוד הגברה | השלמת ריידר לחברות",
    metaDescription:
      "השכרת מיקסרים, סאבים, רמקולים ותאורה בלבד — בדיקת זמינות לפי תאריך. לחברות הגברה והפקה. החל מ-450 שקלים ליום.",
    keywords: [
      "השכרת ציוד הגברה",
      "השלמת ריידר",
      "השכרת מיקסר",
      "ציוד הגברה לאירוע",
      "השכרת רמקולים",
    ],
    seoParagraphs: [
      "כשהריידר דורש ציוד שאין במלאי שלכם, אפשר להשלים בלי להעסיק טכנאים נוספים. בוחרים תאריך ופריטים — המחשבון בודק זמינות ומציג מחיר יומי.",
      "השירות מיועד לחברות הגברה, מפיקים וטכנאים שכבר מכירים את הציוד ורק צריכים השלמה. איסוף עצמי או משלוח בתיאום.",
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
      { question: "האם כולל טכנאי?", answer: "השכרת ציוד בלבד — בלי אנשי שטח. טכנאי ושירות מלא אפשר לתאם בנפרד דרך עמוד ההגברה." },
      { question: "איך מתעדכן המלאי?", answer: "המלאי מתעדכן לפי הזמנות פעילות. לתאריכים צמודים — אשרו בוואטסאפ." },
      { question: "מה קורה אם פריט תפוס?", answer: "המחשבון מציין מה לא פנוי. נציע חלופה קרובה או תאריך אחר בשיחה." },
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
    whatsappIntro: "שלום, צריך השכרת ציוד להשלמת ריידר.",
  },
  {
    id: "system-tuning",
    slug: "events/equipment/system-tuning",
    path: "/events/equipment/system-tuning",
    title: "תכנון הגברה ומדידות באולם",
    subtitle:
      "אירוע מורכב? תכנון פריסת רמקולים במחשב ומדידות בשטח — כדי שכל הקהל שומע טוב בלי החזרים מהקירות.",
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
      "אפשר תכנון מרחוק בלבד, או גם הגעה לשטח למדידות לפני האירוע — לפי מורכבות המקום.",
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
      { question: "האם אתם מגיעים לשטח?", answer: "תכנון במחשב — מרחוק. מדידות בשטח — בתיאום ובתוספת נסיעה." },
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
        { value: "no", label: "לא — תכנון במחשב בלבד" },
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
