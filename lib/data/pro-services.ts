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
      "Voice Tags, מאשאפים חירום וסטים מובנים — חומרים שמרימים את הסט ונראים יוקרתיים.",
  },
  {
    id: "podcast" as const,
    label: "פודקאסטים ויוצרי תוכן B2B",
    description:
      "אולפן קופסה ופס ייצור — אתם האדריכל של האולפן, אנחנו מביאים את הידיים.",
  },
  {
    id: "pro-audio" as const,
    label: "הגברה ותאורה",
    description:
      "השלמת ריידרים ותכנון מערכות — פתרונות גיבוי והשלמות מלאי מהרגע להרגע.",
  },
] as const;

export const PRO_SERVICES: readonly ProService[] = [
  {
    id: "dj-voice-tags",
    slug: "events/dj/voice-tags",
    path: "/events/dj/voice-tags",
    title: "Voice Tags וקריינות לסטים",
    subtitle:
      "חבילות קוסטום לדיג'ייז: מזינים את המשפט, מקבלים עריכה מוזיקלית עם Reverb, Delay ו-Laser — סאונד מועדון מוכן להטמעה בסט.",
    metaTitle: "Voice Tags לדיג'ייז | קריינות עם אפקטים",
    metaDescription:
      "Voice Tags מותאמים לדיג'ייז — קריינות מהירה עם אפקטי מועדון (Reverb, Delay, Laser). החל מ-350 ₪ לפני מע״מ.",
    keywords: [
      "voice tags",
      "קריינות לדיג'יי",
      "DJ drops",
      "אפקטים למועדון",
      "voice tag בעברית",
    ],
    features: [
      "הקלטה ועריכה מהירה — מוכן תוך 24–48 שעות",
      "אפקטי מועדון: Reverb, Delay, Laser, Filter",
      "גרסאות קצרות וארוכות לכל פורמט",
      "פורמט WAV + MP3 320 מוכן ל-CDJ",
      "חבילות 1 / 5 / 10 tags במחיר מוזל",
    ],
    processSteps: [
      { number: 1, title: "שולחים את המשפט", description: "טקסט קצר, שם DJ, סגנון מועדפים (אנרגטי / יוקרתי / מינימלי)." },
      { number: 2, title: "הצעת עריכה", description: "המערכת מציעה אפקטים וקצב — אתם מאשרים או מבקשים שינוי." },
      { number: 3, title: "הקלטה ועיבוד", description: "קריינות מקצועית + עריכה מוזיקלית בסטנדרט מועדון." },
      { number: 4, title: "מסירה", description: "קבצים מוכנים להטמעה בסט — WAV ו-MP3." },
    ],
    faqs: [
      { question: "כמה זמן לוקח Voice Tag?", answer: "רוב הפרויקטים נמסרים תוך 24–48 שעות. דחוף לאירוע מחר? ציינו בבקשה — נבדוק זמינות." },
      { question: "איזה אפקטים אפשר?", answer: "Reverb, Delay, Laser, Filter, Stutter ועוד — לפי הסגנון שבחרתם (מועדון, פסטיבל, יוקרה)." },
      { question: "באיזה פורמט מקבלים?", answer: "WAV 48kHz/24bit + MP3 320 — מוכן ל-Pioneer CDJ וכל תוכנת DJ." },
    ],
    closerServiceId: "dj_voice_tags",
    bookCategoryId: "dj",
    pricingId: "dj_voice_tag_single",
    utmCampaign: "pro_voice_tags",
    department: "dj",
    departmentLabel: "תקליטנים",
    icon: "🎤",
    wizardTitle: "בניית Voice Tag",
    wizardFields: [
      { id: "phrase", label: "המשפט לקריינות", type: "textarea", placeholder: "לדוגמה: DJ Yakir — live from Modi'in", required: true },
      { id: "style", label: "סגנון", type: "select", options: [
        { value: "club", label: "מועדון / אנרגטי" },
        { value: "luxury", label: "יוקרתי / VIP" },
        { value: "festival", label: "פסטיבל / עוצמתי" },
        { value: "minimal", label: "מינימלי / נקי" },
      ], required: true },
      { id: "effects", label: "אפקטים מועדפים", type: "multiselect", options: [
        { value: "reverb", label: "Reverb" },
        { value: "delay", label: "Delay" },
        { value: "laser", label: "Laser" },
        { value: "filter", label: "Filter" },
      ] },
    ],
    prompt: {
      system: "אתה יועץ סאונד לדיג'ייז מקצועיים. הצע עריכה מוזיקלית ל-Voice Tag בעברית או אנגלית. החזר JSON בלבד.",
      userTemplate: "משפט: {{phrase}}\nסגנון: {{style}}\nאפקטים: {{effects}}",
    },
    whatsappIntro: "שלום, מעוניין/ת ב-Voice Tag לסט DJ.",
  },
  {
    id: "mashup-fixer",
    slug: "online/mashup-fixer",
    path: "/online/mashup-fixer",
    title: "מאשאפ חירום — The Mashup Fixer",
    subtitle:
      "צריכים גרסה מיוחדת שמשלבת שני שירים לחתונה מחר? עריכה מהירה מהיום למחר — Key Matching וביטמיקס מדויק.",
    metaTitle: "מאשאפ חירום לדיג'ייז | עריכה תוך 24 שעות",
    metaDescription:
      "שירות מאשאפ דחוף לדיג'ייז — שילוב שני שירים, התאמת סולמות וביטמיקס. עד 24 שעות. החל מ-1,800 ₪ לפני מע״מ.",
    keywords: ["מאשאפ", "mashup", "key matching", "ביטמיקס", "עריכה דחופה DJ"],
    features: [
      "SLA עד 24 שעות לאירועים דחופים",
      "Key Matching ו-BPM sync מקצועי",
      "מעברים חלקים — intro, drop, outro",
      "פורמט WAV/MP3 מוכן ל-CDJ",
      "סבב תיקון אחד כלול",
    ],
    processSteps: [
      { number: 1, title: "פרטי השירים", description: "שם שני השירים, BPM אם ידוע, ואיזה חלק לשלב." },
      { number: 2, title: "אבחון AI", description: "המערכת מציעה נקודת מיזוג, סולם ואורך משוער." },
      { number: 3, title: "עריכה ידנית", description: "מיקס מקצועי — לא אוטומציה עיוורת." },
      { number: 4, title: "מסירה", description: "קובץ מוכן + גרסת גיבוי." },
    ],
    faqs: [
      { question: "מה המינימום זמן?", answer: "לרוב עד 24 שעות. לאירוע היום — צרו קשר בוואטסאפ לבדיקת זמינות מיידית." },
      { question: "צריך לשלוח את הקבצים?", answer: "כן — אחרי אישור תנאים, שלחו בוואטסאפ או Drive. אם אין לכם את הקבצים, נשתמש בגרסאות איכותיות מהספרייה." },
      { question: "האם Key Matching מובטח?", answer: "אנחנו מתאימים סולמות ו-BPM במקצועיות. AI מציע, יקיר מאשר ידנית לפני מסירה." },
    ],
    closerServiceId: "mashup_fixer",
    bookCategoryId: "online",
    pricingId: "mashup_fixer_express",
    utmCampaign: "pro_mashup_fixer",
    department: "dj",
    departmentLabel: "תקליטנים",
    icon: "🔀",
    wizardTitle: "בקשת מאשאפ חירום",
    wizardFields: [
      { id: "songA", label: "שיר ראשון", type: "text", required: true },
      { id: "songB", label: "שיר שני", type: "text", required: true },
      { id: "eventDate", label: "תאריך האירוע", type: "date", required: true },
      { id: "bpmHint", label: "BPM (אם ידוע)", type: "text", placeholder: "לדוגמה: 128" },
      { id: "notes", label: "הערות", type: "textarea", placeholder: "איזה חלק לשלב, אורך רצוי..." },
    ],
    prompt: {
      system: "אתה עורך מאשאפים מקצועי. הצע נקודת מיזוג, סולמות ואורך. החזר JSON בלבד.",
      userTemplate: "שיר א: {{songA}}\nשיר ב: {{songB}}\nתאריך: {{eventDate}}\nBPM: {{bpmHint}}\nהערות: {{notes}}",
    },
    whatsappIntro: "שלום, צריך מאשאפ דחוף לאירוע.",
  },
  {
    id: "pre-built-sets",
    slug: "events/dj/pre-built-sets",
    path: "/events/dj/pre-built-sets",
    title: "סטים מובנים לאירועי חברה",
    subtitle:
      "מאגרי מוזיקה ערוכים ומסודרים לפי קטגוריות — לדיג'ייז מתחילים או כאלה שאין להם זמן לערוך. מחוברים בביט קבוע, מוכנים ל-CDJ.",
    metaTitle: "סטים מובנים לדיג'ייז | קבלת פנים ואירועי חברה",
    metaDescription:
      "סטי DJ מוכנים לפי קטגוריה — קבלת פנים, מיינסטרים, אירועי חברה 2026. ערוכים, מחוברים בביט. החל מ-450 ₪ לפני מע״מ.",
    keywords: ["סט DJ מוכן", "מוזיקה לאירוע חברה", "קבלת פנים DJ", "pre-built DJ set"],
    features: [
      "סטים לפי קטגוריה: קבלת פנים, מיינסטרים, אירוע חברה",
      "מחוברים בביט קבוע — מוכנים להפעלה",
      "רשימת שירים מפורטת לכל סט",
      "פורמט Rekordbox / USB מוכן",
      "עדכון עונתי (2026)",
    ],
    processSteps: [
      { number: 1, title: "בוחרים קטגוריה", description: "קבלת פנים, מיינסטרים, חברה או מסיבה." },
      { number: 2, title: "מאזינים לדוגמה", description: "תצוגה מקדימה של 2–3 דקות מהסט." },
      { number: 3, title: "רכישה", description: "תשלום ומסירה ב-USB או הורדה." },
      { number: 4, title: "תמיכה", description: "הדרכה קצרה לטעינה ב-CDJ." },
    ],
    faqs: [
      { question: "האם אפשר לבקש שינויים?", answer: "כן — התאמות קטנות (הסרת/הוספת שיר בודד) בתוספת תשלום סמלי." },
      { question: "באיזה פורמט?", answer: "USB מוכן ל-Rekordbox או קבצי WAV/MP3 ב-Drive." },
      { question: "זכויות יוצרים?", answer: "הסטים מיועדים לשימוש מקצועי באירועים פרטיים. האחריות על רישוי PRS על הלקוח." },
    ],
    closerServiceId: "prebuilt_sets",
    bookCategoryId: "dj",
    pricingId: "prebuilt_set_corporate",
    utmCampaign: "pro_prebuilt_sets",
    department: "dj",
    departmentLabel: "תקליטנים",
    icon: "📀",
    wizardTitle: "בחירת סט מובנה",
    wizardFields: [
      { id: "category", label: "קטגוריה", type: "select", options: [
        { value: "reception_2026", label: "קבלת פנים 2026" },
        { value: "mainstream", label: "מיינסטרים" },
        { value: "corporate", label: "אירוע חברה" },
        { value: "wedding", label: "חתונה — ערב" },
      ], required: true },
      { id: "duration", label: "אורך רצוי (דקות)", type: "number", placeholder: "60" },
      { id: "format", label: "פורמט מסירה", type: "select", options: [
        { value: "usb", label: "USB מוכן" },
        { value: "drive", label: "הורדה מ-Drive" },
      ] },
    ],
    prompt: {
      system: "אתה יועץ מוזיקה לדיג'ייז. המלץ על סט מובנה לפי קטגוריה. החזר JSON בלבד.",
      userTemplate: "קטגוריה: {{category}}\nאורך: {{duration}} דקות\nפורמט: {{format}}",
    },
    whatsappIntro: "שלום, מעוניין/ת בסט DJ מובנה.",
  },
  {
    id: "studio-in-a-box",
    slug: "podcast/studio-in-a-box",
    path: "/podcast/studio-in-a-box",
    title: "אולפן קופסה — Studio In A Box",
    subtitle:
      "ייעוץ ותכנון אקוסטי ותאורה לפי מידות החדר. מעלים שרטוט או תמונה — מקבלים מפרט ציוד מדויק + שירותי עריכה מראש ל-10 הפרקים הראשונים.",
    metaTitle: "Studio In A Box | תכנון אולפן B2B",
    metaDescription:
      "ייעוץ אקוסטיקה, תאורה ומפרט ציוד לאולפן פודקאסט — לפי מידות החדר. כולל עריכה ל-10 פרקים ראשונים. החל מ-2,500 ₪.",
    keywords: ["בניית אולפן", "אולפן פודקאסט", "ייעוץ אקוסטיקה", "studio in a box"],
    features: [
      "תכנון אקוסטי לפי מידות החדר",
      "מפרט מיקרופונים, מיקסר, תאורה ומצלמות",
      "העלאת שרטוט / תמונה / קישור Drive",
      "חבילת עריכה ל-10 פרקים ראשונים",
      "ליווי טלפוני בביצוע",
    ],
    processSteps: [
      { number: 1, title: "מידות ותמונה", description: "אורך × רוחב × גובה + תמונה או שרטוט." },
      { number: 2, title: "מפרט AI", description: "רשימת ציוד מדויקת לתקציב ולשימוש." },
      { number: 3, title: "ייעוץ אישי", description: "שיחת וידאו לעדכון והתאמות." },
      { number: 4, title: "10 פרקים", description: "עריכת 10 פרקים ראשונים בחבילה." },
    ],
    faqs: [
      { question: "מה ההבדל מייעוץ אקוסטיקה רגיל?", answer: "Studio In A Box כולל מפרט ציוד מלא, תאורה לוידאו, וחבילת עריכה ל-10 פרקים — מוצר B2B מלא." },
      { question: "איך שולחים שרטוט?", answer: "בוויזארד — קישור Drive, תיאור מילולי, או תמונה קטנה. לא חובה להעלות קובץ לשרת." },
    ],
    closerServiceId: "studio_in_box",
    bookCategoryId: "podcast",
    pricingId: "studio_in_box_consult",
    utmCampaign: "pro_studio_in_box",
    department: "podcast",
    departmentLabel: "פודקאסט B2B",
    icon: "📦",
    wizardTitle: "תכנון אולפן לפי החדר",
    wizardFields: [
      { id: "dimensions", label: "מידות החדר (מ׳)", type: "text", placeholder: "3 × 2.5 × 2.7", required: true },
      { id: "useCase", label: "שימוש עיקרי", type: "select", options: [
        { value: "podcast_audio", label: "פודקאסט אודיו" },
        { value: "podcast_video", label: "פודקאסט וידאו" },
        { value: "stream", label: "שידור חי" },
      ], required: true },
      { id: "budget", label: "תקציב ציוד (₪)", type: "select", options: [
        { value: "5000", label: "עד 5,000" },
        { value: "15000", label: "5,000–15,000" },
        { value: "30000", label: "15,000–30,000" },
        { value: "50000", label: "30,000+" },
      ] },
      { id: "roomNotes", label: "תיאור / קישור לתמונה", type: "textarea", placeholder: "קישור Drive או תיאור החדר" },
    ],
    prompt: {
      system: "אתה יועץ אקוסטיקה ואולפן פודקאסט. הצע מפרט ציוד ותאורה. החזר JSON בלבד.",
      userTemplate: "מידות: {{dimensions}}\nשימוש: {{useCase}}\nתקציב: {{budget}}\nתיאור: {{roomNotes}}",
    },
    whatsappIntro: "שלום, מעוניין/ת ב-Studio In A Box — תכנון אולפן.",
    canonicalNote: "לייעוץ אקוסטיקה כללי ראו גם /academy/home-studio",
  },
  {
    id: "bulk-production",
    slug: "podcast/bulk-production",
    path: "/podcast/bulk-production",
    title: "פס ייצור — Bulk Post-Production",
    subtitle:
      "לחברות וארגונים שמקליטים פודקאסטים: שולחים חומר גולמי, מקבלים פרק ערוך, סאונד מנורמל, פתיח וסגיר קבועים, ו-3 Shorts לרשתות — לכל פרק.",
    metaTitle: "עריכת פודקאסט B2B | פס ייצור ו-Shorts",
    metaDescription:
      "חבילת עריכה לחברות — פרק מוגמר, נורמליזציה, פתיח/סגיר קבועים ו-3 Shorts לפרק. החל מ-950 ₪ לפרק.",
    keywords: ["עריכת פודקאסט B2B", "פס ייצור פודקאסט", "shorts לפודקאסט", "bulk editing"],
    features: [
      "פרק ערוך + loudness תקני",
      "פתיח וסגיר קבועים (ברנדינג)",
      "3 Shorts ערוכים לרשתות לכל פרק",
      "מחירון מדורג לפי נפח חודשי",
      "מנהל פרויקט ייעודי",
    ],
    processSteps: [
      { number: 1, title: "הגדרת פס ייצור", description: "פתיח, סגיר, סגנון עריכה ותבנית Shorts." },
      { number: 2, title: "שליחת חומר", description: "Drive / WeTransfer — כל פרק בתיקייה." },
      { number: 3, title: "עריכה שוטפת", description: "SLA מוסכם — בדרך כלל 3–5 ימי עסקים לפרק." },
      { number: 4, title: "מסירה", description: "פרק + 3 Shorts + גרסת גיבוי." },
    ],
    faqs: [
      { question: "מה המינימום?", answer: "מ-4 פרקים בחודש — או חבילת פיילוט לפרק בודד ב-950 ₪." },
      { question: "האם כולל תמלול?", answer: "תמלול בתוספת תשלום. Shorts נבנים מהקטעים שתסמנו או שנבחר." },
    ],
    closerServiceId: "bulk_podcast",
    bookCategoryId: "podcast",
    pricingId: "bulk_podcast_episode",
    utmCampaign: "pro_bulk_podcast",
    department: "podcast",
    departmentLabel: "פודקאסט B2B",
    icon: "🏭",
    wizardTitle: "הערכת פס ייצור",
    wizardFields: [
      { id: "episodesPerMonth", label: "פרקים בחודש", type: "number", placeholder: "4", required: true },
      { id: "avgDuration", label: "אורך ממוצע (דקות)", type: "number", placeholder: "45" },
      { id: "shortsCount", label: "Shorts לפרק", type: "select", options: [
        { value: "3", label: "3 (כלול)" },
        { value: "5", label: "5 (תוספת)" },
      ] },
      { id: "company", label: "שם החברה / ארגון", type: "text" },
    ],
    prompt: {
      system: "אתה מנהל הפקת פודקאסט B2B. העריך עומס ומחיר חודשי. החזר JSON בלבד.",
      userTemplate: "פרקים/חודש: {{episodesPerMonth}}\nאורך: {{avgDuration}} דק׳\nShorts: {{shortsCount}}\nארגון: {{company}}",
    },
    whatsappIntro: "שלום, מעוניינים בפס ייצור לעריכת פודקאסט.",
    canonicalNote: "לעריכת פרק בודד ראו /podcast/podcast-editing",
  },
  {
    id: "dry-hire",
    slug: "events/equipment/dry-hire",
    path: "/events/equipment/dry-hire",
    title: "השלמת ריידר — Rider Fulfillment",
    subtitle:
      "חברת הגברה קיבלה אירוע אבל חסר מיקסר או סאבים? Dry Hire — השכרת ציוד בלבד, זמינות מלאי בזמן אמת, ללא אנשי צוות.",
    metaTitle: "Dry Hire | השכרת ציוד הגברה",
    metaDescription:
      "השכרת ציוד הגברה ותאורה בלבד — מיקסרים, סאבים, רמקולים. בדיקת זמינות לפי תאריך. לחברות הגברה ופרודקשן.",
    keywords: ["dry hire", "השכרת ציוד הגברה", "rider fulfillment", "השלמת ריידר"],
    features: [
      "מיקסרים, סאבים, רמקולים, תאורה",
      "בדיקת זמינות לפי תאריך",
      "רשימת rider — התאמה אוטומטית לפריטים",
      "איסוף עצמי או משלוח (בתיאום)",
      "ציוד מתוחזק ברמת פרימיום",
    ],
    processSteps: [
      { number: 1, title: "תאריך + rider", description: "בוחרים תאריך ומסמנים ציוד נדרש." },
      { number: 2, title: "זמינות", description: "המערכת בודקת מלאי בזמן אמת." },
      { number: 3, title: "הצעת מחיר", description: "סיכום יומי לפי פריט." },
      { number: 4, title: "איסוף", description: "תיאום איסוף והחזרה." },
    ],
    faqs: [
      { question: "האם כולל טכנאי?", answer: "Dry Hire = ציוד בלבד. טכנאי ושירות בשטח — בנפרד או דרך /events/equipment." },
      { question: "איך מתעדכן המלאי?", answer: "המלאי מתעדכן בזמן אמת לפי הזמנות פעילות. לתאריכים צמודים — אשרו בוואטסאפ." },
    ],
    closerServiceId: "dry_hire",
    bookCategoryId: "singer",
    pricingId: "dry_hire_day",
    utmCampaign: "pro_dry_hire",
    department: "pro-audio",
    departmentLabel: "הגברה",
    icon: "📋",
    wizardTitle: "בדיקת זמינות Dry Hire",
    wizardFields: [
      { id: "eventDate", label: "תאריך אירוע", type: "date", required: true },
      { id: "items", label: "ציוד נדרש", type: "multiselect", options: [
        { value: "mixer_ah_qu", label: "מיקסר Allen & Heath QU" },
        { value: "sub_rcf_15", label: "סאב RCF 15\"" },
        { value: "speaker_rcf_745", label: "זוג RCF 745" },
        { value: "dj_cdj_pair", label: "זוג CDJ 3000" },
        { value: "led_wash", label: "תאורת Wash RGB" },
      ], required: true },
      { id: "riderNotes", label: "פירוט rider / אמן", type: "textarea" },
    ],
    prompt: {
      system: "אתה מנהל מלאי הגברה. סכם זמינות והמלץ על חלופות. החזר JSON בלבד.",
      userTemplate: "תאריך: {{eventDate}}\nפריטים: {{items}}\nRider: {{riderNotes}}",
    },
    whatsappIntro: "שלום, צריך Dry Hire להשלמת rider.",
  },
  {
    id: "system-tuning",
    slug: "events/equipment/system-tuning",
    path: "/events/equipment/system-tuning",
    title: "תכנון קונפיגורציה — EASE / SMAART",
    subtitle:
      "אירוע מורכב? תכנון פריסת רמקולים בתוכנת EASE או מדידות SMAART — כדי שכל הקהל שומע מושלם בלי החזרים מהקירות.",
    metaTitle: "תכנון הגברה EASE SMAART | System Tuning",
    metaDescription:
      "תכנון פריסת רמקולים ב-EASE ומדידות SMAART לאירועים מורכבים. לחברות הגברה קטנות. החל מ-3,500 ₪.",
    keywords: ["EASE", "SMAART", "תכנון הגברה", "פריסת רמקולים", "system tuning"],
    features: [
      "מודל EASE לפי מידות האולם",
      "מדידות SMAART בשטח (אופציונלי)",
      "דוח פריסה + המלצות EQ",
      "ייעוץ לחברות הגברה קטנות",
      "תיאום עם ריידר האמן",
    ],
    processSteps: [
      { number: 1, title: "מידות וסוג אירוע", description: "תוכנית אולם או מידות + סוג קהל." },
      { number: 2, title: "מודל", description: "בניית מודל EASE והצעת פריסה." },
      { number: 3, title: "מדידות", description: "SMAART בשטח לפני האירוע (אם נדרש)." },
      { number: 4, title: "דוח", description: "מסמך פריסה + הגדרות מומלצות." },
    ],
    faqs: [
      { question: "מה צריך לספק?", answer: "מידות אולם, תוכנית או תמונה, סוג אירוע, וריידר אם קיים." },
      { question: "האם אתם מגיעים לשטח?", answer: "תכנון EASE מרחוק. מדידות SMAART — בתיאום ובתוספת נסיעה." },
    ],
    closerServiceId: "system_tuning",
    bookCategoryId: "singer",
    pricingId: "system_tuning_ease",
    utmCampaign: "pro_system_tuning",
    department: "pro-audio",
    departmentLabel: "הגברה",
    icon: "📐",
    wizardTitle: "הצעת תכנון מערכת",
    wizardFields: [
      { id: "venueSize", label: "גודל אולם (אורחים)", type: "select", options: [
        { value: "100", label: "עד 100" },
        { value: "250", label: "100–250" },
        { value: "500", label: "250–500" },
        { value: "1000", label: "500+" },
      ], required: true },
      { id: "eventType", label: "סוג אירוע", type: "select", options: [
        { value: "concert", label: "הופעה / קונצרט" },
        { value: "conference", label: "כנס / הרצאות" },
        { value: "wedding", label: "חתונה" },
        { value: "outdoor", label: "חוץ / פתוח" },
      ], required: true },
      { id: "dimensions", label: "מידות (אופציונלי)", type: "text", placeholder: "20×12×4 מ׳" },
      { id: "needsSmaart", label: "מדידות SMAART בשטח?", type: "select", options: [
        { value: "yes", label: "כן" },
        { value: "no", label: "לא — EASE בלבד" },
      ] },
    ],
    prompt: {
      system: "אתה מהנדס סאונד. הצע פריסת רמקולים ושירות EASE/SMAART. החזר JSON בלבד.",
      userTemplate: "קהל: {{venueSize}}\nסוג: {{eventType}}\nמידות: {{dimensions}}\nSMAART: {{needsSmaart}}",
    },
    whatsappIntro: "שלום, מעוניינים בתכנון הגברה EASE/SMAART.",
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
