import type { FAQItem } from "@/components/ui/FAQAccordion";

export type AudienceLandingService = {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  priceHint?: string;
  audienceNote?: string;
};

export type AudienceLandingGroup = {
  id: string;
  title: string;
  description: string;
  services: readonly AudienceLandingService[];
};

export type AudienceLandingConfig = {
  slug: string;
  kicker: string;
  h1: string;
  lead: string;
  crossLink?: { before: string; href: string; label: string; after: string };
  groups: readonly AudienceLandingGroup[];
  faqs: readonly FAQItem[];
  whatsappText: string;
  utmCampaign: string;
};

export const FOR_COUPLES_LANDING: AudienceLandingConfig = {
  slug: "for-couples",
  kicker: "לזוגות וחתונות",
  h1: "מה מתאים לזוג שמתכנן חתונה או מתנה מיוחדת?",
  lead:
    "שיר במתנה, DJ לערב, צילום ואפקטים - הכול עם תיאום אחד ומחיר שקוף. תגובה תוך 24 שעות, ליווי טכני מלא.",
  crossLink: {
    before: "יוצרי תוכן ומוזיקה? ראו ",
    href: "/for-creators",
    label: "מסלול ליוצרים",
    after: ".",
  },
  groups: [
    {
      id: "song-gift",
      title: "שיר ומתנה",
      description: "הקלטה באולפן במודיעין - שיר לחתונה, ברכה או מתנה מרגשת.",
      services: [
        {
          id: "wedding-song",
          icon: "💍",
          title: "הקלטת שיר לחתונה",
          description:
            "הקלטה מודרכת, מיקס ומסירה ב-WAV ו-MP3. קובץ מוכן לפני האירוע.",
          href: "/studio/recording-song-modiin",
          priceHint: "חבילת שיר באולפן",
        },
        {
          id: "blessing",
          icon: "🎤",
          title: "ברכה מוקלטת לחתונה",
          description: "ברכה קצרה או קליפ - עריכה כלולה, מוכן לשידור.",
          href: "/studio/blessings/bride-groom-blessing",
        },
        {
          id: "voucher",
          icon: "🎁",
          title: "שובר מתנה לאולפן",
          description: "מתנה לזוג לפני החתונה - שעה באולפן או חבילת שיר.",
          href: "/voucher",
        },
      ],
    },
    {
      id: "wedding-night",
      title: "ערב החתונה",
      description: "DJ, אפקטים ותאורה - ספק אחד שמכיר את כל הציוד.",
      services: [
        {
          id: "dj",
          icon: "🎧",
          title: "DJ לחתונה",
          description: "הגעה לפני האורחים, בדיקת סאונד, עד 7 שעות הפעלה.",
          href: "/events/dj-events",
        },
        {
          id: "packages",
          icon: "✨",
          title: "חבילות DJ + אטרקציות",
          description: "עשן, זיקוקים, קונפטי - חיסכון של 20-30% בחבילה משולבת.",
          href: "/events/wedding-attractions-packages",
          priceHint: 'חבילת "פסטיבל" מ-15,000 ₪',
        },
        {
          id: "photo",
          icon: "📸",
          title: "צילום חתונה",
          description: "צילומי זוגיות, יום החתונה ואלבום דיגיטלי.",
          href: "/photography/wedding",
        },
      ],
    },
  ],
  faqs: [
    {
      id: "couples-timeline",
      question: "כמה זמן לפני החתונה צריך להזמין שיר או DJ?",
      answer:
        "שיר באולפן - מומלץ 2-3 שבועות לפני. DJ ואטרקציות - 2-3 חודשים מראש בעונת החתונות. תמיד אפשר לבדוק זמינות בוואטסאפ תוך 24 שעות.",
    },
    {
      id: "couples-one-vendor",
      question: "אפשר לשלב שיר, DJ ואפקטים אצל אותו ספק?",
      answer:
        "כן. חבילות משולבות חוסכות תיאום וכסף - ה-DJ מכיר את האפקטים ויודע מתי להפעיל כל אחד.",
    },
    {
      id: "couples-price",
      question: "האם המחירים כוללים מע״מ?",
      answer:
        "המחירים באתר לפני מע״מ (+18%). הצעה סופית בוואטסאפ או בהזמנה המקוונת - בלי הפתעות.",
    },
  ],
  whatsappText: "שלום, מתכננים חתונה ורוצים הצעה לשיר / DJ / חבילה משולבת",
  utmCampaign: "for_couples_hub",
};

export const FOR_CREATORS_LANDING: AudienceLandingConfig = {
  slug: "for-creators",
  kicker: "ליוצרים ומוזיקאים",
  h1: "מה מתאים ליוצר שרוצה להקליט, לערוך או ללמוד?",
  lead:
    "אולפן במודיעין, מיקס מקוון, פודקאסט וקורסים - איכות אנושית בלי רובוטיקה. תמיכה טכנית מלאה, מסירה תוך 24 שעות.",
  crossLink: {
    before: "מתכננים חתונה או מתנה? ראו ",
    href: "/for-couples",
    label: "מסלול לזוגות",
    after: ".",
  },
  groups: [
    {
      id: "record-mix",
      title: "הקלטה ועריכה",
      description: "אולפן חומרה במודיעין או שליחת קבצים לעריכה מרחוק.",
      services: [
        {
          id: "studio",
          icon: "🎙️",
          title: "אולפן הקלטות",
          description: "שירה, דיבור, פודקאסט - חדר שקט וליווי במקום.",
          href: "/studio/recording-studio",
          priceHint: "שעת אולפן",
        },
        {
          id: "podcast",
          icon: "🎧",
          title: "פודקאסט מלא",
          description: "הקלטה, עריכה והפצה - פרק מוכן לספוטיפיי.",
          href: "/podcast/podcast-recording",
        },
        {
          id: "online-mix",
          icon: "🎚️",
          title: "מיקס ומאסטרינג אונליין",
          description: "שולחים סטמים, מקבלים מיקס מקצועי עם ליווי.",
          href: "/online/vocal-fix/mixing",
        },
      ],
    },
    {
      id: "learn-grow",
      title: "לימוד ותוכן",
      description: "קורסים פרטיים והפקת תוכן לרשתות.",
      services: [
        {
          id: "dj-course",
          icon: "🎛️",
          title: "קורס DJ והפקה",
          description: "שיעור פרטי באולפן - מיקס, ביטים ופרוטוקול NeverMind.",
          href: "/academy/dj-course",
          priceHint: "החל מ-990 ₪",
        },
        {
          id: "music-production",
          icon: "🎹",
          title: "הפקה מוזיקלית",
          description: "ליווי מקצועי לסינגל, EP או פרויקט מלא.",
          href: "/academy/music-production",
        },
        {
          id: "portfolio",
          icon: "🎬",
          title: "תיק עבודות",
          description: "דוגמאות מהאולפן, האירועים והפודקאסטים.",
          href: "/portfolio",
        },
      ],
    },
  ],
  faqs: [
    {
      id: "creators-gear",
      question: "צריך ציוד משלי להקלטה באולפן?",
      answer:
        "לא. האולפן מצויד במיקרופונים, אוזניות וממשקים מקצועיים. מביאים רק את עצמכם ואת החומר.",
    },
    {
      id: "creators-remote",
      question: "אפשר לערוך בלי להגיע פיזית?",
      answer:
        "כן. שירותי AI ומיקס אונליין - שולחים קובץ, מקבלים תוצר מוכן עם ליווי בוואטסאפ.",
    },
    {
      id: "creators-delivery",
      question: "תוך כמה זמן מקבלים קובץ מוגמר?",
      answer:
        "רוב הפרויקטים - תוך 24 שעות מסירה. פרויקטים מורכבים - נקבע לוח זמנים בהצעה.",
    },
  ],
  whatsappText: "שלום, אני יוצר/ת ומעוניין/ת בהקלטה / מיקס / קורס באולפן",
  utmCampaign: "for_creators_hub",
};
