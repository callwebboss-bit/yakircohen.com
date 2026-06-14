import {
  formatNis,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "./pricing";
import { getExVat } from "./pricing-catalog";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "./youtube-embeds";

/** ─── Core types (AI-readable service registry) ─── */

export type ServiceFaq = {
  id: string;
  question: string;
  answer: string;
};

export type ServicePricingTier = {
  name: string;
  price: string;
  /** לפני מע״מ - להצגה כפולה ולהודעות WhatsApp */
  priceExVat?: number;
  priceNote?: string;
  description: string;
  /** Highlight this tier visually (upsell / most popular) */
  featured?: boolean;
  /** Short badge label shown above the card */
  badge?: string;
};

export type ServiceMediaType = "audio" | "video" | "gallery" | "none";

export type ServiceCategory =
  | "studio"
  | "podcast"
  | "voiceover"
  | "events"
  | "video"
  | "photography";

export type ServiceEntity = {
  /** Stable registry key, e.g. `studio-recording-song-modiin` */
  id: string;
  /** Relative URI without leading slash: `studio/recording-song-modiin` */
  slug: string;
  category: ServiceCategory;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  features: readonly string[];
  /** Folder under `public/images/services/` (English path segments) */
  assetsFolder: string;
  playlistEmbedUrl?: string | null;
  mediaType: ServiceMediaType;
  whatsappText: string;
  utmCampaign: string;
  faqs: readonly ServiceFaq[];
  /** Optional transparent pricing tiers for attraction and studio pages */
  pricing?: readonly ServicePricingTier[];
  /** Hub navigation card copy (when listed on category hub) */
  hubCard?: {
    title: string;
    description: string;
  } | null;
  showInStudioHub?: boolean;
  showInVoiceoverHub?: boolean;
  showInEventsHub?: boolean;
  showInAttractionsHub?: boolean;
  showInVideoHub?: boolean;
  showInPhotographyHub?: boolean;
  /** Soft scarcity cue for high-demand seasonal services */
  scarcityLabel?: string;
};

export type PricingTier = {
  id: string;
  name: string;
  price: string;
  /** לתצוגת מע״מ - מספר לפני מע״מ */
  priceExVat?: number;
  priceNote?: string;
  description: string;
  highlights: readonly string[];
  whatsappText: string;
  utmCampaign: string;
  featured?: boolean;
};

export type StudioPricingConfig = {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  keywords: readonly string[];
  title: string;
  subtitle: string;
  features: readonly string[];
  tiers: readonly PricingTier[];
};

/** Base path for all service imagery */
export const SERVICE_IMAGES_BASE = "/images/services";

export function serviceImageBasePath(assetsFolder: string): string {
  return `${SERVICE_IMAGES_BASE}/${assetsFolder.replace(/^\/+/, "")}`;
}

/** ─── Studio & Blessings registry ─── */

export const STUDIO_SERVICES = {
  "studio-hub": {
    id: "studio-hub",
    slug: "studio",
    category: "studio",
    title: "אולפן הקלטות וברכות במודיעין",
    subtitle:
      "אולפן שקט להקלטת שירים, ברכות וקליפים. עוזרים לכם שלב שלב עד לקובץ מוכן.",
    metaTitle: "אולפן הקלטות וברכות במודיעין",
    metaDescription:
      "אולפן הקלטות וברכות במודיעין. שירים במתנה, ברכות, קליפים ומיקס - גם מירושלים והמרכז.",
    keywords: [
      "אולפן הקלטות",
      "סטודיו מודיעין",
      "הקלטת שיר",
      "ברכות לאירועים",
    ],
    features: [
      "חדר הקלטה שקט במודיעין",
      "מיקרופונים וציוד מקצועי",
      "עריכה ומיקס עד לקובץ מוכן",
      "ליווי בזמן ההקלטה",
      "חנייה נוחה, נגיש מירושלים והמרכז",
    ],
    assetsFolder: "studio/hub",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["studio-hub"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין לשמוע על שירותי האולפן והברכות",
    utmCampaign: "studio_hub",
    faqs: [],
    hubCard: null,
    showInStudioHub: false,
  },

  "studio-recording-studio": {
    id: "studio-recording-studio",
    slug: "studio/recording-studio",
    category: "studio",
    title: "אולפן הקלטות במודיעין",
    subtitle:
      "הסטנדרט שמגדיר את התעשייה  -  20 שנות ניסיון, הפקה ב-Cubase, שילוב Suno AI ומתודולוגיה שמייצרת תוצאות ברמה ארצית, כאן במודיעין.",
    metaTitle: "אולפן הקלטות במודיעין",
    metaDescription:
      "אולפן הקלטות מקצועי במודיעין. Cubase, AI, ציוד Neumann ו-Apollo - מעל 2,000 לקוחות מהאזור.",
    keywords: [
      "אולפן הקלטות מודיעין",
      "סטודיו הקלטות",
      "הפקה מוזיקלית מודיעין",
      "Cubase",
      "אולפן מקצועי",
    ],
    features: [
      "20 שנות ניסיון בהפקה מוזיקלית וטלוויזיה",
      "Cubase + Suno AI + Melodyne ומיקס ברמת ספוטיפיי",
      "מיקרופוני Neumann, ממירי Apollo ואקוסטיקה מחושבת",
      "מיקום במרכז מודיעין  -  חניה ונגישות מהשפלה ורעות",
      "שירים, פודקאסטים, מנטורינג ושירותי אונליין",
    ],
    assetsFolder: "studio/hub",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["studio-recording-studio"],
    ),
    mediaType: "video",
    whatsappText:
      "שלום, אשמח לתאם סיור באולפן או סשן הקלטה במודיעין",
    utmCampaign: "studio_recording",
    faqs: [
      {
        id: "modiin-vs-ta",
        question: "למה אולפן במודיעין ולא בתל אביב?",
        answer:
          "אותו ציוד, ניסיון ותוצאות כמו במרכז  -  עם יחס אישי, חניה בשפע וגישה נוחה לתושבי מודיעין והסביבה, בלי פקקי גוש דן.",
      },
      {
        id: "ai",
        question: "איך משלבים Suno AI בהפקה?",
        answer:
          "AI ככלי לסקיצות, הרמוניות ופלייבקים  -  לא מחליף את האמן, נותן כנפיים ותוצאות עשירות בזמן קצר.",
      },
      {
        id: "pro-amateur",
        question: "מתאים לזמרים מקצועיים וגם לחובבים?",
        answer:
          "בהחלט. מתודולוגיה שמקדמת זמר מקצועי ומרגיעה מי שמקליט בפעם הראשונה  -  התוצאה תמיד מלוטשת.",
      },
      {
        id: "gear",
        question: "באילו תוכנות וציוד אתם משתמשים?",
        answer:
          "Cubase, פלאגינים מהשורה הראשונה וציוד אקוסטי קצה  -  סאונד נקי, חם ועוצמתי לכל פלטפורמה.",
      },
      {
        id: "process",
        question: "מה כולל תהליך ההפקה?",
        answer:
          "ייעוץ מוזיקלי, הקלטה עם הדרכה, עריכה דיגיטלית, מיקס ומאסטרינג  -  לא משחררים שיר עד שעומד בסטנדרט שלנו.",
      },
    ],
    hubCard: {
      title: "אולפן הקלטות במודיעין",
      description: "20 שנות ניסיון, Cubase ו-AI  -  סיור וידאו באתר.",
    },
    showInStudioHub: true,
  },

  "recording-song-modiin": {
    id: "recording-song-modiin",
    slug: "studio/recording-song-modiin",
    category: "studio",
    title: "הקלטת שיר באולפן במודיעין",
    subtitle: "חוויה של פעם בחיים. סאונד מרגש מהרגע הראשון.",
    metaTitle:
      "הקלטת שיר באולפן במודיעין | שיר לבר מצווה ולחתונה",
    metaDescription:
      "הקלטת שירים ומתנות באולפן במודיעין. שיר לבר מצווה, חתונה וכניסה לחופה - ליווי אישי ומסירה תוך 48 שעות.",
    keywords: [
      "הקלטת שיר מודיעין",
      "הקלטת שיר לבר מצווה",
      "הקלטת שיר לחתונה",
      "כניסה לחופה",
      "אולפן הקלטות מודיעין",
      "שיר מתנה",
      "הפקה מוזיקלית",
      "הקלטת ווקאל",
      "שיר לחברה",
      "שיר פרישה",
    ],
    features: [
      "ליווי אישי גם ללא שום ניסיון שירה",
      "AI לתיקון זיופים - קול טבעי ומרגש",
      "מיקרופוני SM7B ו-SphereL22 כמו בסטודיו בינלאומי",
      "מסירה תוך 48 שעות ב-WAV ו-MP3",
      "מעל 500 משפחות ממודיעין, מכבים ורעות",
    ],
    pricing: [
      {
        name: "הקלטת ברכה / אמירה",
        price: "החל מ-590 ₪",
        description:
          "הקלטת ברכה, דרשה קצרה או אמירה מרגשת. עד 30 דקות באולפן עם ליווי טכני מלא. ✓ כולל עריכת סאונד - ✓ כולל מע״מ",
      },
      {
        name: "הקלטת שיר (קאבר)",
        price: "החל מ-1,200 ₪",
        description:
          "הקלטה על פלייבק קיים עם ליווי מלא. ✓ כולל עריכת סאונד מלאה - ✓ כולל תיקון זיופים ב-AI - ✓ כולל מע״מ",
      },
      {
        name: "שיר מתנה אישי",
        price: "החל מ-1,800 ₪",
        description:
          "שיר מקורי עם ליווי מוזיקלי מלא. ✓ כולל פלייבק / עיבוד - ✓ כולל עריכת סאונד מלאה - ✓ כולל מע״מ",
      },
      {
        name: "הפקה מלאה + קליפ וידאו",
        price: "החל מ-4,500 ₪",
        description:
          "שיר מוגמר + קליפ וידאו לשיתוף. ✓ כולל כתיבה ועיבוד - ✓ כולל מיקס ועריכת וידאו - ✓ כולל מע״מ",
        featured: true,
        badge: "הכי משתלם",
      },
    ],
    assetsFolder: "studio/recording-song-modiin",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["recording-song-modiin"],
    ),
    mediaType: "video",
    whatsappText: "שלום, מעוניין להקליט שיר באולפן במודיעין",
    utmCampaign: "studio_recording_modiin",
    faqs: [
      {
        id: "booking-advance",
        question:
          "כמה זמן מראש כדאי להזמין סשן של הקלטת שיר לבר מצווה או חתונה?",
        answer:
          "מומלץ לשריין מקום כ-3 עד 4 שבועות לפני האירוע כדי להבטיח זמינות באולפן ולתת לנו זמן עריכה רגוע. בעונות שיא - חגים וסמסטר האירועים - הזמינות מתמלאת מהר. נזכרתם מאוחר? אל דאגה - האולפן ערוך להפקות אקספרס מלוטשות גם תוך 48 שעות.",
      },
      {
        id: "not-singers",
        question: "אנחנו לא זמרים ומפחדים לזייף. האם השיר ייצא טוב?",
        answer:
          "לחלוטין. האולפן מצויד בטכנולוגיית פיץ׳ קורקשן ותיקון זיופים מתקדם. הליווי המקצועי יגרום לכם להישמע במיטבכם - הטכנולוגיה מוציאה את הגרסה הכי טובה, נקייה ומחמיאה של הקול הטבעי שלכם, מבלי להפוך אתכם לרובוטים. מעל 90% מהלקוחות מגיעים ללא ניסיון שירה.",
      },
      {
        id: "group-session",
        question:
          "האם אפשר להגיע להקלטה יחד עם ההורים, האחים או חברים?",
        answer:
          "כן. הקלטת שיר משפחתי או שיר קבוצתי היא חוויה מגבשת ומדהימה. אנחנו מקליטים בקבוצות קטנות ומאחדים הכל לסאונד עשיר. לקבוצות גדולות יותר נארגן כמה סשנים קצרים ונחבר לקטע אחד מרגש - שיר שכל אחד שר שורה.",
      },
      {
        id: "pricing-factors",
        question:
          "מה משפיע על הקלטת שיר לבר מצווה מחיר ועלות השיר לחתונה?",
        answer:
          "המחיר נקבע לפי מורכבות ההפקה - האם מדובר בשירה על פלייבק קיים עם תיקון קול, או בהפקה מוזיקלית מורכבת הכוללת כתיבת מילים מקוריות, עיבוד מוזיקלי ועריכה מלאה. ראו מחירון שקוף בעמוד זה, ופנו אלינו לקבלת הצעה מדויקת.",
      },
      {
        id: "send-text",
        question:
          "איך שולחים את הטקסט או הרעיון שלנו לפני שמגיעים לאולפן?",
        answer:
          "הכל קורה בקלות דרך הוואטסאפ. שולחים את המילים או הלחן שחשבתם עליו, ואנחנו מכינים את הפלייבק המדויק עבורכם מראש. אין צורך להגיע מוכנים לחלוטין - אנחנו עוזרים לגבש את הרעיון ולבנות תוכנית ברורה.",
      },
      {
        id: "physical-studio",
        question:
          "האם צריך להגיע פיזית לאולפן מודיעין בשביל כל התהליך?",
        answer:
          "ההקלטה עצמה נעשית באולפן האקוסטי במודיעין לחוויית סאונד מושלמת. תיאומים, שליחת טקסטים ואישורי סקיצות נעשים אונליין בנוחות מלאה. לתושבי מכבים ורעות - נסיעה של כ-15 דקות בלבד.",
      },
      {
        id: "video-clip",
        question: "האם יש אפשרות לשלב גם הפקת קליפ וידאו באולפן?",
        answer:
          "בוודאי. ניתן לתאם צילום וידאו מקצועי באולפן במהלך ההקלטה, ליצירת קליפ מרגש ומזכרת ויזואלית עוצמתית - מושלם להקרנה במסכים באולם האירועים.",
      },
    ],
    hubCard: {
      title: "הקלטת שירים במודיעין",
      description: "מהרעיון ועד שיר מוגמר  -  אולפן, AI ומיקס מקצועי.",
    },
    showInStudioHub: true,
  },

  "studio-jerusalem": {
    id: "studio-jerusalem",
    slug: "studio/studio-jerusalem",
    category: "studio",
    title: "אולפן הקלטות לירושלמים  -  במודיעין",
    subtitle:
      "חולמים להקליט שיר? אולפן מקצועי במרחק 30 דקות מירושלים  -  שירים, ברכות וקליפים. ירושלמי במקור, מבין את הקהל הירושלמי והדתי.",
    metaTitle: "אולפן הקלטות בירושלים | 30 דק׳ ממודיעין",
    metaDescription:
      "אולפן הקלטות בירושלים - 30 דק׳ ממודיעין. שירים לחופה, ברכות ודרשות עם ליווי אישי.",
    keywords: [
      "אולפן הקלטות ירושלים",
      "הקלטת שיר ירושלים",
      "אולפן מודיעין ירושלים",
      "שיר לחופה ירושלים",
    ],
    features: [
      "כ-30 דקות נסיעה ממרכז ירושלים (כביש 1)",
      "ליווי אישי גם ללא ניסיון שירה",
      "מתאים לקהל דתי  -  יחס מכבד ותוכן כשר",
      "שירים, ברכות, דרשות וקליפים",
      "אפשרות לאולפן נייד עד ירושלים",
    ],
    assetsFolder: "studio/jerusalem",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["studio-jerusalem"],
    ),
    mediaType: "video",
    whatsappText: "שלום, מגיע מירושלים ומעוניין לתאם הקלטה באולפן",
    utmCampaign: "studio_jerusalem",
    faqs: [
      {
        id: "location",
        question: "האם האולפן נמצא בירושלים?",
        answer:
          "האולפן במודיעין, כ-30 דקות ממרכז ירושלים. אפשר גם להזמין אולפן נייד עד ירושלים בתיאום מראש.",
      },
      {
        id: "experience",
        question: "האם צריך ניסיון בשירה?",
        answer:
          "ממש לא. רוב הלקוחות חובבים  -  מלווים צעד-צעד עד תוצאה מקצועית.",
      },
      {
        id: "pricing",
        question: "כמה עולה להקליט שיר?",
        answer:
          "יש מסלולים שונים באתר  -  מומלץ לא להתפשר על הקלטה של פעם בחיים, אבל נתאים חבילה לתקציב. ראו מחירון ודפי השירותים.",
      },
      {
        id: "playback",
        question: "כמה עולה פלייבק? האם צריך להשיג?",
        answer:
          "פלייבק קיים ברשת  -  ללא עלות. עיבוד מחדש לפי כמות הכלים (פסנתר, תופים, גיטרה וכו׳).",
      },
      {
        id: "delivery",
        question: "איך מקבלים את הקובץ?",
        answer: "וואטסאפ, מייל או USB מעוצב (בתוספת תשלום סמלי).",
      },
      {
        id: "religious",
        question: "האם יש התאמה לקהל דתי?",
        answer:
          "בהחלט  -  יחס מכבד, תוכן כשר והתאמה לאירועים משפחתיים וקהילתיים.",
      },
      {
        id: "special-needs",
        question: "גישה לילדים עם צרכים מיוחדים?",
        answer:
          "עבודה מותאמת עם ילדים בעלי מוגבלויות  -  ניסיון רב וסבלנות מלאה.",
      },
    ],
    hubCard: {
      title: "אולפן לירושלים והסביבה",
      description: "30 דק׳ מירושלים  -  שירים, ברכות וקליפים.",
    },
    showInStudioHub: true,
  },

  "studio-mobile-studio": {
    id: "studio-mobile-studio",
    slug: "studio/mobile-studio",
    category: "studio",
    title: "אולפן הקלטות מקצועי - שמגיע עד אליכם",
    subtitle:
      "חוסכים נסיעות: אנחנו מביאים ציוד, אקוסטיקה ומפיק מקצועי הביתה, למשרד או למוסד. הקלטת שירים וקליפים בסטנדרט גבוה - במקום שבו אתם הכי בבית.",
    metaTitle: "אולפן הקלטות נייד | מגיע עד הבית",
    metaDescription:
      "אולפן הקלטות נייד - מגיע לכל הארץ. פנלים אקוסטיים, מיקרופונים ומפיק צמוד.",
    keywords: [
      "אולפן נייד",
      "אולפן הקלטות נייד",
      "הקלטת שיר בבית",
      "אולפן מגיע עד הבית",
      "הקלטה בבית ספר",
    ],
    features: [
      "הקמה תוך פחות מ-30 דקות בכל חדר שקט",
      "פנלים אקוסטיים, Shields ומיקרופונים מהשורה הראשונה",
      "מפיק מוזיקלי צמוד לאורך ההקלטה",
      "אותה איכות סאונד כמו באולפן הקבוע במודיעין",
      "אפשרות להוסיף צילום קליפ מקצועי",
    ],
    assetsFolder: "studio/hub",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["studio-mobile-studio"],
    ),
    mediaType: "video",
    whatsappText:
      "שלום, אשמח לקבל פרטים על אולפן הקלטות נייד - תאריך ומיקום",
    utmCampaign: "studio_mobile",
    faqs: [
      {
        id: "what-is",
        question: "מה זה אולפן נייד?",
        answer:
          "אולפן הקלטות נייד מלא שמגיע עד אליכם - מחשב, כרטיס קול, מיקרופון, אוזניות, ציוד נלווה ואיש מקצוע שליווה אתכם. להקליט שיר או קליפ בלי לצאת מהבית, באיכות אולפן אמיתי.",
      },
      {
        id: "room",
        question: "צריך חדר מיוחד?",
        answer:
          "ממש לא. כל סלון, חדר עבודה או כיתה הופכים לחלל הקלטה אקוסטי תוך דקות עם הציוד הנייד שלנו.",
      },
      {
        id: "quality",
        question: "האם האיכות פחותה מאולפן רגיל?",
        answer:
          "חד משמעית לא. אותו ציוד כמו באולפן הקבוע - ההבדל היחיד הוא המיקום.",
      },
      {
        id: "areas",
        question: "לאילו אזורים מגיעים?",
        answer:
          "לכל חלקי הארץ בתיאום מראש. פנו בוואטסאפ לוודא זמינות בתאריך ובאזור שלכם.",
      },
      {
        id: "clip",
        question: "רוצים גם קליפ?",
        answer:
          "כן - אפשר להוסיף צילום DSLR מסונכרן לשיר, בבית, בחצר או בלוקיישן שתבחרו. יש גם אפשרות לערוך קליפ מחומר שצילמתם בסמארטפון.",
      },
      {
        id: "corporate-office",
        question: "האם מגיעים למשרדי חברה?",
        answer:
          "כן. לחברות יש שירות נפרד: אולפן זמני בחדר ישיבות, יום צילום במשרד. פרטים בעמוד אולפן זמני בחברה.",
      },
    ],
    hubCard: {
      title: "אולפן נייד עד הבית",
      description: "ציוד, אקוסטיקה ומפיק - בלי נסיעות.",
    },
    showInStudioHub: true,
  },

  "blessings-hub": {
    id: "blessings-hub",
    slug: "studio/blessings",
    category: "studio",
    title: "הקלטת ברכות מרגשות  -  באולפן או מהבית",
    subtitle:
      "הפכו את הברכה לרגע מושלם: הקלטה מקצועית, מוזיקת רקע מרגשת ועריכה שתגרום לכולם להתרגש. רגועים מול המיקרופון  -  והקהל שומע ברכה שנשמעת מושלמת.",
    metaTitle: "הקלטת ברכות מרגשות | אולפן במודיעין",
    metaDescription:
      "הקלטת ברכות באולפן במודיעין. דרשה, בר/בת מצווה וחתן וכלה - ליווי ועריכה מלאה.",
    keywords: [
      "הקלטת ברכה",
      "ברכות חתן כלה",
      "דרשה מוקלטת",
      "ברכות בר מצווה",
      "ברכה מהבית",
      "שיר במתנה",
    ],
    features: [
      "הקלטה באולפן במודיעין או מהבית בסמארטפון",
      "ליווי מקצועי בהגייה, קצב ואינטונציה",
      "עריכה, תיקון זיופים ב-AI וניקוי רעשים",
      "מוזיקת רקע מרגשת ומיקס מוכן לאירוע",
      "מסירה תוך 24-48 שעות",
    ],
    assetsFolder: "studio/blessings/bride-groom-blessing",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["blessings-hub"],
    ),
    mediaType: "video",
    whatsappText:
      "שלום, מעוניין להקליט ברכה  -  אשמח לתאם אולפן או הנחיות להקלטה מהבית",
    utmCampaign: "blessings_hub",
    faqs: [
      {
        id: "duration",
        question: "כמה זמן לוקח להקליט ברכה?",
        answer:
          "ברכה קצרה (2-3 דקות): כ-30 דקות באולפן. ברכה ארוכה או דרשה (5-10 דקות): כשעה באולפן.",
      },
      {
        id: "group",
        question: "אפשר להקליט כמה אנשים ביחד?",
        answer:
          "בהחלט. באולפן  -  כמה מברכים שתרצו. בהקלטה מהבית  -  עד 5 מברכים בחבילה אחת.",
      },
      {
        id: "studio-vs-home",
        question: "מתלבטים בין אולפן להקלטה מהבית?",
        answer:
          "אולפן  -  לאיכות הגבוהה ביותר וליווי מלא. מהבית  -  לנוחות ובזמן שלכם. שתי האופציות מגיעות לתוצאה מקצועית ומרגשת.",
      },
      {
        id: "delivery",
        question: "כמה זמן לוקח לקבל את הקובץ המוגמר?",
        answer:
          "הקלטה באולפן: עד 24 שעות. מהבית: 24-48 שעות אחרי שליחת ההקלטה.",
      },
    ],
    hubCard: {
      title: "ברכות ושירים במתנה",
      description: "באולפן או מהבית  -  עד ברכה מושלמת.",
    },
    showInStudioHub: true,
  },

  "blessings-bar-mitzvah": {
    id: "blessings-bar-mitzvah",
    slug: "studio/blessings/bar-mitzvah",
    category: "studio",
    title: "דרשות וברכות לבר/בת מצווה",
    subtitle:
      "רגע שמחכה לזיכרון לכל החיים - ברכות מהלב, דרשות מדויקות והקלטה שמכבדת את הילד/ה ואת המשפחה. אנחנו מסייעים בניסוח, בהנחיה ובהפקה עד לקובץ מוכן להשמעה באירוע.",
    metaTitle: "ברכות ודרשות לבר/בת מצווה באולפן",
    metaDescription:
      "ברכות ודרשות לבר/בת מצווה במודיעין. ניסוח מלווה, הקלטה שקטה ומוזיקה - לכל הארץ.",
    keywords: ["ברכות בר מצווה", "דרשה בר מצווה", "הקלטת ברכה לאירוע"],
    features: [
      "עזרה בניסוח ברכה אישית, מכובדת ומדויקת לגיל",
      "הקלטה רגועה שמאפשרת ביטוי טבעי מול המיקרופון",
      "עריכה נקייה עם מוזיקת רקע עדינה לפי אופי האירוע",
      "מסירה בפורמט מוכן להשמעה בטקס או במסיבה",
      "אפשרות להוסיף וידאו או קליפ משלים",
    ],
    assetsFolder: "studio/blessings/bar-mitzvah",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["blessings-bar-mitzvah"],
    ),
    mediaType: "gallery",
    whatsappText: "שלום, מעוניין בברכה או דרשה לבר/בת מצווה",
    utmCampaign: "blessings_bar_mitzvah",
    faqs: [
      {
        id: "timing",
        question: "מתי כדאי להקליט לפני האירוע?",
        answer:
          "מומלץ להקליט 2-4 שבועות לפני האירוע, כדי לאפשר עריכה רגועה ותיקונים במידת הצורך.",
      },
    ],
    hubCard: {
      title: "בר/בת מצווה",
      description: "דרשות וברכות מהלב עם הפקה מלאה.",
    },
    showInStudioHub: false,
  },

  "blessings-bride-groom": {
    id: "blessings-bride-groom",
    slug: "studio/blessings/bride-groom-blessing",
    category: "studio",
    title: "ברכת כלה וחתן מרגשת",
    subtitle:
      "ברכה שמחברת בין דורות ונוגעת בלב - הקלטה אינטימית באולפן, ניסוח מדויק ועריכה שמעניקה למילים את המקום שמגיע להן ביום הגדול.",
    metaTitle: "ברכת חתן וכלה מקצועית באולפן",
    metaDescription:
      "ברכת חתן וכלה באולפן במודיעין. ליווי בניסוח, הקלטה שקטה ומיקס - מתנה משפחתית.",
    keywords: ["ברכת חתן כלה", "ברכה לחתונה", "הקלטת ברכה באולפן"],
    features: [
      "ליווי בכתיבה ובעריכת הטקס לרגש מאוזן ולא מוגזם",
      "הקלטה באווירה פרטית שמאפשרת אמיתיות",
      "שילוב מוזיקה רגשית בהתאם לסגנון החתונה",
      "מסירה מהירה לפני יום האירוע",
      "אפשרות לשלב קליפ וידאו עם ההקלטה",
    ],
    assetsFolder: "studio/blessings/bride-groom-blessing",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["blessings-bride-groom"],
    ),
    mediaType: "gallery",
    whatsappText: "שלום, מעוניין בברכת חתן/כלה מוקלטת באולפן",
    utmCampaign: "blessings_bride_groom",
    faqs: [],
    hubCard: {
      title: "ברכת חתן וכלה",
      description: "ברכה מרגשת מוקלטת ומלוטשת ליום החתונה.",
    },
    showInStudioHub: false,
  },

  "blessings-video-clip": {
    id: "blessings-video-clip",
    slug: "studio/blessings/video-clip",
    category: "studio",
    title: "הקלטת שיר וצילום קליפ באולפן",
    subtitle:
      "חוויה אחת שמשלבת סאונד ותמונה - הקלטה ווקאלית באיכות אולפן, צילום מוקפד ועריכה שיוצרת קליפ מרגש למשפחה, לרשת או לאירוע החגיגי.",
    metaTitle: "הקלטת שיר וצילום קליפ באולפן",
    metaDescription:
      "קליפ שיר באולפן במודיעין. הקלטה, צילום ועריכה - חבילה לשירי מתנה וברכות.",
    keywords: ["הקלטת קליפ", "צילום קליפ באולפן", "שיר וקליפ במתנה"],
    features: [
      "תכנון יום צילום והקלטה משולב באולפן",
      "הקלטת ווקאל מקצועי + בסיס מוזיקלי מותאם",
      "צילום מול רקע נקי ותאורה מקצועית",
      "עריכת וידאו וסאונד לקובץ מסירה אחד מלוטש",
      "פורמטים מוכנים לרשתות חברתיות ולהצגה באירוע",
    ],
    assetsFolder: "studio/blessings/video-clip",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["blessings-video-clip"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בהקלטת שיר וצילום קליפ באולפן",
    utmCampaign: "blessings_video_clip",
    faqs: [
      {
        id: "package",
        question: "האם אפשר רק הקלטה ללא צילום?",
        answer:
          "כן. ניתן להזמין הקלטת שיר בלבד, או חבילה משולבת עם צילום ועריכת קליפ.",
      },
    ],
    hubCard: {
      title: "שיר + קליפ באולפן",
      description: "הפקה משולבת של סאונד ווידאו במקום אחד.",
    },
    showInStudioHub: false,
  },
} as const satisfies Record<string, ServiceEntity>;

export type StudioServiceId = keyof typeof STUDIO_SERVICES;

export const STUDIO_PRICING: StudioPricingConfig = {
  metaTitle: "מחירון חבילות אולפן הקלטות",
  metaDescription:
    "מחירון שקוף לאולפן במודיעין - שעת הקלטה, חבילת שיר במתנה והפקת סינגל מלא. הזמנה מהירה בוואטסאפ.",
  slug: "studio/pricing",
  keywords: ["מחירון אולפן", "מחיר הקלטת שיר", "חבילת אולפן מודיעין"],
  title: "מחירון חבילות אולפן",
  subtitle:
    "שקיפות מלאה, בלי הפתעות - בחרו את החבילה שמתאימה לפרויקט שלכם וקבלו הצעה מיידית בוואטסאפ. המחירים לפני מע״מ (+18%).",
  features: [
    "תמחור ברור לפי סוג הפרויקט",
    "אפשרות לשדרוגים: עריכה, מוזיקה, קליפ וידאו",
    "תיאום גמיש לשעות ערב וסופי שבוע",
  ],
  tiers: [
    {
      id: "half-hour",
      name: "חצי שעה באולפן",
      price: formatNis(STUDIO_HALF_HOUR_NIS),
      priceExVat: STUDIO_HALF_HOUR_NIS,
      priceNote: "30 דקות - פודקאסט קצר / הקלטה",
      description: "התחלה משתלמת - פודקאסט, ברכה קצרה או הקלטה.",
      highlights: [
        "חדר שקט וציוד מקצועי",
        "ליווי טכני במקום",
        "מתאים גם לשובר מתנה",
      ],
      whatsappText: "שלום, מעוניין בחצי שעה באולפן",
      utmCampaign: "studio_pricing_half_hour",
      featured: true,
    },
    {
      id: "hourly",
      name: "שעת אולפן",
      price: formatNis(STUDIO_ONE_HOUR_NIS),
      priceExVat: STUDIO_ONE_HOUR_NIS,
      priceNote: "60 דקות הקלטה",
      description: "הקלטה גמישה לדיבור, שירה, ברכה או פרק ארוך יותר.",
      highlights: [
        "גישה לציוד מקצועי ולחדר שקט",
        "הנדסת הקלטה במקום",
        "קובץ גולמי בסיום הסשן",
      ],
      whatsappText: "שלום, מעוניין להזמין שעת אולפן להקלטה",
      utmCampaign: "studio_pricing_hourly",
    },
    {
      id: "song-package",
      name: "חבילת הקלטת שיר",
      price: formatNis(getExVat("song_package")),
      priceExVat: getExVat("song_package"),
      priceNote: "עד 3 שעות אולפן - לפני מע״מ",
      description: "החבילה הפופולרית לשיר במתנה או הקלטה אישית.",
      highlights: [
        "הקלטה מודרכת עם טיונינג ווקאלי",
        "מיקס בסיסי ועיבוד סופי קל",
        "קובץ מוכן לשיתוף",
      ],
      whatsappText: "שלום, מעוניין בחבילת הקלטת שיר באולפן",
      utmCampaign: "studio_pricing_song",
    },
    {
      id: "single-production",
      name: "הפקת סינגל מלא",
      price: formatNis(getExVat("single_production")),
      priceExVat: getExVat("single_production"),
      priceNote: "החל מ- - לפני מע״מ",
      description: "הפקה מקצועית כולל עיבוד, מיקס ומאסטר.",
      highlights: [
        "עד 6 שעות אולפן כולל עריכה",
        "שילוב טראקים ומוזיקה מותאמת",
        "עיבוד סופי מסחרי לסטרימינג",
        "ליווי יצירתי מלא",
      ],
      whatsappText: "שלום, מעוניין בהפקת סינגל מלא באולפן",
      utmCampaign: "studio_pricing_single",
    },
  ],
};

export function getStudioService(id: StudioServiceId): ServiceEntity {
  return STUDIO_SERVICES[id];
}

export function getStudioHubLinks(): Array<{
  href: string;
  title: string;
  description: string;
}> {
  return Object.values(STUDIO_SERVICES).flatMap((s) => {
    if (!s.showInStudioHub || !s.hubCard?.title) return [];
    return [
      {
        href: `/${s.slug}`,
        title: s.hubCard.title,
        description: s.hubCard.description,
      },
    ];
  });
}

export function getBlessingsSubLinks(): Array<{
  href: string;
  title: string;
  description: string;
}> {
  const ids: StudioServiceId[] = [
    "blessings-bar-mitzvah",
    "blessings-bride-groom",
    "blessings-video-clip",
  ];
  return ids.flatMap((id) => {
    const s = STUDIO_SERVICES[id];
    if (!s.hubCard?.title) return [];
    return [
      {
        href: `/${s.slug}`,
        title: s.hubCard.title,
        description: s.hubCard.description,
      },
    ];
  });
}

/** ─── Voiceover registry ─── */

export const VOICEOVER_SERVICES = {
  "voiceover-hub": {
    id: "voiceover-hub",
    slug: "voiceover",
    category: "voiceover",
    title: "מרכז קריינות מקצועית - קול שמוביל מסר",
    subtitle:
      "קריינות מסחרית, מרכזיות, הודעות קוליות ותוכן מותגי ברמה גבוהה. אנחנו מפיקים קול שמשרת עסקים, מוסדות ויוצרים - עם דיוק, אמינות ונוכחות מקצועית.",
    metaTitle: "שירותי קריינות מקצועיים במודיעין",
    metaDescription:
      "קריינות מקצועית במודיעין. פרסומות, IVR ומרכזיות - אולפן מתקדם וליווי ביצוע.",
    keywords: [
      "קריינות מקצועית",
      "קריינות לפרסומות",
      "הקלטת IVR",
      "קריינות מרכזיות",
    ],
    features: [
      "קול מותגי מדויק לפרסומות, סרטונים וקמפיינים דיגיטליים",
      "הקלטות IVR ומערכות טלפון עם הנחיה ברורה ואחידה",
      "קריינות מרכזיות לסרטוני הדרכה, תדמית ומצגות",
      "עריכה, ניקוי ומיקס לתוצאה שידורית נקייה",
      "קורס קריינות פרונטלי למי שרוצה לבנות קריירה בשטח",
    ],
    assetsFolder: "podcast",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["voiceover-hub"]),
    mediaType: "gallery",
    whatsappText: "שלום, מעוניין לשמוע על שירותי הקריינות",
    utmCampaign: "voiceover_hub",
    faqs: [],
    hubCard: null,
    showInStudioHub: false,
    showInVoiceoverHub: false,
    showInEventsHub: false,
    showInAttractionsHub: false,
  },

  "voiceover-services": {
    id: "voiceover-services",
    slug: "voiceover/services",
    category: "voiceover",
    title: "קריינות מסחרית, מרכזיות ו-IVR",
    subtitle:
      "קול שמוכר, מסביר ומחבר - הקלטות מקצועיות לפרסומות, סרטוני תדמית, מערכות טלפון ותוכן ארגוני. תהליך מהיר, מדויק ומותאם למיתוג שלכם.",
    metaTitle: "קריינות מסחרית ומרכזיות | שירותי קול",
    metaDescription:
      "קריינות מסחרית במודיעין. IVR, הדרכה ותדמית - ביצוע מקצועי ומסירה מהירה.",
    keywords: [
      "קריינות מסחרית",
      "קריינות IVR",
      "קריינות לסרטון",
      "הקלטת מרכזיות",
    ],
    features: [
      "פרסומות רדיו, טלוויזיה ודיגיטל עם טון מותאם למותג",
      "הודעות קוליות, תפריטי IVR ומערכות מענה אוטומטי",
      "קריינות לסרטוני הדרכה, מצגות ותוכן ארגוני",
      "כיוון ביצוע בזמן אמת לדיוק ורגש נכונים",
      "מסירת קבצים מוכנים לשילוב בעריכת וידאו או שידור",
    ],
    assetsFolder: "podcast",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["voiceover-services"],
    ),
    mediaType: "gallery",
    whatsappText: "שלום, מעוניין בשירותי קריינות מקצועיים",
    utmCampaign: "voiceover_services",
    faqs: [
      {
        id: "turnaround",
        question: "מה זמן ההפקה הממוצע?",
        answer:
          "פרויקטים סטנדרטיים נמסרים תוך 24-72 שעות. פרויקטים דחופים מתואמים לפי זמינות.",
      },
      {
        id: "languages",
        question: "האם ניתן להקליט בעברית בלבד?",
        answer:
          "התמחות עיקרית בעברית. לפרויקטים בינלאומיים ניתן לתאם לפי הצורך.",
      },
    ],
    hubCard: {
      title: "שירותי קריינות",
      description: "פרסומות, IVR ומרכזיות - הפקה מלאה.",
    },
    showInVoiceoverHub: true,
  },

  "voiceover-course": {
    id: "voiceover-course",
    slug: "voiceover/course",
    category: "voiceover",
    title: "קורס קריינות פרונטלי",
    subtitle:
      "מסלול הכשרה מעשי לקריינות מקצועית - טכניקת קול, ביטחון מול מיקרופון, קריאה מסחרית והקלטה באולפן. מתאים למתחילים ולמי שרוצה לשדרג רמה.",
    metaTitle: "קורס קריינות פרונטלי | אקדמיית קול",
    metaDescription:
      "קורס קריינות פרונטלי במודיעין. תרגול באולפן, משוב אישי והכנה לשוק.",
    keywords: [
      "קורס קריינות",
      "לימודי קריינות",
      "אקדמיה לקריינות",
      "קריינות פרונטלי",
    ],
    features: [
      "מפגשים פרונטליים באולפן עם תרגול מעשי מול מיקרופון",
      "טכניקות נשימה, דיקציה, קצב ורגש בקריאה מסחרית",
      "תרגול IVR, פרסומות ומרכזיות בסימולציות אמיתיות",
      "משוב אישי ותוכנית שיפור בין מפגשים",
      "הכנה לבניית דמו ריק וכניסה לשוק העבודה",
    ],
    assetsFolder: "voiceover",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["voiceover-course"]),
    mediaType: "video",
    whatsappText:
      "שלום, אשמח לקבל פרטים וסילבוס על קורס הקריינות הפרונטלי",
    utmCampaign: "voiceover_course",
    faqs: [
      {
        id: "audience",
        question: "למי הקורס מתאים?",
        answer:
          "למתחילים, יוצרי תוכן, דוברים ציבוריים ואנשי מקצוע שרוצים להוסיף קריינות לשירותים שלהם.",
      },
      {
        id: "duration",
        question: "כמה מפגשים כולל המסלול?",
        answer:
          "המסלול מורכב מסדרת מפגשים פרונטליים. פרטי הסילבוס המלא נשלחים בוואטסאפ לפי מועד פתיחה.",
      },
    ],
    hubCard: {
      title: "קורס קריינות פרונטלי",
      description: "הכשרה מעשית באולפן עם ליווי אישי.",
    },
    showInVoiceoverHub: true,
  },
} as const satisfies Record<string, ServiceEntity>;

export type VoiceoverServiceId = keyof typeof VOICEOVER_SERVICES;

export function getVoiceoverService(id: VoiceoverServiceId): ServiceEntity {
  return VOICEOVER_SERVICES[id];
}

export function getVoiceoverHubLinks(): Array<{
  href: string;
  title: string;
  description: string;
}> {
  return Object.values(VOICEOVER_SERVICES).flatMap((s) => {
    if (!s.showInVoiceoverHub || !s.hubCard?.title) return [];
    return [
      {
        href: `/${s.slug}`,
        title: s.hubCard.title,
        description: s.hubCard.description,
      },
    ];
  });
}

/** ─── Events & Attractions registry ─── */

export const EVENTS_SERVICES = {
  "events-hub": {
    id: "events-hub",
    slug: "events",
    category: "events",
    title: "אירועים ואטרקציות - הפקה מקצועית לכל אירוע",
    subtitle:
      "DJ מוביל, השכרת הגברה ותאורה, הנחיית קהל מקצועית, ניהול לו\"ז מדויק ואטרקציות חובה לחתונה - חבילות מותאמות לחתונות, אירועי חברה וחגיגות פרטיות.",
    metaTitle: "הפקות אירועים ואטרקציות במודיעין",
    metaDescription:
      "DJ, הנחיית קהל ואטרקציות במודיעין. הגברה, מנחה מקצועי וחבילות חתונה - לכל הארץ.",
    keywords: [
      "DJ לאירועים",
      "השכרת הגברה",
      "אטרקציות לחתונה",
      "הפקת אירועים",
      "הנחיית קהל",
      "ניהול לו\"ז",
      "אמנים אורחים",
      "אטרקציות חובה",
    ],
    features: [
      "DJ מקצועי עם סגנון מוזיקלי מותאם לקהל ולאופי האירוע",
      "השכרת מערכות הגברה ותאורה ברמה גבוהה",
      "הנחיית קהל וניהול לו\"ז חלק בין כל חלקי האירוע",
      "אטרקציות חובה: עשן לכניסה, קונפטי ותותחי בועות",
      "ליווי אישי משלב התכנון ועד סיום האירוע",
    ],
    assetsFolder: "events/attractions/led-booth",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["events-hub"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין לשמוע על הפקות אירועים ואטרקציות",
    utmCampaign: "events_hub",
    faqs: [],
    hubCard: null,
    showInStudioHub: false,
    showInVoiceoverHub: false,
    showInEventsHub: false,
    showInAttractionsHub: false,
  },

  "events-dj": {
    id: "events-dj",
    slug: "events/dj-events",
    category: "events",
    title: "תקליטן לאירועים",
    subtitle:
      "DJ טוב הוא ההבדל בין רחבה מלאה לערב שמתרוקן מוקדם  -  מעל 1,500 אירועים, ציוד Pioneer ו-RCF, גיבוי מלא ומוזיקה מותאמת אישית.",
    metaTitle: "תקליטן לאירועים | DJ לחתונה ואירועים",
    metaDescription:
      "תקליטן לחתונה ואירועים במודיעין. ציוד פרימיום, קריאת קהל, חבילות עם אטרקציות - לכל הארץ.",
    keywords: [
      "תקליטן לאירועים",
      "DJ לחתונה",
      "DJ לאירועים",
      "תקליטן לחתונה",
      "DJ מקצועי",
    ],
    features: [
      "פגישת תכנון מוזיקלי  -  שירים שאוהבים ושירים אסורים",
      "ציוד Pioneer CDJ 3000, Allen & Heath, RCF  -  עם גיבוי מלא",
      "קריאת קהל בזמן אמת  -  לא תקועים מול המחשב",
      "תאורת LED, קריאות מקצועיות, אירועים דתיים ומעורבים",
      "חבילות עם אטרקציות  -  עשן, זיקוקים, קונפטי",
    ],
    pricing: [
      {
        name: "חבילת עיגון",
        price: "הצעה אישית",
        priceNote: "עד 5 שעות - עד 150 אורחים",
        description:
          "DJ מנוסה מהצוות - ציוד Pioneer CDJ + RCF - תאורת LED בסיסית - פגישת תכנון מוזיקלי - גיבוי לכל רכיב.",
      },
      {
        name: "חבילת פרימיום",
        price: "הצעה אישית",
        priceNote: "עד 7 שעות - עד 300 אורחים",
        description:
          "כל מה שבבסיס + תאורה מתקדמת (Moving Heads) + 2 אטרקציות לבחירה + הנחיה לחופה, ריקוד ראשון ועוגה.",
        featured: true,
        badge: "הכי מבוקשת",
      },
      {
        name: "חבילת פסטיבל VIP",
        price: "הצעה אישית",
        priceNote: "7+ שעות - ללא הגבלת אורחים",
        description:
          "יקיר כהן אישית על הקונסולה - 3+ אטרקציות - אולפן נייד - מצגת קולנועית - פסקול כניסה + קריינות - טכנאי צמוד.",
        badge: "VIP",
      },
    ],
    assetsFolder: "events/dj-events",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["events-dj"]),
    mediaType: "video",
    whatsappText:
      "שלום, מעוניין/ת ב-DJ לאירוע  -  אשמח להצעת מחיר ותיאום",
    utmCampaign: "events_dj",
    scarcityLabel: "עונת השיא (מאי-אוקטובר) מתמלאת מהר",
    faqs: [
      {
        id: "songs",
        question: "אפשר לבקש שירים ספציפיים?",
        answer:
          "בהחלט  -  עובדים לפי הרשימה שלכם ומוסיפים מה שמתאים לקהל. שיר אסור? לא נשמיע.",
      },
      {
        id: "failure",
        question: "מה אם יש תקלה טכנית?",
        answer: "גיבוי לכל רכיב  -  מחליפים תוך דקות (נדיר מאוד).",
      },
      {
        id: "outdoor",
        question: "עובדים בחוץ?",
        answer: "כן  -  צריך נקודת חשמל יציבה וגישה נוחה.",
      },
      {
        id: "power",
        question: "צריך לספק חשמל?",
        answer: "נקודת תלת-פאזי 32A יציבה  -  ברוב האולמות כבר קיים.",
      },
      {
        id: "announcements",
        question: 'מה זה "קריאות"?',
        answer:
          "הנחיה מקצועית: לחופה, ריקוד ראשון, עוגה, ברכה  -  ברור ולא מעצבן.",
      },
      {
        id: "booking",
        question: "כמה זמן מראש להזמין?",
        answer:
          "מומלץ 2-3 חודשים, בעונת השיא מוקדם יותר. דחוף? צרו קשר ונבדוק זמינות.",
      },
      {
        id: "attractions",
        question: "אפשר לשלב אטרקציות?",
        answer:
          "מומלץ  -  רוב האירועים משלבים עשן, זיקוקים או קונפטי. יש חבילות משולבות.",
      },
    ],
    hubCard: {
      title: "DJ לאירועים",
      description: "מוזיקה מקצועית שמחברת את כל הרגעים.",
    },
    showInEventsHub: true,
    showInAttractionsHub: false,
  },

  "events-equipment": {
    id: "events-equipment",
    slug: "events/equipment",
    category: "events",
    title: "השכרת רמקולים והגברה",
    subtitle:
      "מערכת הגברה מלאה עם ציוד RCF איכותי  -  הובלה, הקמה, כיוונון ופירוק כלולים. עד 250 אורחים, עד 10 שעות. גינה, אולם או חצר.",
    metaTitle: "השכרת הגברה לאירועים | רמקולים RCF",
    metaDescription:
      "השכרת הגברה לאירועים במודיעין. RCF, סאב ומיקסר - הקמה ופירוק כלולים.",
    keywords: [
      "השכרת הגברה",
      "השכרת רמקולים",
      "מערכת הגברה לאירוע",
      "RCF לאירוע",
      "הגברה לחתונה",
    ],
    features: [
      "זוג RCF 745 + סאב 15 + מיקסר Allen & Heath",
      "הובלה, הקמה, כיוונון ופירוק  -  הכל כלול",
      "עד 250 אורחים - עד 10 שעות - תלת-פאזי 32A",
      "צוות בשטח לאורך האירוע + ציוד גיבוי",
      "שילוב DJ ואפקטים  -  חבילות משולבות",
    ],
    pricing: [
      {
        name: "חבילת הגברה מלאה",
        price: "הצעה בוואטסאפ",
        priceNote: "עד 10 שעות - עד 250 אורחים",
        description: "RCF + הקמה ופירוק + כיוונון בשטח.",
      },
    ],
    assetsFolder: "events/equipment",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["events-equipment"]),
    mediaType: "gallery",
    whatsappText:
      "שלום, מעוניין/ת בהשכרת הגברה לאירוע  -  אשמח להצעת מחיר (תאריך, מיקום, משך)",
    utmCampaign: "events_equipment",
    faqs: [
      {
        id: "setup-only",
        question: "אפשר רק ציוד בלי הקמה?",
        answer:
          "החבילה כוללת הובלה, הקמה וכיוונון  -  כך הצליל מושלם. לציוד בלבד  -  צרו קשר.",
      },
      {
        id: "failure",
        question: "מה אם יש תקלה?",
        answer: "גיבוי זמין, החלפה תוך דקות, צוות לאורך כל האירוע.",
      },
      {
        id: "outdoor",
        question: "מתאים לחוץ?",
        answer:
          "כן  -  חשמל יציב, גישה נוחה, וכיסוי מפני גשם (חשמל ומים = סכנה).",
      },
      {
        id: "setup-time",
        question: "כמה זמן הקמה?",
        answer: "30-60 דקות. מגיעים לפחות שעתיים לפני האירוע.",
      },
      {
        id: "dj",
        question: "אפשר לשלב DJ?",
        answer: "בהחלט  -  רוב האירועים משלבים הגברה + DJ. יש חבילות חוסכות.",
      },
      {
        id: "rcf",
        question: "מה ההבדל מציוד רגיל?",
        answer:
          "RCF = צליל נקי, אמין וחזק ברמה בינלאומית. ההבדל בין \"בסדר\" ל\"מושלם\".",
      },
      {
        id: "booking",
        question: "כמה זמן מראש להזמין?",
        answer: "מומלץ חודש מראש, בעונת השיא מוקדם יותר. דחוף? נבדוק זמינות.",
      },
    ],
    hubCard: {
      title: "הגברה ותאורה",
      description: "ציוד מקצועי, התקנה וליווי טכני.",
    },
    showInEventsHub: true,
    showInAttractionsHub: false,
  },

  "events-singer-amplification": {
    id: "events-singer-amplification",
    slug: "events/equipment/singer-amplification",
    category: "events",
    title: "הגברה מקצועית לזמרים",
    subtitle:
      "ציוד פרימיום + טכנאי מנוסה + צ'ק סאונד מלא  -  Shure, RCF, מוניטורים. ראש שקט להופעה הבאה. מ-2,800 ₪.",
    metaTitle: "הגברה לזמר | מערכת הגברה לזמרים במודיעין",
    metaDescription:
      "הגברה מקצועית לזמרים במודיעין. צ'ק סאונד, מוניטורים וטכנאי - לכל הארץ.",
    keywords: [
      "הגברה לזמר",
      "מערכת הגברה לזמרים",
      "השכרת הגברה לזמר",
      "ציוד הגברה לזמרים",
      "הגברה לאירועים קטנים",
      "מערכת סאונד להופעה",
      "הגברה מקצועית במודיעין",
      "הגברה לזמרים",
      "צ'ק סאונד",
    ],
    features: [
      "חבילות 2,800 / 5,800 / 7,800 ₪  -  מחירים גלויים",
      "צ'ק סאונד 30-60 דקות  -  לא רק \"טסט טסט\"",
      "Shure SM58 / Beta 58A, EV RE20, מוניטורים",
      "גיבוי מלא + טכנאי לאורך ההופעה",
      "אולפן מקצועי  -  20 שנות ניסיון בסאונד",
    ],
    pricing: [
      {
        name: "בסיס מקצועי",
        price: "2,800 ₪",
        priceNote: "פופולרי - עד 150 אורחים",
        description: "סולו/דואט  -  SM58, RCF, מוניטור, צ'ק 30 דק׳.",
      },
      {
        name: "פרימיום",
        price: "5,800 ₪",
        priceNote: "עד 350 אורחים",
        description: "3 מיקרופונים אלחוטיים, 4 RCF, 2 סאבים, צ'ק 45 דק׳.",
      },
      {
        name: "VIP",
        price: "7,800 ₪",
        priceNote: "Line Array - 2 טכנאים",
        description: "עד 6 מיקרופונים, IEM, הקלטה אופציונלית.",
      },
    ],
    assetsFolder: "events/equipment/singer-amplification",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["events-singer-amplification"],
    ),
    mediaType: "gallery",
    whatsappText:
      "שלום, מעוניין/ת בהגברה לזמר/להקה  -  אשמח להצעת מחיר (תאריך, מיקום, חבילה)",
    utmCampaign: "singer_amplification",
    faqs: [
      {
        id: "compare",
        question: "איך זה לעומת השכרה זולה?",
        answer:
          "זול + חובבן: 600-800 ₪, בלי גיבוי וצ'ק אמיתי. אצלנו: ציוד פרימיום, טכנאי, גיבוי  -  הופעה מקצועית.",
      },
      {
        id: "discount",
        question: "אפשר הנחה?",
        answer: "להופעות חוזרות ואירועים גדולים  -  נדבר. לא מתפשרים על איכות.",
      },
      {
        id: "failure",
        question: "מה אם יש תקלה?",
        answer: "גיבוי לכל רכיב, החלפה תוך שניות, טכנאי מנוסה.",
      },
      {
        id: "travel",
        question: "עובדים בכל הארץ?",
        answer:
          "כן  -  תוספת לפי מרחק ממודיעין (מרכז ללא תוספת, צפון +300 ₪, דרום +500 ₪).",
      },
      {
        id: "soundcheck",
        question: "כמה זמן צ'ק סאונד?",
        answer: "בסיס 30 דק׳, פרימיום 45 דק׳, VIP שעה+. עד שמרגישים מוכנים.",
      },
      {
        id: "own-mic",
        question: "אפשר מיקרופון משלי?",
        answer: "בהחלט  -  נחבר ונכוון למערכת.",
      },
      {
        id: "booking",
        question: "כמה זמן מראש?",
        answer: "מומלץ 2-3 שבועות, בעונת ההופעות מוקדם יותר.",
      },
    ],
    hubCard: null,
    showInEventsHub: false,
    showInAttractionsHub: false,
  },

  "events-wedding-packages": {
    id: "events-wedding-packages",
    slug: "events/wedding-attractions-packages",
    category: "events",
    title: "חבילות אירועים מיוחדות",
    subtitle:
      "חסכו עד 30%  -  שלבו DJ, אטרקציות והגברה בחבילה אחת. ספק אחד, תיאום אחד, מחיר מוזל.",
    metaTitle: "חבילות אירועים | DJ + אטרקציות במחיר מיוחד",
    metaDescription:
      "חבילות אטרקציות חובה לחתונה במודיעין. DJ + 3 אטרקציות, חבילת פסטיבל - חיסכון 20-30%.",
    keywords: [
      "חבילות לחתונה",
      "חבילת DJ ואטרקציות",
      "חבילות אירועים",
      "הפקת חתונה",
    ],
    features: [
      "חבילת DJ + 3 אטרקציות לבחירה (עד 7 שעות)",
      "חבילת פסטיבל  -  DJ, אולפן נייד, 3 אפקטים ועוד",
      "חיסכון 20-30% לעומת הזמנה נפרדת",
      "תיאום מסונכרן  -  DJ מכיר את כל האפקטים",
      "מחשבון חבילות + הצעה בוואטסאפ תוך 24 שעות",
    ],
    pricing: [
      {
        name: "חבילה 1: DJ + 3 אטרקציות",
        price: "הצעה בוואטסאפ",
        priceNote: "3 אטרקציות לבחירה",
        description: "DJ מקצועי + עשן / זיקוקים / קונפטי / בועות / LED.",
      },
      {
        name: 'חבילת "פסטיבל"  -  הכל כלול',
        price: "15,000 ₪",
        priceNote: "הכי מלאה",
        description: "DJ, אולפן נייד, 3 אפקטים, פסקול כניסה, מצגת וטכנאי.",
      },
    ],
    assetsFolder: "events/wedding-packages",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["events-dj"]),
    mediaType: "video",
    whatsappText:
      "שלום, מעוניין/ת בחבילת אירועים (DJ + אטרקציות)  -  אשמח להצעת מחיר",
    utmCampaign: "wedding_packages",
    scarcityLabel: "חיסכון עד 30% בחבילה משולבת",
    faqs: [],
    hubCard: {
      title: "חבילות אירועים",
      description: "DJ + אטרקציות במחיר מיוחד.",
    },
    showInEventsHub: true,
    showInAttractionsHub: false,
  },

  "events-host": {
    id: "events-host",
    slug: "events/host",
    category: "events",
    title: "מנחה ומנהל אירועים מקצועי",
    subtitle:
      "אירוע מסודר, מכובד ומלא אנרגיה - מנחה מקצועי שמוביל את הערב בטון נכון, שומר על לוז זמנים ומחבר בין האורחים, המשפחה והספקים.",
    metaTitle: "מנחה אירועים מקצועי | MC לאירועים",
    metaDescription:
      "מנחה אירועים מקצועי במודיעין. חתונות, בר/בת מצווה ואירועי חברה - ניהול לוח זמנים מדויק.",
    keywords: [
      "מנחה אירועים",
      "MC לחתונה",
      "ניהול אירועים",
      "הנחיית חתונה",
    ],
    features: [
      "ליווי תכנוני לפני האירוע ובניית תסריט ערב",
      "ניהול לו\"ז, כניסות ומעברים בין חלקים",
      "הנחיית טקסים, דברים ורגעים רגשיים",
      "תיאום מול DJ, צלמים וספקים בזמן אמת",
      "שמירה על אווירה מכבדת, חגיגית ומדויקת",
    ],
    assetsFolder: "events/attractions/led-booth",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["events-host"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בשירותי הנחייה וניהול אירוע מקצועי",
    utmCampaign: "events_host",
    faqs: [
      {
        id: "host-what",
        question: "מה הופך מנחה אירועים לטוב?",
        answer:
          "מנחה טוב קורא את האווירה בחדר - יודע מתי להיות שקט ומתי להרים, מתי לצחוק ומתי לתת לרגע לדבר. הוא מכין תסריט מפורט יחד איתכם מראש, ושומר על גמישות מלאה ביום האירוע.",
      },
      {
        id: "host-who",
        question: "למי מתאים שירות מנחה אירועים?",
        answer:
          "לכל אירוע שיש בו כמה חלקים: חתונות, בר ובת מצווה, אירועי חברה, השקות. בכל מקום שצריך מישהו שמנהל את הזרימה - שהאורחים לא יישבו בריק, שהכניסות יגיעו בדיוק, שהדיבורים לא יתארכו.",
      },
      {
        id: "host-timing",
        question: "מתי לבחור מנחה ולמתי DJ מספיק?",
        answer:
          "DJ מנגן ומנהל רחבה. מנחה מוביל את הטקסים, מתאם בין הספקים והנחיית קהל מקצועית. לאירועים עם חלקים מורכבים - טקס, ארוחה, נאומים, ריקודים - מנחה הוא הדבק שמחזיק הכל יחד.",
      },
      {
        id: "host-prep",
        question: "איך מתכוננים ביחד לפני האירוע?",
        answer:
          "בשיחת תכנון לפני האירוע בונים יחד תסריט מפורט: סדר החלקים, מי מדבר ומתי, כניסות מיוחדות, הפתעות. המנחה מגיע עם כל הפרטים שגובשו - ומסתגל לכל שינוי בזמן אמת.",
      },
    ],
    hubCard: {
      title: "מנחה ומנהל אירוע",
      description: "ניהול ערב חלק מקצה לקצה.",
    },
    showInEventsHub: true,
    showInAttractionsHub: false,
  },

  "events-attractions-hub": {
    id: "events-attractions-hub",
    slug: "events/attractions",
    category: "events",
    title: "אטרקציות יוקרתיות לאירועים",
    subtitle:
      "שדרוג מיידי למראה האירוע - מכונות עשן כבד, בועות מרהיבות ותותחי קונפטי מבוקרים. צוות מקצועי, בטיחות מלאה ואפקט ויזואלי בלתי נשכח.",
    metaTitle: "אטרקציות לאירועים | עשן, בועות וקונפטי",
    metaDescription:
      "אטרקציות לחתונה במודיעין. עשן, בועות וקונפטי - הפעלה מקצועית ובטיחות מלאה.",
    keywords: [
      "אטרקציות לחתונה",
      "מכונת עשן לאירוע",
      "תותח קונפטי",
      "מכונת בועות",
    ],
    features: [
      "אטרקציות חובה לחתונה ישראלית: עשן לכניסה, קונפטי לריקוד ראשון",
      "אפקטים מרשימים לרגעי השיא בטקס וברחבה",
      "ציוד מקצועי עם תחזוקה ותפעול מבוקר",
      "תיאום מול DJ ומנהל האירוע לטיימינג מדויק",
      "עמידה בסטנדרטי בטיחות גבוהים",
      "חבילות משולבות או שירות בודד לפי צורך",
    ],
    assetsFolder: "events/attractions/wedding-smoking-machine",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["events-attractions-hub"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בפרטים על אטרקציות לאירוע",
    utmCampaign: "events_attractions_hub",
    faqs: [],
    hubCard: {
      title: "אטרקציות לאירועים",
      description: "עשן, בועות וקונפטי - אפקט מקצועי.",
    },
    showInEventsHub: true,
    showInAttractionsHub: false,
  },

  "attractions-bubble-machine": {
    id: "attractions-bubble-machine",
    slug: "events/attractions/bubble-machine",
    category: "events",
    title: "בועות סבון לאירועים",
    subtitle:
      "מכונות בועות סבון + מפעיל מקצועי  -  בדיוק מתי שתגידו. עשן, LED, כניסה לחופה וסלואו. נוזל בטוח, שליטה אלחוטית ושירות לכל הארץ.",
    metaTitle: "השכרת מכונת בועות סבון לאירועים",
    metaDescription:
      "השכרת מכונת בועות לחתונה - ממודיעין לכל הארץ. עשן, LED ומפעיל צמוד.",
    keywords: [
      "בועות סבון לאירוע",
      "מכונת בועות",
      "בועות עשן",
      "בועות LED",
      "בועות לחופה",
    ],
    features: [
      "בועות עשן, רגילות ו-LED  -  לפי סוג האירוע",
      "מפעיל צמוד ושליטה אלחוטית",
      "נוזל היפואלרגני  -  לא מחליק ולא פוגע בציוד",
      "תיאום מלא עם DJ, צלם ומנהל אירוע",
      "הובלה, התקנה, פירוק ואחריות מלאה",
    ],
    pricing: [
      {
        name: "חבילת הפעלה מלאה",
        price: "הצעה בוואטסאפ",
        description:
          "מכונה + תותח + מפעיל + נוזלים + הובלה. מחיר משתנה לפי משך ואזור.",
      },
    ],
    assetsFolder: "events/attractions/bubble-machine",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["attractions-bubble-machine"],
    ),
    mediaType: "video",
    whatsappText: "שלום, מעוניין במכונת בועות סבון לאירוע",
    utmCampaign: "bubble_machine",
    faqs: [
      {
        id: "kids",
        question: "האם הבועות בטוחות לילדים?",
        answer: "כן  -  תמיסה היפואלרגנית, לא רעילה ומתאימה לכל גיל.",
      },
      {
        id: "slip",
        question: "האם האפקט מחליק את הרצפה?",
        answer: "לא  -  הנוזל מתייבש מיד, ללא סימנים או סכנת החלקה.",
      },
      {
        id: "duration",
        question: "כמה זמן האפקט נמשך?",
        answer:
          "ניתן להפעיל במספר מקטעים  -  מרגעים קצרים ועד כמה דקות בכל הפעלה.",
      },
      {
        id: "combo",
        question: "אפשר לשלב עם אפקטים נוספים?",
        answer: "קונפטי, זיקוקים קרים, עשן כבד ותאורת LED  -  הכול מסונכרן.",
      },
      {
        id: "small",
        question: "מתאים לאירועים קטנים?",
        answer: "כן  -  כיוון עוצמה והיקף לפי גודל המרחב.",
      },
      {
        id: "electronics",
        question: "האם פוגע בציוד אלקטרוני?",
        answer:
          "לא  -  החומר מתאדה במהירות. אופציה לנוזל UK9 מתקדם בתוספת תשלום.",
      },
      {
        id: "booking",
        question: "כמה זמן מראש להזמין?",
        answer: "בעונת שיא (חורף-אביב) מומלץ לפחות חודשיים מראש.",
      },
    ],
    hubCard: {
      title: "מכונת בועות",
      description: "אפקט קסום לרגעי שיא באירוע.",
    },
    showInEventsHub: false,
    showInAttractionsHub: true,
  },

  "attractions-smoke-bubble-machine": {
    id: "attractions-smoke-bubble-machine",
    slug: "events/attractions/bubble-machine/smoke-bubble-machine-events",
    category: "events",
    title: "מכונת בועות סבון עשן",
    subtitle:
      "בועות סבון ועשן לאירועים  -  האפקט שיהפוך את הרחבה לסט צילומים. בועות מבריקות עם ענן עשן עדין בתוכן, הפעלה מקצועית ושירות מלא.",
    metaTitle: "מכונת בועות עשן לאירועים | האטרקציה של 2026",
    metaDescription:
      "מכונת בועות עשן לחתונה - ממודיעין. אפקט כפול, מפעיל צמוד ותיאום DJ.",
    keywords: [
      "בועות סבון עשן",
      "מכונת בועות עשן",
      "בועות עשן לחתונה",
      "אטרקציה לרחבה",
      "בועות ועשן",
    ],
    features: [
      "בועות אטומות עם ענן עשן בתוכן  -  מצטלם מדהים",
      "נוזל Dry-Bubble  -  לא מחליק, לא מכתים שמלות",
      "מפעיל צמוד ותזמון עם DJ וצלם",
      "אפקט 3 ב-1: מגיעים, מתקינים, מפעילים ומפרקים",
      "שילוב עם עשן כבד וזיקוקים קרים",
    ],
    pricing: [
      {
        name: "הפעלת בועות עשן",
        price: "הצעה בוואטסאפ",
        description:
          "מכונה + מפעיל + נוזלים + הובלה. מחיר לפי משך ואזור.",
      },
    ],
    assetsFolder: "events/attractions/bubble-machine",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["attractions-bubble-machine"],
    ),
    mediaType: "video",
    whatsappText:
      "שלום, מעוניין במכונת בועות סבון עשן לאירוע",
    utmCampaign: "smoke_bubble_machine",
    faqs: [
      {
        id: "vs-regular",
        question: "מה ההבדל מבועות סבון רגילות?",
        answer:
          "בועות רגילות שקופות. בועות העשן מלאות בערפל  -  במפגע הן משחררות ענן קטן. מראה יוקרתי הרבה יותר בצילום.",
      },
      {
        id: "indoor",
        question: "בטוח באולם סגור?",
        answer:
          "בהחלט  -  ציוד מקצועי ונוזלים בטוחים שאינם רעילים. המפעיל ממקם את המכונה באחריות.",
      },
      {
        id: "duration",
        question: "כמה זמן האפקט נמשך?",
        answer:
          "בדרך כלל 3-5 דקות לרגע שיא (סלואו). ניתן לתאם הפעלות נוספות.",
      },
      {
        id: "combo",
        question: "אפשר לשלב עם אפקטים נוספים?",
        answer:
          "עשן כבד, זיקוקים קרים וקונפטי  -  נבנה חבילת אפקטים מותאמת.",
      },
      {
        id: "dress",
        question: "משאיר כתמים על השמלה?",
        answer:
          "ממש לא  -  נוזל שקוף, היפואלרגני, לא מכתים בדים.",
      },
      {
        id: "outdoor",
        question: "מתאים לחוץ?",
        answer:
          "כן, עם מיקום אסטרטגי של התותחים  -  גם ברוח קלה.",
      },
    ],
    hubCard: null,
    showInEventsHub: false,
    showInAttractionsHub: false,
  },

  "attractions-heavy-smoke-large": {
    id: "attractions-heavy-smoke-large",
    slug: "events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
    category: "events",
    title: "השכרת עשן כבד לאירועים גדולים",
    subtitle:
      "ענן צח בגובה מושלם  -  מכונות עם 2 צינורות לכיסוי אולמות ענקיים. אפקט קולנועי למי שרוצה להשקיע באירוע בלתי נשכח.",
    metaTitle: "השכרת עשן כבד לאירועים גדולים | מכונה כפולה",
    metaDescription:
      "עשן כבד לאירועים גדולים - ממודיעין. דחיפה כפולה, מפעיל צמוד ואולמות ענק.",
    keywords: [
      "השכרת עשן כבד לאירועים גדולים",
      "עשן כבד לאירועים",
      "עשן כבד לאולם גדול",
      "מכונת עשן כבד כפולה",
      "עשן כבד לאירוע גדול",
    ],
    features: [
      "2 צינורות פליטה  -  כיסוי מהיר ואחיד",
      "שליטה בצפיפות, גובה וטמפרטורה",
      "מפעיל מקצועי צמוד  -  לא רק מכונה",
      "בטוח, יבש, ללא כתמים או ריח",
      "שילוב זיקוקים, קונפטי וחבילות אירועים",
    ],
    pricing: [
      {
        name: "עשן כבד לאירוע גדול",
        price: "הצעה בוואטסאפ",
        priceNote: "מכונה כפולה + מפעיל",
        description: "כיסוי אולם גדול / רחבה פתוחה  -  מותאם לשטח.",
      },
      {
        name: "חבילת פרימיום + אפקטים",
        price: "הצעה בוואטסאפ",
        description: "עשן כבד + זיקוקים קרים / קונפטי / בועות.",
      },
    ],
    assetsFolder: "heavy-smoke",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["attractions-wedding-smoke-large"],
    ),
    mediaType: "video",
    whatsappText:
      "שלום, מעוניין בעשן כבד לאירוע גדול (מכונה כפולה)  -  אשמח להצעת מחיר",
    utmCampaign: "heavy_smoke_large",
    scarcityLabel: "השקעה באירוע  -  זמינות מוגבלת בעונה",
    faqs: [
      {
        id: "health",
        question: "האם העשן מסוכן?",
        answer: "לא  -  חומרים מאושרים, לא רעיל, בטוח גם לילדים וקשישים.",
      },
      {
        id: "stains",
        question: "האם נשארים כתמים?",
        answer: "לא  -  עשן יבש לחלוטין, ללא רטיבות או כתמים.",
      },
      {
        id: "duration",
        question: "כמה זמן העשן נשאר?",
        answer: "נמוך וסמיך זמן רב יותר מעשן רגיל  -  עד שהרגע עובר.",
      },
      {
        id: "operator",
        question: "האם מגיע מפעיל?",
        answer: "כן  -  מפעיל מקצועי, תזמון מושלם, לא משאירים אתכם לבד.",
      },
      {
        id: "combo",
        question: "אפשר לשלב אטרקציות?",
        answer: "כן  -  חבילות עם זיקוקים קרים, בועות, קונפטי ועוד.",
      },
    ],
    hubCard: null,
    showInEventsHub: false,
    showInAttractionsHub: false,
  },

  "attractions-wedding-smoke": {
    id: "attractions-wedding-smoke",
    slug: "events/attractions/wedding-smoking-machine",
    category: "events",
    title: "עשן כבד לחתונה וסלואו",
    subtitle:
      "ענן עשן שמצטלם כמו הפקה קולנועית  -  100% עשן כבד איכותי מתחת לברך, ללא ריח וללא החלקה. לא מפעילים מכונה  -  מבטיחים שהרגע הכי חשוב יצטלם מושלם.",
    metaTitle: "השכרת עשן כבד לאירועים | קרח יבש לחתונה",
    metaDescription:
      "עשן כבד לחתונה וחופה - ממודיעין לכל הארץ. תיאום DJ וצלם, מעל 1,800 אירועים.",
    keywords: [
      "עשן כבד לחתונה",
      "עשן כבד לסלואו",
      "קרח יבש לאירוע",
      "מכונת עשן כבד",
      "עשן לאירועים גדולים",
    ],
    features: [
      "ענן לבן סמיך בגובה הברך  -  מתאים לצילום",
      "קרח יבש (מינוס 78°)  -  לא עולה לפנים",
      "תיאום מלא עם DJ, צלם ומנהל אירוע",
      "בטוח לאולמות סגורים ולחוץ  -  ביטוח וטכנאי",
      "שילוב קונפטי, זיקוקים קרים ובועות TITAN",
    ],
    pricing: [
      {
        name: "חבילת סלואו / חופה",
        price: "הצעה בוואטסאפ",
        description:
          "הפעלה לכניסה לחופה או ריקוד סלואו  -  מכונות בעוצמה מותאמת.",
      },
      {
        name: "חבילה משודרגת",
        price: "הצעה בוואטסאפ",
        description:
          "עשן + תותחי קונפטי אוטומטיים לסיום הסלואו, אופציה לצילום 4K לרשתות.",
      },
      {
        name: "חבילת VIP",
        price: "הצעה בוואטסאפ",
        description:
          "5 רגעי שיא, בועות TITAN, זיקוקים קרים, תותחי עשן וליווי טכנאי לאורך האירוע.",
      },
    ],
    assetsFolder: "events/attractions/wedding-smoking-machine",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["attractions-wedding-smoke"]),
    mediaType: "video",
    whatsappText:
      "שלום, מעוניין בעשן כבד לחתונה/סלואו  -  אשמח להצעת מחיר",
    utmCampaign: "wedding_smoke_machine",
    faqs: [
      {
        id: "duration",
        question: "כמה זמן נמשך האפקט?",
        answer:
          "האפקט המלא נמשך 3-5 דקות  -  בדיוק לסלואו. בחבילות פרימיום ו-VIP אפשר הפעלה נוספת במהלך הערב.",
      },
      {
        id: "venue",
        question: "האם צריך אישור מהאולם?",
        answer:
          "ברוב האולמות לא נדרש אישור מיוחד  -  לא עשן שריפה. אנחנו מספקים אישור בטיחות וביטוח צד ג׳ כשנדרש.",
      },
      {
        id: "indoor",
        question: "האם בטוח באולם סגור?",
        answer:
          "בהחלט. חומרים טבעיים, ללא ריח, לא מרטיב את הרצפה ולא מחליק.",
      },
      {
        id: "insurance",
        question: "יש ביטוח וטכנאי באירוע?",
        answer:
          "כן  -  ציוד מבוטח, טכנאי זמין בטלפון כל האירוע, אופציה לטכנאי בשטח, ואחריות מלאה.",
      },
      {
        id: "failure",
        question: "מה אם יש תקלה?",
        answer:
          "טכנאי זמין תוך דקות, חלקי חילוף, פתרון בזמן אמת וביטוח מלא  -  20+ שנות ניסיון.",
      },
      {
        id: "size",
        question: "מתאים לאירועים קטנים?",
        answer:
          "כן  -  מ-50 אורחים ועד אירועים גדולים. העוצמה מותאמת לאולם.",
      },
      {
        id: "combo",
        question: "אפשר לשלב אפקטים?",
        answer:
          "קונפטי, בועות TITAN, זיקוקים קרים ותותחי עשן  -  הכול מסונכרן למוזיקה.",
      },
      {
        id: "outdoor",
        question: "עובד גם בחוץ?",
        answer:
          "כן, עם מכונות בעוצמה כפולה  -  ראו בווידאו: מילוי רחבה פתוחה תוך שניות.",
      },
      {
        id: "buy",
        question: "אפשר לקנות מכונה במקום להשכיר?",
        answer: "כן  -  לפרטים פנו בוואטסאפ.",
      },
    ],
    hubCard: {
      title: "מכונת עשן כבד",
      description: "כניסות דרמטיות ורגעי שיא בטקס.",
    },
    showInEventsHub: false,
    showInAttractionsHub: true,
  },

  "attractions-confetti-cannon": {
    id: "attractions-confetti-cannon",
    slug: "events/attractions/confetti-cannon",
    category: "events",
    title: "קונפטי לאירועים",
    subtitle:
      "השכרת תותח קונפטי מקצועי  -  מטר של צבע באוויר ברגע השיא. מפעיל צמוד, CO₂ בטוח, נייר כותנה שלא מלכלך. חתונה, בר/בת מצווה וכל הארץ.",
    metaTitle: "תותח קונפטי לאירועים | קונפטי לחתונה",
    metaDescription:
      "תותח קונפטי לחתונה - ממודיעין. עד 30 מטר, צבעים מותאמים ומפעיל צמוד.",
    keywords: [
      "תותח קונפטי",
      "קונפטי לחתונה",
      "קונפטי לאירועים",
      "השכרת קונפטי",
    ],
    features: [
      "תותח מקצועי  -  קונפטי עד 30 מטר, מרחף לאט",
      "מפעיל צמוד  -  תזמון מדויק עם DJ (לא השכרת ציוד בלבד)",
      "CO₂ בלבד  -  בטוח באולמות סגורים, ללא חשמל",
      "גיבוי: 2 בלוני CO₂ + תותח חלופי",
      "לבן, זהב, צבעוני, לבבות, כסף ולוגו מותאם",
    ],
    pricing: [
      {
        name: "תותח יחיד",
        price: "הצעה בוואטסאפ",
        description: "הפעלה אחת לרגע שיא  -  מפעיל וגיבוי CO₂.",
      },
      {
        name: "חבילת WOW ★",
        price: "הצעה בוואטסאפ",
        priceNote: "הכי נמכרת",
        description: "2 תותחים  -  כניסה + שיא ריקודים. צבעים לפי בחירה.",
      },
      {
        name: "חבילת פרימיום",
        price: "הצעה בוואטסאפ",
        description: "3+ הפעלות, שילוב עם עשן / זיקוקים / בועות.",
      },
    ],
    assetsFolder: "events/attractions/confetti-cannon",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["attractions-confetti-cannon"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בתותח קונפטי לאירוע  -  אשמח להצעת מחיר",
    utmCampaign: "confetti_cannon",
    scarcityLabel: "זמינות מוגבלת לעונת האירועים",
    faqs: [
      {
        id: "indoor",
        question: "זה בטוח באולם סגור?",
        answer:
          "כן  -  פועל על CO₂ בלבד, ללא אש וללא ריח. מתאים גם לאולמות סגורים.",
      },
      {
        id: "how-many",
        question: "כמה תותחים כדאי להזמין?",
        answer:
          "אפשר להתחיל באחד. לחוויית WOW אמיתית  -  שניים או יותר (כניסה + שיא).",
      },
      {
        id: "colors",
        question: "אפשר לבחור צבעים?",
        answer: "כמובן  -  מבחר ענק של צבעים, צורות וסגנונות.",
      },
      {
        id: "power",
        question: "האם צריך חיבור חשמל?",
        answer: "לא  -  התותח פועל על CO₂.",
      },
      {
        id: "operator",
        question: "האם מגיע מפעיל?",
        answer:
          "כן. לא משכירים ציוד בלבד  -  מפעיל מתקין ולוחץ בדיוק ברגע הנכון עם ה-DJ.",
      },
      {
        id: "failure",
        question: "מה אם יש תקלה?",
        answer:
          "בדיקות לפני האירוע, גיבוי CO₂ ותותח חלופי, טכנאי זמין בטלפון, ציוד מבוטח.",
      },
      {
        id: "amount",
        question: "כמה קונפטי צריך?",
        answer:
          "תלוי בשטח, גובה האולם, פתוח/סגור ואם רוצים כיסוי מלא או אפקט נקודתי. נייעץ בוואטסאפ.",
      },
    ],
    hubCard: {
      title: "תותח קונפטי",
      description: "רגע שיא חגיגי ברחבה.",
    },
    showInEventsHub: false,
    showInAttractionsHub: true,
  },

  "attractions-cold-fireworks": {
    id: "attractions-cold-fireworks",
    slug: "events/attractions/cold-fireworks",
    category: "events",
    title: "זיקוקים קרים לאירועים",
    subtitle:
      "השכרת זיקוקים קרים לחופה או לכניסה לאולם  -  אש קרה בטוחה: ניצוצות זהובות בלי להבות, בלי עשן ובלי גלאי עשן. רגע שכולם יצלמו.",
    metaTitle: "זיקוקים קרים לאירועים | אש קרה בטוחה לאולמות",
    metaDescription:
      "זיקוקים קרים לחתונה - ממודיעין. 4 מכונות, בטוח באולם סגור, מעל 1,800 אירועים.",
    keywords: [
      "זיקוקים קרים",
      "זיקוקים קרים לחתונה",
      "זיקוקים לחופה",
      "Cold Sparklers",
      "אש קרה לאירוע",
    ],
    features: [
      "ניצוצות זהובות ללא להבות  -  מאושר בכל אולם בישראל",
      "ללא עשן, ריח או גלאי עשן",
      "4 מכונות, גובה עד 4-5 מטרים, שליטה אלחוטית",
      "מפעיל צמוד ותיאום עם DJ וצלם",
      "מתאים להצעות נישואין, חופה וכניסה",
    ],
    pricing: [
      {
        name: "חבילת בסיס",
        price: "מ-1,200 ₪",
        priceNote: "עד 2 הפעלות",
        description: "זיקוקים קרים לכניסה או רגע שיא בטקס.",
      },
      {
        name: "חבילת פרימיום ★",
        price: "הצעה בוואטסאפ",
        priceNote: "הכי נמכרת",
        description:
          "4 מכונות, גובה 4-5 מ׳, 2 הפעלות (כניסה + שיא), מפעיל צמוד. בונוס: תאורת LED.",
      },
      {
        name: "חבילת מקצועי",
        price: "מ-2,200 ₪",
        priceNote: "עד 4 הפעלות + תיאום מלא",
        description: "תכנון רגעים, תיאום טכני וליווי בשטח.",
      },
    ],
    assetsFolder: "events/attractions/cold-fireworks",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["attractions-cold-fireworks"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בזיקוקים קרים לחופה/כניסה באירוע",
    utmCampaign: "cold_fireworks",
    scarcityLabel: "זמינות מוגבלת לעונת האירועים",
    faqs: [
      {
        id: "safety",
        question: "האם זיקוקים קרים בטוחים באולם סגור?",
        answer:
          "כן לחלוטין  -  ניצוצות חמות קלות ללא להבות. לא מפעילים גלאי עשן ומאושרים בכל אולם בישראל.",
      },
      {
        id: "smell",
        question: "האם יש ריח או עשן?",
        answer: "לא  -  נקיים לגמרי. אין ריח, עשן או אפר. המקום נשאר נקי.",
      },
      {
        id: "kids",
        question: "האם ילדים יכולים להיות קרובים?",
        answer:
          "כן  -  טמפרטורה ~40°. הצוות ממקם מכונות במיקומים בטוחים שלא נגישים לילדים.",
      },
      {
        id: "duration",
        question: "כמה זמן נמשך כל הפעלה?",
        answer: "30-45 שניות לרגע שיא. ניתן מספר הפעלות לפי החבילה.",
      },
      {
        id: "venue",
        question: "האם צריך אישור מהאולם?",
        answer:
          "לא נדרש אישור מיוחד. אנחנו מתאמים מראש עם תאורן האולם.",
      },
      {
        id: "outdoor",
        question: "מתאים גם לחוץ?",
        answer:
          "בהחלט  -  חתונות בגן, בריכה ואירועים פתוחים. נראה דרמטי יותר באוויר הפתוח.",
      },
      {
        id: "vs-traditional",
        question: "מה ההבדל מזיקוקים מסורתיים?",
        answer:
          "מסורתיים = להבות אמיתיות, אסורים באולמות. קרים = ניצוצות ללא להבות, מותרים בכל מקום.",
      },
      {
        id: "size",
        question: "מתאים לאירועים קטנים?",
        answer: "כן  -  מ-50 אורחים ועד אירועים גדולים. מותאם לאולם.",
      },
      {
        id: "pricing",
        question: "איך נקבע המחיר?",
        answer:
          "לפי מספר הפעלות, גובה ואזור. הצעה מדויקת בוואטסאפ.",
      },
    ],
    hubCard: {
      title: "זיקוקים קרים",
      description: "אפקט בטוח ומרשים לחופה וכניסות.",
    },
    showInEventsHub: false,
    showInAttractionsHub: true,
  },

  "attractions-giant-balloons": {
    id: "attractions-giant-balloons",
    slug: "events/attractions/giant-balloons",
    category: "events",
    title: "בלוני ענק לרחבת הריקודים",
    subtitle:
      "אטרקציה צבעונית שממלאת את החלל - בלוני ענק מעוצבים לרחבה, כניסות וצילום, עם התקנה מסודרת ופירוק מהיר בסיום האירוע.",
    metaTitle: "בלוני ענק לאירועים וחתונות",
    metaDescription:
      "בלוני ענק לאירועים במודיעין. עיצוב מרשים, התקנה מקצועית - לכל הארץ.",
    keywords: ["בלוני ענק", "בלונים לאירוע", "אטרקציה לרחבה", "עיצוב אירוע"],
    features: [
      "בלונים בגדלים מרשימים עם עיצוב מותאם לצבעי האירוע",
      "התקנה לפני כניסת אורחים ופירוק דיסקרטי",
      "מתאים לרחבות, גינות ואזורי צילום",
      "שילוב עם תאורה, עשן ומוזיקה לרגעי שיא",
      "חבילות לפי כמות וגודל האזור",
    ],
    pricing: [
      {
        name: "עמדת בלונים סטנדרט",
        price: "מ-900 ₪",
        description: "עיצוב בסיסי לרחבה או פינת צילום.",
      },
      {
        name: "עיצוב ענק מקצועי",
        price: "מ-1,800 ₪",
        priceNote: "כולל התקנה מלאה",
        description: "כיסוי אזור רחב, צבעים מותאמים וליווי עד סוף האירוע.",
      },
    ],
    assetsFolder: "events/attractions/giant-balloons",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["attractions-giant-balloons"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בבלוני ענק לרחבה באירוע",
    utmCampaign: "giant_balloons",
    faqs: [
      {
        id: "space",
        question: "כמה מקום נדרש?",
        answer:
          "נבדוק תמונות או נבצע מדידה בשטח. יש חבילות גמישות לפי גודל הרחבה והגובה באולם.",
      },
    ],
    hubCard: {
      title: "בלוני ענק",
      description: "עיצוב צבעוני שממלא את הרחבה.",
    },
    showInEventsHub: false,
    showInAttractionsHub: true,
  },

  "attractions-led-booth": {
    id: "attractions-led-booth",
    slug: "events/stage-led-dj",
    category: "events",
    title: "השכרת עמדת LED לתקליטן ולאירועים",
    subtitle:
      "עמדת DJ LED עם מסך רציף  -  לוגו, ויז'ואלס, שידור חי ושמות החוגגים. הטרנד של 2026: להיפרד מהמפה השחורה. מ-1,500 ₪.",
    metaTitle: "השכרת עמדת LED לאירועים | עמדת DJ LED",
    metaDescription:
      "השכרת עמדת LED לאירועים במודיעין. P3.91, Resolume - חתונות ואירועי חברה.",
    keywords: [
      "עמדת LED",
      "עמדת DJ LED",
      "השכרת עמדת לד",
      "מסך LED לאירוע",
      "עמדת לד לתקליטן",
    ],
    features: [
      "מסך רציף P3.91 - עד 4,500 Nits  -  גם באור יום",
      "לוגו, VJ Loops, שידור חי, שמות חוגגים",
      "Novastar / Linsn + Resolume Arena",
      "התקנה, פירוק, טכנאי  -  הכל כלול",
      "שילוב עשן, זיקוקים קרים ובועות עשן",
    ],
    pricing: [
      {
        name: "חבילת בסיס",
        price: "מ-1,500 ₪",
        priceNote: "מסך ~2×2 מ׳",
        description: "עמדת LED, התקנה ותוכן בסיסי.",
      },
      {
        name: "חבילת פרימיום ★",
        price: "הצעה בוואטסאפ",
        priceNote: "תוכן מותאם + VJ",
        description:
          "מומלץ לחתונות ואירועי חברה  -  עיצוב אישי וויז'ואלס לפי מוזיקה.",
      },
      {
        name: "מכירה לספקים",
        price: "מ-25,000 ₪",
        description: "למפיקים, אולמות ו-DJs  -  אחריות שנה והדרכה.",
      },
    ],
    assetsFolder: "events/attractions/led-booth",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["attractions-led-booth"]),
    mediaType: "video",
    whatsappText:
      "שלום, מעוניין/ת בהשכרת עמדת LED/DJ לאירוע  -  אשמח להצעת מחיר",
    utmCampaign: "stage_led_dj",
    scarcityLabel: "הטרנד 2026  -  זמינות מוגבלת בעונת החתונות",
    faqs: [
      {
        id: "price",
        question: "כמה עולה להשכיר עמדת LED?",
        answer:
          "מ-1,500 ₪ לבסיס (מסך ~2×2 מ׳). תלוי בגודל, משך ומיקום. הצעה מדויקת תוך שעות.",
      },
      {
        id: "daylight",
        question: "נראה גם באור יום?",
        answer: "כן  -  4,500 Nits, מעולה גם בחוץ.",
      },
      {
        id: "vs-tv",
        question: "מה ההבדל ממסך טלוויזיה?",
        answer:
          "LED = מסך רציף, בהיר, P3.91, מקצועי. טלוויזיה = זול, לא מרחוק, לא ליום.",
      },
      {
        id: "install",
        question: "כמה זמן התקנה?",
        answer: "הגעה 2-3 שעות לפני, התקנה 20-30 דקות + בדיקות.",
      },
      {
        id: "included",
        question: "מה כלול?",
        answer:
          "עמדה, מחשב, מעבדים, כבלים, התקנה ופירוק, בדיקות, תמיכה 24/7, ביטוח.",
      },
      {
        id: "content",
        question: "אפשר תוכן משלנו?",
        answer: "כן  -  לוגו, MP4, תמונות, PDF. שלחו 3 ימים לפני. עיצוב מקצועי בתוספת.",
      },
      {
        id: "failure",
        question: "מה אם יש תקלה?",
        answer: "בדיקות לפני, טכנאי בטלפון תוך דקות, ציוד מבוטח.",
      },
      {
        id: "when-led",
        question: "מתי לבחור LED?",
        answer:
          "אולם גדול (100+), חוץ, מיתוג לוגו, אפקט ויזואלי  -  LED. מסך רגיל רק לאירוע קטן וחשוך.",
      },
      {
        id: "buy",
        question: "אפשר לקנות?",
        answer: "כן  -  מ-25,000 ₪, אחריות שנה, הדרכה ותמיכה.",
      },
      {
        id: "booking",
        question: "מתי להזמין?",
        answer: "3-4 שבועות מראש, בעונת החתונות מוקדם יותר.",
      },
    ],
    hubCard: {
      title: "עמדת LED / DJ",
      description: "מסך רציף, מיתוג וויז'ואלס.",
    },
    showInEventsHub: false,
    showInAttractionsHub: true,
  },

  "attractions-smoke-cannons": {
    id: "attractions-smoke-cannons",
    slug: "events/attractions/smoke-cannons-for-events",
    category: "events",
    title: "תותחי עשן לאירועים",
    subtitle:
      "עוצמה ויזואלית לרגעי השיא - תותחי עשן מקצועיים לרחבה, כניסות וטקס, עם תפעול מבוקר, בטיחות מלאה ותיאום מדויק מול DJ וצלמים.",
    metaTitle: "תותחי עשן לאירועים וחתונות",
    metaDescription:
      "תותחי עשן לאירועים - ממודיעין. אפקט דרמטי, הפעלה מקצועית וחבילות גמישות.",
    keywords: [
      "תותחי עשן",
      "עשן לאירוע",
      "אטרקציית עשן",
      "עשן לרחבה",
    ],
    features: [
      "תותחים מקצועיים עם חומרי עשן איכותיים",
      "תיאום טיימינג מדויק לרגעי שיא וכניסות",
      "עמידה בנהלי בטיחות ואוורור באולם",
      "שילוב עם תאורה, DJ וצילום",
      "חבילות לפי מספר הפעלות",
    ],
    pricing: [
      {
        name: "חבילת 3 יריות",
        price: "מ-750 ₪",
        description: "מתאים לרגע שיא בודד או כניסה.",
      },
      {
        name: "חבילת ערב",
        price: "מ-1,400 ₪",
        priceNote: "עד 8 הפעלות",
        description: "ליווי מלא לאורך האירוע עם תיאום טכני.",
      },
    ],
    assetsFolder: "events/attractions/smoke-cannons-for-events",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["attractions-smoke-cannons"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בתותחי עשן לאירוע",
    utmCampaign: "smoke_cannons",
    faqs: [
      {
        id: "difference",
        question: "מה ההבדל ממכונת עשן כבד?",
        answer:
          "תותחי עשן מיועדים לפיצוץ עשן מיידי וחד לרגעי שיא. עשן כבד מתאים יותר לכניסות ארוכות ואפקט ממושך.",
      },
    ],
    hubCard: {
      title: "תותחי עשן",
      description: "אפקט עוצמתי לרגעי שיא ברחבה.",
    },
    showInEventsHub: false,
    showInAttractionsHub: true,
  },
} as const satisfies Record<string, ServiceEntity>;

export type EventsServiceId = keyof typeof EVENTS_SERVICES;

export function getEventsService(id: EventsServiceId): ServiceEntity {
  return EVENTS_SERVICES[id];
}

export function getEventsHubLinks(): Array<{
  href: string;
  title: string;
  description: string;
}> {
  return Object.values(EVENTS_SERVICES).flatMap((s) => {
    if (!s.showInEventsHub || !s.hubCard?.title) return [];
    return [
      {
        href: `/${s.slug}`,
        title: s.hubCard.title,
        description: s.hubCard.description,
      },
    ];
  });
}

export function getAttractionsHubLinks(): Array<{
  href: string;
  title: string;
  description: string;
  badge?: string;
}> {
  return Object.values(EVENTS_SERVICES).flatMap((s) => {
    if (!s.showInAttractionsHub || !s.hubCard?.title) return [];
    return [
      {
        href: `/${s.slug}`,
        title: s.hubCard.title,
        description: s.hubCard.description,
        badge: "scarcityLabel" in s ? s.scarcityLabel : undefined,
      },
    ];
  });
}

/** ─── Video registry ─── */

export const VIDEO_SERVICES = {
  "video-hub": {
    id: "video-hub",
    slug: "video",
    category: "video",
    title: "הפקות וידאו מקצועיות - סיפור שמוכר",
    subtitle:
      "צילום והפקת וידאו לאירועים, סרטי תדמית לעסקים ומצגות וידאו מדויקות - צוות יצירתי, ציוד מתקדם ועריכה שמשאירה רושם מקצועי.",
    metaTitle: "הפקות וידאו וצילום במודיעין",
    metaDescription:
      "הפקות וידאו במודיעין. צילום אירועים, סרטי תדמית ומצגות - לכל הארץ.",
    keywords: [
      "הפקות וידאו",
      "צילום אירועים",
      "סרט תדמית",
      "מצגת וידאו",
    ],
    features: [
      "צילום והפקה לאירועים פרטיים, עסקיים ומוסדיים",
      "סרטי תדמית עם מסר מותגי ברור ועריכה קולנועית",
      "מצגות וידאו מדויקות לכנסים, אירועים והשקות",
      "תסריט, בימוי, צילום, עריכה וצבע במקום אחד",
      "מסירה מותאמת לרשתות, אתרים וקמפיינים דיגיטליים",
    ],
    assetsFolder: "studio/hub",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["video-hub"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין לשמוע על שירותי וידאו והפקה",
    utmCampaign: "video_hub",
    faqs: [],
    hubCard: null,
    showInVideoHub: false,
    showInPhotographyHub: false,
  },

  "video-event-filming": {
    id: "video-event-filming",
    slug: "video/event-filming",
    category: "video",
    title: "צילום והפקת וידאו לאירועים",
    subtitle:
      "תיעוד קולנועי שמחזיק את האנרגיה של האירוע - מכניסות ורגעי שיא ועד ערב הריקודים. צוות דיסקרטי, ציוד מתקדם ועריכה שמספרת את הסיפור שלכם.",
    metaTitle: "צילום וידאו לאירועים | הפקה מקצועית",
    metaDescription:
      "צילום וידאו לאירועים במודיעין. חתונות, חברות וחגיגות - עריכה ומסירה מהירה.",
    keywords: [
      "צילום אירועים",
      "וידאו לחתונה",
      "הפקת וידאו לאירוע",
      "צלם וידאו לאירוע",
    ],
    features: [
      "כיסוי מלא: הכנות, טקס, קבלת פנים ורחבה",
      "צילום רב-מצלמות לזוויות עשירות ודינמיות",
      "עריכה קצבית עם מוזיקה מותאמת לאופי האירוע",
      "גרסאות קצרות לרשתות וגרסת ארוכה לזיכרון",
      "תיאום מול DJ, מנהל אירוע וצלמי סטילס",
    ],
    assetsFolder: "photography/wedding",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["video-event-filming"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בשירותי צילום והפקת וידאו לאירוע",
    utmCampaign: "video_event_filming",
    faqs: [
      {
        id: "vef-delivery",
        question: "תוך כמה זמן מקבלים את הסרטון?",
        answer:
          "גרסה ראשונה מוכנה בדרך כלל תוך 2-3 שבועות מיום האירוע. גרסה קצרה לרשתות - לעיתים תוך כמה ימים. מועד מדויק מסוכם מראש בהתאם לעומס ולאירוע.",
      },
      {
        id: "vef-formats",
        question: "באיזה פורמטים מוסרים את החומר?",
        answer:
          "מסירה בקבצי MP4 באיכות גבוהה, מותאמת לשיתוף ברשתות, הקרנה ואחסון. אם צריך פורמטים ספציפיים לשידור או ארכיון - מסכמים מראש.",
      },
      {
        id: "vef-cameras",
        question: "כמה מצלמות עובדות במקביל?",
        answer:
          "בדרך כלל 2 מצלמות לכיסוי רב-זוויתי - אחת לרגעים הרשמיים ואחת לתיעוד ספונטני. לאירועים גדולים עם מסלולים מורכבים אפשר להוסיף מצלמה שלישית.",
      },
      {
        id: "vef-edit",
        question: "מה כלול בעריכה הסופית?",
        answer:
          "עריכה קצבית עם מוזיקה מותאמת, תיקוני צבע, איזון סאונד וסנכרון. גרסת ארוכה לזיכרון וגרסה קצרה לשיתוף - כמו שסוכם.",
      },
    ],
    hubCard: {
      title: "צילום אירועים",
      description: "תיעוד קולנועי מלא לכל רגע משמעותי.",
    },
    showInVideoHub: true,
    showInPhotographyHub: false,
  },

  "video-corporate": {
    id: "video-corporate",
    slug: "video/corporate-video",
    category: "video",
    title: "סרטי תדמית לעסקים",
    subtitle:
      "מסר מותגי חד, מראה יוקרתי ותוצאה שמניעה לפעולה - סרטי תדמית לחברות, יזמים וארגונים עם תסריט מדויק, הפקה מלאה ועריכה ברמת שידור.",
    metaTitle: "סרט תדמית לעסק | הפקת וידאו מקצועית",
    metaDescription:
      "סרט תדמית לעסקים - ממודיעין. אפיון מסר, צילום ועריכה לקמפיין ורשתות.",
    keywords: [
      "סרט תדמית",
      "וידאו לעסק",
      "הפקת תדמית",
      "סרטון שיווקי",
    ],
    features: [
      "פגישת אפיון לבניית מסר, קהל יעד וקריאה לפעולה",
      "תסריט, storyboard והפקה באולפן ובשטח",
      "צילום עם תאורה וסאונד ברמה מקצועית",
      "עריכה, גרפיקה, כתוביות וגרסאות פרסום",
      "מסירה בפורמטים מותאמים לאתר, LinkedIn ומטא",
    ],
    assetsFolder: "video/corporate-video",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["video-corporate-video"]),
    mediaType: "video",
    whatsappText:
      "שלום, נשמח לקבל פרטים והצעת מחיר לסרט תדמית לעסק",
    utmCampaign: "video_corporate",
    faqs: [
      {
        id: "corp-brief",
        question: "מה צריך להכין לפני פגישת ה-briefing?",
        answer:
          "כדאי לדעת את קהל היעד, את המסר המרכזי שרוצים להעביר ואת הפלטפורמות שבהן יופיע הסרטון. ככל שיש לכם דוגמאות לסרטים שאוהבים - מביאים. על השאר נדאג יחד.",
      },
      {
        id: "corp-length",
        question: "מה האורך המומלץ לסרט תדמית?",
        answer:
          "לרשתות חברתיות ואתרים - 60 עד 90 שניות עובדים הכי טוב. לשימוש בכנסים או הצגות - אפשר להגיע ל-3 דקות. האורך הנכון תלוי במסר ובמיקום.",
      },
      {
        id: "corp-revisions",
        question: "כמה סבבי עריכה כלולים?",
        answer:
          "תהליך העבודה כולל 2 סבבי עריכה לאחר גרסה ראשונה. שינויים קלים (כתוביות, מוזיקה, חיתוכים) - מהירים. שינויי כיוון גדולים לאחר אישור - מתומחרים בנפרד.",
      },
      {
        id: "corp-rights",
        question: "מי מחזיק בזכויות לסרט?",
        answer:
          "הסרטון הסופי מועבר לכם לשימוש מלא ללא הגבלה. חומרי גלם (raw footage) שמורים אצלנו לתקופה מוגדרת - לפנות אם צריך עריכה נוספת.",
      },
    ],
    hubCard: {
      title: "סרטי תדמית",
      description: "מיתוג חזק עם מראה מקצועי.",
    },
    showInVideoHub: true,
    showInPhotographyHub: false,
  },

  "video-presentation": {
    id: "video-presentation",
    slug: "video/presentation",
    category: "video",
    title: "מצגות וידאו מקצועיות",
    subtitle:
      "הצגת תוכן ברורה, מרשימה ומדויקת - מצגות וידאו לאירועים, כנסים והשקות מוצר, עם עריכה נקייה, מיתוג עקבי וטיימינג שמחזיק את הקהל.",
    metaTitle: "מצגת וידאו ומצגת גדילה AI | לאירועים וכנסים",
    metaDescription:
      "מצגות וידאו מקצועיות במודיעין. מצגת גדילה ב-AI לכנסים ואירועים.",
    keywords: [
      "מצגת וידאו",
      "מצגת גדילה",
      "קליפ גדילה AI",
      "וידאו לכנס",
      "הפקת מצגת",
      "סרטון לאירוע עסקי",
    ],
    features: [
      "התאמת תוכן למסך גדול ולשידור דיגיטלי",
      "עריכת סרטונים, אנימציה וכתוביות ממותגות",
      "שילוב לוגו, צבעי מותג ומסרים מרכזיים",
      "סאונד נקי, קריינות ומוזיקה מותאמת",
      "תיאום טכני מול מפעילי אולם והגברה",
    ],
    assetsFolder: "podcast",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["video-presentation"]),
    mediaType: "video",
    whatsappText: "שלום, מעוניין בהפקת מצגת וידאו מקצועית לאירוע",
    utmCampaign: "video_presentation",
    faqs: [
      {
        id: "pres-what",
        question: "מה ההבדל בין מצגת פאוורפוינט למצגת וידאו?",
        answer:
          "מצגת פאוורפוינט דורשת מפעיל ועלולה להתקשה בהקרנות. מצגת וידאו מתנגנת כקובץ אחד, עם מוזיקה, אנימציה וקצב מדויק - בלי תקלות, בלי לחיצות, מושלמת לאירוע.",
      },
      {
        id: "pres-delivery",
        question: "באיזה פורמט מקבלים את הקובץ הסופי?",
        answer:
          "MP4 ברזולוציה גבוהה (Full HD או 4K לפי הצורך), מוכן להקרנה מכל מחשב, מקרן או מסך. מסופקות גם גרסאות לפלטפורמות שונות אם רלוונטי.",
      },
      {
        id: "pres-screen",
        question: "האם המצגת מותאמת לגודל המסך באולם?",
        answer:
          "כן - לפני ההפקה מבררים את יחס המסך ורזולוציית ההקרנה של האולם ומייצרים בהתאם. אם אין מידע - עובדים עם 16:9 שמתאים לרוב המסכים והמקרנים.",
      },
    ],
    hubCard: {
      title: "מצגות וידאו",
      description: "תוכן ממותג שמחזיק את הקהל.",
    },
    showInVideoHub: true,
    showInPhotographyHub: false,
  },

  "video-photo-slideshow": {
    id: "video-photo-slideshow",
    slug: "photo-slideshow",
    category: "video",
    title: "מצגת תמונות מרגשת לאירועים",
    subtitle:
      "תמונות משפחתיות ישנות, זיכרונות מתוקים ורגעים מיוחדים  -  מהילדות ועד היום. הופכים למצגת קולנועית שתוקרן באירוע ותישאר בלב האורחים.",
    metaTitle: "מצגת תמונות ומצגת גדילה AI | עריכה קולנועית תוך 48 שעות",
    metaDescription:
      "מצגת תמונות ומצגת גדילה במודיעין. חתונות, בר/בת מצווה - עריכה קולנועית.",
    keywords: [
      "מצגת תמונות לאירוע",
      "מצגת גדילה",
      "קליפ גדילה AI",
      "מצגת מילדות",
      "מצגת בר מצווה AI",
      "סלייד שואו",
      "עריכת מצגת",
      "מצגת לחתונה",
      "מצגת לבר מצווה",
      "מצגת יום הולדת",
    ],
    features: [
      "עריכה קולנועית  -  מוכן להקרנה תוך 48 שעות",
      "כותרות פתיחה וסיום + ליווי אישי",
      "שיפור איכות תמונות ישנות (כולל AI)",
      "מוזיקה, מעברים וטקסטים מותאמים לאירוע",
      "Full HD 1080p  -  קובץ מוכן למקרן ולטלוויזיה",
    ],
    assetsFolder: "video/photo-slideshow",
    playlistEmbedUrl: youtubeEmbedUrl(
      YOUTUBE_SERVICE_EMBED_IDS["video-photo-slideshow"],
    ),
    mediaType: "video",
    whatsappText:
      "שלום, מעוניין/ת במצגת תמונות לאירוע. אשמח לשמוע על החבילות והזמינות.",
    utmCampaign: "photo_slideshow",
    pricing: [
      {
        name: "חבילת Basic  -  קצר וקולע",
        price: "הצעה בוואטסאפ",
        priceNote: "אירועים אינטימיים ומצגות ממוקדות",
        description:
          "עד 50 תמונות עם הנפשה בסיסית, שילוב עד 5 סרטונים ו-5 סרטוני ברכות, שיר רקע אחד ופתיח מונפש.",
      },
      {
        name: "חבילת Standard  -  הקלאסית",
        price: "הצעה בוואטסאפ",
        priceNote: "הבחירה הפופולרית  -  ימי הולדת ואירועים משפחתיים",
        description:
          "עד 80 תמונות עם 2 סוגי הנפשות מתקדמות, עד 2 שירי רקע, שילוב עד 5 סרטונים ו-5 סרטוני ברכות.",
      },
      {
        name: "חבילת Premium  -  הכי משתלמת",
        price: "הצעה בוואטסאפ",
        priceNote: "Best Value  -  אירועים גדולים",
        description:
          "עד 120 תמונות עם 8 סוגי הנפשות, עד 2 שירי רקע, שילוב עד 10 סרטונים ו-10 סרטוני ברכות.",
      },
      {
        name: "חבילת Premium Extra  -  ה-Show המושלם",
        price: "הצעה בוואטסאפ",
        priceNote: "בלעדי: צביעת תמונות שחור-לבן ב-AI",
        description:
          "עד 150 תמונות עם 8 הנפשות, 6 שירי רקע, עד 15 סרטונים ו-20 ברכות. טכנולוגיה מהשורה הראשונה.",
      },
    ],
    faqs: [
      {
        id: "whatsapp-videos",
        question: "האם אפשר להוסיף סרטונים מהוואטסאפ?",
        answer:
          "כן. שלחו את קבצי הוידאו ונשלב אותם בצורה חלקה בתוך המצגת.",
      },
      {
        id: "send-photos",
        question: "איך שולחים את התמונות?",
        answer:
          "דרך Google Drive, WeTransfer, Dropbox  -  כל דרך שנוחה. גם סריקת תמונות ישנות עובדת מצוין.",
      },
      {
        id: "low-quality",
        question: "התמונות באיכות נמוכה, זה יעבוד?",
        answer:
          "כן. משפרים איכות בעזרת AI ועריכה. גם תמונות ישנות וסרוקות יראו טוב.",
      },
      {
        id: "short-clips",
        question: "אפשר להוסיף קטעי וידאו קצרים?",
        answer:
          "כן. יש תוספת של 100 ₪  -  מוסיף המון לחוויה (כלול בחלק מהחבילות).",
      },
      {
        id: "download-link",
        question: "האם מקבלים קישור להורדה?",
        answer:
          "כן. קישור קבוע לקובץ באיכות מלאה  -  למחשב או Disk-on-key.",
      },
      {
        id: "help",
        question: "האם יש עזרה בהכנת המצגת?",
        answer:
          "בטח. אתם מספרים את הוויז'ן  -  אנחנו מוציאים את המצגת לאור בצורה המקצועית והיפה ביותר.",
      },
      {
        id: "timeline",
        question: "כמה זמן לוקח להכין מצגת?",
        answer:
          "בין 1-3 ימי עסקים. אפשרות אקספרס עד 24 שעות  -  לפרטים צרו קשר.",
      },
      {
        id: "delivery",
        question: "מה כלול בהזמנת מצגת לאירוע?",
        answer:
          "סרטון הקרנה מושלם לאולם, מקרן או טלוויזיה. נשאל את השאלות הנכונות כדי לכוון אתכם לתוצאה מדויקת.",
      },
      {
        id: "formats",
        question: "אילו פורמטים אפשר לשלוח?",
        answer:
          "תמונות (JPG, PNG), סרטונים (MP4, MOV), מצגות (PDF, PPT), לוגו (PNG, SVG) ועוד. שלחו 3 ימים לפני האירוע.",
      },
      {
        id: "revisions",
        question: "מה קורה אם יש תיקונים?",
        answer:
          "המחיר כולל סבב תיקונים אחד. נקשיב להערות ונתקן עד שתהיו מרוצים ב-100%.",
      },
      {
        id: "photo-count",
        question: "כמה תמונות צריך?",
        answer:
          "הכל אפשרי  -  20, 50 או 100 תמונות. נתאים חבילה לפי כמות החומר והאורך הרצוי.",
      },
    ],
    hubCard: {
      title: "מצגת תמונות לאירוע",
      description: "מהזיכרונות שלכם לסרט מרגש  -  עריכה קולנועית.",
    },
    showInVideoHub: true,
    showInPhotographyHub: true,
  },

  "video-reel-factory": {
    id: "video-reel-factory",
    slug: "business/reel-factory",
    category: "video",
    title: "מפעל הרילס לספקי אירועים",
    subtitle:
      "סיימתם אירוע ב-2 בלילה - מקבלים רילס Rave ערוך ב-12 בצהריים. AI + עורכי וידאו, מנוי חודשי ל-DJ, צלמים, מפיקים ואטרקציות.",
    metaTitle: "מפעל רילס לספקים | The Reel Factory",
    metaDescription:
      "עריכת רילס לספקי אירועים במודיעין. Rave 24 שעות ומנוי Content Hub.",
    keywords: [
      "רילס לספקי אירועים",
      "עריכת וידאו לדיג'יי",
      "פרומו אירועים",
      "Content Hub לספקים",
      "The Reel Factory",
    ],
    features: [
      "פס ייצור 24 שעות - העלאה עד 04:00, מסירה 12:00",
      "ביט-סינק, אפקטים ויזואליים, צבע וסאונד מנורמל",
      "מנוי חודשי: 4-8 פרומואים + פוסטים שיווקיים",
      "מיועד ל-DJ, צלמים, מפיקים ומפעילי אטרקציות",
      "שליחת חומר גולמי בוואטסאפ, Drive או עמוד העלאה",
    ],
    assetsFolder: "video/corporate-video",
    playlistEmbedUrl: youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["video-reel-factory"]),
    mediaType: "video",
    whatsappText:
      "שלום, אני ספק אירועים ומעוניין/ת במפעל הרילס - אשמח לשמוע על חבילות Rave 24h ומנוי Content Hub",
    utmCampaign: "reel_factory_hub",
    pricing: [
      {
        name: "פרומו רילס בודד",
        price: "950 ₪",
        priceNote: "לפני מע״מ - 2-3 ימי עסקים",
        description: "חיתוך מ-5-10 קליפים גולמיים + כתוביות בסיסיות.",
      },
      {
        name: "Rave 24 שעות ★",
        price: "1,400 ₪",
        priceNote: "לפני מע״מ - מסירה עד 12:00",
        description:
          "ביט-סינק, אפקטים על הביט, צבע וסאונד - רילס שעושה חשק לסגור איתו.",
        featured: true,
        badge: "הכי מבוקש",
      },
      {
        name: "Content Hub בסיס",
        price: "2,800 ₪",
        priceNote: "לחודש - לפני מע״מ",
        description: "4 פרומואים ערוכים + פוסטים שיווקיים לכל אירוע.",
      },
      {
        name: "Content Hub פרו",
        price: "4,500 ₪",
        priceNote: "לחודש - לפני מע״מ",
        description: "8 פרומואים + פוסטים + כיתובים מותאמים לכל פלטפורמה.",
      },
    ],
    faqs: [
      {
        id: "rf-film",
        question: "מה צריך לצלם מהרחבה?",
        answer:
          "5-10 קליפים של 3-15 שניות - אנרגיה, קהל, ציוד. מספיק מהטלפון.",
      },
      {
        id: "rf-deadline",
        question: "עד מתי מעלים ל-Rave 24h?",
        answer: "עד 04:00 בבוקר לאחר האירוע = מסירה עד 12:00 בצהריים.",
      },
      {
        id: "rf-sub",
        question: "חייבים מנוי?",
        answer:
          "לא. אפשר פרומו בודד או Rave לפי אירוע. מנוי משתלם מ-3 אירועים בחודש.",
      },
      {
        id: "rf-upload",
        question: "איך שולחים חומר?",
        answer: "וואטסאפ, Drive, Dropbox או עמוד שליחת הקבצים באתר.",
      },
    ],
    hubCard: {
      title: "מפעל רילס לספקים",
      description: "Rave 24 שעות + מנוי Content Hub לפרומואים.",
    },
    showInVideoHub: true,
    showInPhotographyHub: false,
  },
} as const satisfies Record<string, ServiceEntity>;

export type VideoServiceId = keyof typeof VIDEO_SERVICES;

export function getVideoService(id: VideoServiceId): ServiceEntity {
  return VIDEO_SERVICES[id];
}

export function getVideoHubLinks(): Array<{
  href: string;
  title: string;
  description: string;
}> {
  return Object.values(VIDEO_SERVICES).flatMap((s) => {
    if (!s.showInVideoHub || !s.hubCard?.title) return [];
    return [
      {
        href: `/${s.slug}`,
        title: s.hubCard.title,
        description: s.hubCard.description,
      },
    ];
  });
}

/** ─── Photography registry ─── */

export const PHOTOGRAPHY_SERVICES = {
  "photography-hub": {
    id: "photography-hub",
    slug: "photography",
    category: "photography",
    title: "צילום מקצועי - רגעים שנשארים לנצח",
    subtitle:
      "צילום חתונות ואירועים בסגנון נקי, מכובד ומדויק - תיעוד אמיתי של הרגעים, האנשים והאווירה, עם מסירה מסודרת ואיכות הדפסה גבוהה.",
    metaTitle: "צילום חתונות ואירועים במודיעין",
    metaDescription:
      "צילום חתונות ואירועים במודיעין. סגנון מקצועי, עריכה וחבילות גמישות.",
    keywords: [
      "צילום חתונות",
      "צילום אירועים",
      "צלם לאירוע",
      "צילום כנסים",
    ],
    features: [
      "צילום חתונות עם סגנון טבעי ומכובד",
      "צילום אירועים, כנסים ומסיבות עסקיות",
      "עריכה מקצועית ומסירה דיגיטלית מסודרת",
      "ליווי תכנוני לפני האירוע",
      "אפשרות לשלב עם שירותי וידאו מהסטודיו",
    ],
    assetsFolder: "photography/wedding",
    playlistEmbedUrl: null,
    mediaType: "gallery",
    whatsappText: "שלום, מעוניין לשמוע על חבילות צילום",
    utmCampaign: "photography_hub",
    faqs: [],
    hubCard: null,
    showInVideoHub: false,
    showInPhotographyHub: false,
  },

  "photography-wedding": {
    id: "photography-wedding",
    slug: "photography/wedding",
    category: "photography",
    title: "צלם חתונות מומלץ לאירועים קטנים",
    subtitle:
      "צילום מקצועי לחתונות דתיות ואירועים אינטימיים במחיר הוגן  -  מחירים שקופים החל מ-3,500 ₪, כולל מע״מ ועריכה בסיסית.",
    metaTitle: "צלם חתונות דתי | אירועים קטנים מ-3,500 ₪",
    metaDescription:
      "צלם חתונות דתי במודיעין. אירועים קטנים מ-3,500 ₪ - עריכה כלולה.",
    keywords: [
      "צלם חתונות",
      "צילום חתונה",
      "צלם חתונות דתי",
      "צילום אירועים קטנים",
      "צלם לאירוע קטן",
    ],
    features: [
      "התמחות בחתונות דתיות ואירועים אינטימיים",
      "נוכחות דיסקרטית  -  אתם מרגישים טבעי, התמונות מספרות את הסיפור",
      "מחירון שקוף  -  כולל מע״מ ועריכה בסיסית, בלי תוספות נסתרות",
      "תמונות ראשונות תוך 48 שעות - גלריה מלאה תוך 2-3 שבועות",
      "תשלומים ב-3-6 תשלומים ללא ריבית (בתיאום)",
    ],
    pricing: [
      {
        name: "חבילת בסיס",
        price: "מ-3,500 ₪",
        priceNote: "כולל מע״מ ועריכה בסיסית",
        description: "אירוע קטן  -  צילום מלא ועריכה של תמונות נבחרות.",
      },
      {
        name: "חבילה מורחבת",
        price: "הצעה בוואטסאפ",
        description: "כיסוי מורחב, יותר שעות ועריכה מעמיקה  -  לפי האירוע.",
      },
      {
        name: "אלבום והדפסות",
        price: "בתוספת תשלום",
        description: "אלבומים מעוצבים והדפסות איכות  -  חבילה אישית.",
      },
    ],
    assetsFolder: "photography/wedding",
    playlistEmbedUrl: null,
    mediaType: "gallery",
    whatsappText:
      "שלום, מעוניין/ת בצלם לחתונה/אירוע קטן  -  אשמח להצעת מחיר",
    utmCampaign: "photography_wedding",
    faqs: [
      {
        id: "booking",
        question: "כמה זמן מראש צריך להזמין?",
        answer:
          "מומלץ 3-4 חודשים מראש, בעונת החתונות (אפריל-אוקטובר) אפילו חצי שנה לתאריכים מבוקשים.",
      },
      {
        id: "religious",
        question: "האם אתם מצלמים אירועים דתיים?",
        answer:
          "כן  -  זו ההתמחות העיקרית. מכבדים מסורת, יודעים מתי לצלם ומתי לתת לרגע להיות פרטי.",
      },
      {
        id: "included",
        question: "מה כלול במחיר?",
        answer:
          "מע״מ, צילום מלא של האירוע ועריכה בסיסית של תמונות נבחרות. אלבומים והדפסות בתוספת.",
      },
      {
        id: "payments",
        question: "האם ניתן לשלם בתשלומים?",
        answer: "כן  -  3 עד 6 תשלומים ללא ריבית, בתיאום מראש.",
      },
      {
        id: "delivery",
        question: "כמה זמן לוקח לקבל את התמונות?",
        answer:
          "תמונות ראשונות תוך 48 שעות. גלריה מלאה תוך 2-3 שבועות (תלוי בגודל האירוע).",
      },
      {
        id: "small",
        question: "האם מתאים לאירועים קטנים?",
        answer:
          "בהחלט  -  אירועים קטנים הם ההתמחות שלנו. כל אירוע מקבל יחס אישי ומלא.",
      },
    ],
    hubCard: {
      title: "צילום חתונות",
      description: "תיעוד רגשי ואסתטי לכל הרגעים.",
    },
    showInVideoHub: false,
    showInPhotographyHub: true,
  },

  "photography-events": {
    id: "photography-events",
    slug: "photography/events",
    category: "photography",
    title: "צילום אירועים וכנסים",
    subtitle:
      "תיעוד סטילס מקצועי לאירועי חברה, כנסים, השקות ומסיבות - נוכחות מהירה, תמונות איכותיות ומסירה שמתאימה לדוחות, רשתות ויחסי ציבור.",
    metaTitle: "צילום אירועים וכנסים | סטילס מקצועי",
    metaDescription:
      "צילום סטילס לאירועים במודיעין. כנסים והשקות - עריכה מהירה לשיווק.",
    keywords: [
      "צילום כנסים",
      "צילום אירוע עסקי",
      "צלם לאירוע חברה",
      "צילום סטילס",
    ],
    features: [
      "כיסוי דינמי של במה, קהל ורגעי שיא",
      "צילום פורטרטים, קבוצות ונטוורקינג",
      "עריכה מהירה לשימוש מיידי ברשתות",
      "מסירה בפורמטים מותאמים לדפוס ודיגיטל",
      "שילוב עם שירותי וידאו ותדמית מהסטודיו",
    ],
    assetsFolder: "photography/wedding",
    playlistEmbedUrl: null,
    mediaType: "gallery",
    whatsappText: "שלום, אשמח לקבל הצעת מחיר לצילום סטילס לאירוע",
    utmCampaign: "photography_events",
    faqs: [
      {
        id: "phev-how-many",
        question: "כמה תמונות מקבלים?",
        answer:
          "אירוע של כמה שעות מניב בדרך כלל מאות תמונות ערוכות. המספר המדויק תלוי באורך האירוע ובמה שסוכם - מה שחשוב זה שכל רגע משמעותי מכוסה.",
      },
      {
        id: "phev-delivery",
        question: "תוך כמה זמן מוסרים את התמונות?",
        answer:
          "עריכה ומסירה של גלריה מלאה בדרך כלל תוך 5-10 ימי עסקים. לאירועים עם לוחות זמנים קצרים לפרסום - אפשר לתאם מסירה מהירה יותר של חלק מהתמונות.",
      },
      {
        id: "phev-rights",
        question: "האם אנחנו יכולים להשתמש בתמונות לפרסום?",
        answer:
          "כן. התמונות המסופקות מועברות לשימוש מלא - רשתות חברתיות, אתר, דוחות ויחסי ציבור. שימוש מסחרי נרחב (שלטי חוצות, קמפיינים) מוסכם בנפרד.",
      },
      {
        id: "phev-style",
        question: "איזה סגנון צילום - ריאליסטי או מבוים?",
        answer:
          "שניהם. ברגעים טבעיים - צילום דיסקרטי שתופס את האנרגיה האמיתית. לתמונות קבוצתיות ופורטרטים - מסגרנו ומכוונים. התוצאה שילוב שמשרת גם ארכיון וגם שיווק.",
      },
    ],
    hubCard: {
      title: "צילום אירועים וכנסים",
      description: "סטילס מקצועי לכל סוג אירוע.",
    },
    showInVideoHub: false,
    showInPhotographyHub: true,
  },
} as const satisfies Record<string, ServiceEntity>;

export type PhotographyServiceId = keyof typeof PHOTOGRAPHY_SERVICES;

export function getPhotographyService(id: PhotographyServiceId): ServiceEntity {
  return PHOTOGRAPHY_SERVICES[id];
}

export function getPhotographyHubLinks(): Array<{
  href: string;
  title: string;
  description: string;
}> {
  return Object.values(PHOTOGRAPHY_SERVICES).flatMap((s) => {
    if (!s.showInPhotographyHub || !s.hubCard?.title) return [];
    return [
      {
        href: `/${s.slug}`,
        title: s.hubCard.title,
        description: s.hubCard.description,
      },
    ];
  });
}
