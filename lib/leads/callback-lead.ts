/**
 * טופס "נחזור אליכם" (CallbackLeadForm): מה הלקוח ביקש, ומאיזה עמוד.
 *
 * עד עכשיו כל ליד מהטופס יצא עם service=recording בתג [YC:], מקור "/contact"
 * ונושא "ליד חדש - בקשת חזרה", לא משנה מה הלקוח בחר ובאיזה עמוד הוא היה.
 * הטופס יושב בעמוד הבית, בפודקאסט, בדי ג'יי בערים, באונליין ובדופק השוק,
 * ואף אחד מהם לא נמצא ב-/contact. הבעלים קיבל מייל שלא אומר מה הלקוח רוצה.
 *
 * כאן כל אפשרות ברשימה נושאת קטגוריה, והשירות לקלוזר נגזר ממנה דרך
 * BOOK_CLOSER_SERVICE, אותה טבלה שאשפי /book משתמשים בה. בחירה שאינה שירות
 * ("לא בטוח/ה", או תפקיד במנוי דופק השוק) נופלת להקשר של העמוד.
 *
 * מודול טהור בלי תלות בדפדפן, כדי שהבדיקות יריצו אותו כמו שהוא.
 * בכוונה בלי ייבוא של lib/lead-source-registry: הוא מושך את
 * book-audience-routes (כ-23KB) לחבילה של עמוד הבית.
 */
import type { BookCategoryId } from "@/lib/book-url";
import { BOOK_CLOSER_SERVICE } from "@/lib/data/book-closer-map";
import { sanitizeLeadText } from "@/lib/form-validation";
import type { LeadEmailPayload } from "@/lib/lead-email-notify";
import type { ServiceType } from "@/lib/leads/types";
import { buildSimpleLeadMessage } from "@/lib/whatsapp-closing";

export const CALLBACK_LEAD_FORM_ID = "callback_lead_form";

/** השירות בתג [YC:] כשאין שום הקשר. זה גם מה שהרישום ב-lead-source-registry אומר על הטופס. */
export const CALLBACK_FALLBACK_CLOSER_SERVICE = "recording";

/** שורת השירות כשהלקוח לא בחר ואין לעמוד נושא. היה כאן גם קודם. */
export const CALLBACK_NO_SERVICE_LABEL = "פנייה מהאתר";

export type CallbackServiceOption = {
  /** הטקסט שהלקוח רואה ברשימה, וגם הערך שהטופס שומר */
  label: string;
  /** null: בחירה שאינה שירות. אז השירות נלקח מהקשר העמוד */
  category: BookCategoryId | null;
  /** רק כשהקלוזר משתמש במזהה אחר מהמיפוי של הקטגוריה */
  closerServiceId?: string;
};

/** על מה העמוד שבו הטופס יושב */
export type CallbackPageContext = {
  /** נכנס לנושא המייל ולשורת השירות. בלי נושא: רק מה שהלקוח בחר */
  topic?: string | null;
  category?: BookCategoryId | null;
  closerServiceId?: string | null;
};

const UNSURE = "עדיין לא בטוח/ה";

/** עמוד הבית: הרשימה הכללית */
export const CALLBACK_DEFAULT_SERVICE_OPTIONS: readonly CallbackServiceOption[] = [
  { label: "הקלטה באולפן", category: "studio" },
  { label: "פודקאסט", category: "podcast" },
  { label: "אירוע / DJ", category: "dj" },
  /* כמו קוויז יצירת הקשר: קריינות היא service=podcast בקלוזר
     (CONTACT_SERVICE_TO_CLOSER.voice), ובקטגוריה של האתר היא אולפן */
  { label: "קריינות", category: "studio", closerServiceId: "podcast" },
  { label: "וידאו / צילום", category: "photography" },
  { label: UNSURE, category: null },
];

/** עמוד הפודקאסט */
export const CALLBACK_PODCAST_SERVICE_OPTIONS: readonly CallbackServiceOption[] = [
  { label: "הקלטה בלבד באולפן", category: "podcast" },
  { label: "הפקת פודקאסט אודיו מלאה", category: "podcast" },
  { label: "פודקאסט וידאו / פרמיום", category: "podcast" },
  { label: "פודקאסט משפחתי (סבא/סבתא, אירוע)", category: "podcast" },
  { label: "ניקוי הקלטת זום / ביתית", category: "podcast" },
  { label: "אולפן פודקאסט נייד (עד הבית)", category: "podcast" },
  { label: UNSURE, category: null },
];

export const CALLBACK_PODCAST_CONTEXT: CallbackPageContext = {
  topic: "פודקאסט",
  category: "podcast",
};

/** עמודי די ג'יי בערים: הבחירה היא איזה די ג'יי, והשירות תמיד DJ */
export const CALLBACK_DJ_SERVICE_OPTIONS: readonly CallbackServiceOption[] = [
  { label: "יקיר כהן (בוטיק)", category: "dj" },
  { label: "די ג'יי בוגר האקדמיה", category: "dj" },
  { label: UNSURE, category: null },
];

export function callbackDjCityContext(cityNameHePrep: string): CallbackPageContext {
  return { topic: `DJ לאירועים ${cityNameHePrep}`, category: "dj" };
}

/** עמוד האונליין הראשי: כל האפשרויות הן שירות אונליין (service=online_ai) */
export const CALLBACK_ONLINE_HUB_SERVICE_OPTIONS: readonly CallbackServiceOption[] = [
  { label: "אודיו ומוזיקה", category: "online" },
  { label: "פודקאסט וקריינות", category: "online" },
  { label: "וידאו ותוכן", category: "online" },
  { label: "תמונה ועיצוב AI", category: "online" },
  { label: "התאמה אישית", category: "online" },
];

export const CALLBACK_ONLINE_HUB_CONTEXT: CallbackPageContext = {
  topic: "שירותי אונליין",
  category: "online",
};

/** עמוד קטגוריה באונליין */
export function callbackOnlineCategoryOptions(
  categoryTitle: string,
): readonly CallbackServiceOption[] {
  return [
    { label: categoryTitle, category: "online" },
    { label: "התאמה אישית", category: "online" },
    { label: "לא בטוח/ה עדיין", category: null },
  ];
}

export function callbackOnlineCategoryContext(categoryTitle: string): CallbackPageContext {
  return { topic: categoryTitle, category: "online" };
}

/**
 * דופק השוק: הלקוח בוחר תפקיד, לא שירות. בלי קטגוריה השרת ממשיך לגזור את
 * סוג הליד מה-formId כמו קודם, והקלוזר מקבל recording כמו ברישום.
 */
export const CALLBACK_EVENT_INDEX_OPTIONS: readonly CallbackServiceOption[] = [
  { label: "ספק אירועים / דיג'יי", category: null },
  { label: "חברת הגברה", category: null },
  { label: "מפיק או מפיקה", category: null },
  { label: "אחר", category: null },
];

export const CALLBACK_EVENT_INDEX_CONTEXT: CallbackPageContext = {
  topic: "מנוי דופק השוק",
  category: null,
};

/** הקטגוריות של /book וסוגי הליד בשרת זהים, חוץ מ-pro שבשרת נקרא business */
export function serviceTypeForBookCategory(category: BookCategoryId): ServiceType {
  return category === "pro" ? "business" : category;
}

export type ResolvedCallbackService = {
  /** שורת "שירות:" בהודעה, ונושא המייל */
  label: string;
  closerServiceId: string;
  /** undefined: השרת גוזר מה-formId, כמו לפני התיקון */
  serviceType?: ServiceType;
};

/**
 * מה הלקוח ביקש. הערך מהטופס נבדק מול הרשימה עצמה, כך שטקסט חופשי לא
 * נכנס לנושא או לתג.
 */
export function resolveCallbackService(
  selectedLabel: string,
  options: readonly CallbackServiceOption[],
  context: CallbackPageContext = {},
): ResolvedCallbackService {
  const picked = selectedLabel
    ? options.find((o) => o.label === selectedLabel)
    : undefined;
  const topic = context.topic?.trim() || "";

  const category = picked?.category ?? context.category ?? null;
  const closerServiceId =
    picked?.closerServiceId ||
    (picked?.category ? BOOK_CLOSER_SERVICE[picked.category] : "") ||
    context.closerServiceId?.trim() ||
    (context.category ? BOOK_CLOSER_SERVICE[context.category] : "") ||
    CALLBACK_FALLBACK_CLOSER_SERVICE;

  let label: string;
  if (picked && topic && picked.label !== topic) label = `${topic}, ${picked.label}`;
  else label = picked?.label || topic || CALLBACK_NO_SERVICE_LABEL;

  return {
    label,
    closerServiceId,
    serviceType: category ? serviceTypeForBookCategory(category) : undefined,
  };
}

/**
 * הנתיב שממנו נשלח הטופס, לשורת "מקור:" ולתג [YC:]. רק תווים של נתיב:
 * | ו-] היו שוברים את התג. בלי נתיב תקין: null, והתג כותב "website".
 */
export function normalizeCallbackSource(path: string | null | undefined): string | null {
  const raw = path?.trim() ?? "";
  if (!raw.startsWith("/")) return null;
  const clean = raw.replace(/[^A-Za-z0-9/_.%~-]/g, "").slice(0, 120);
  return clean || null;
}

export type CallbackLeadInput = {
  formId?: string;
  name: string;
  /** הטלפון כפי שמוצג (אחרי formatPhoneForDisplay) */
  phone: string;
  selectedService: string;
  customerNeed?: string;
  options: readonly CallbackServiceOption[];
  context?: CallbackPageContext;
  /** הנתיב של העמוד בדפדפן, או source מפורש מהעמוד */
  sourcePath?: string | null;
  honeypot?: string;
};

export type CallbackLead = {
  payload: LeadEmailPayload;
  /** אותו גוף, לקישור הוואטסאפ האופציונלי במסך ההצלחה */
  body: string;
  service: ResolvedCallbackService;
  source: string | null;
};

/** בונה את הליד ששולחים ל-/api/lead-notify. השרת עדיין בודק הכל בעצמו. */
export function buildCallbackLead(input: CallbackLeadInput): CallbackLead {
  const formId = input.formId || CALLBACK_LEAD_FORM_ID;
  const service = resolveCallbackService(
    input.selectedService,
    input.options,
    input.context,
  );
  const source = normalizeCallbackSource(input.sourcePath);
  const name = sanitizeLeadText(input.name, 60);
  const phone = input.phone.trim();
  const need = input.customerNeed?.trim()
    ? sanitizeLeadText(input.customerNeed, 500)
    : null;

  const body = buildSimpleLeadMessage({
    contact: { name, phone },
    serviceLabel: service.label,
    customerNeed: need,
    source,
    closerServiceId: service.closerServiceId,
    ycForm: formId,
  });

  return {
    body,
    service,
    source,
    payload: {
      formId,
      /* השרת מוסיף לפני זה "[שיחה חוזרת] " ו-"[יקיר כהן] " (lib/leads/ingest.ts) */
      subject: `ליד חדש - ${service.label}`,
      body,
      website_verification: input.honeypot ?? "",
      name,
      phone,
      contactChannel: "callback",
      ...(service.serviceType ? { serviceType: service.serviceType } : {}),
    },
  };
}
