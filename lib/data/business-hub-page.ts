/** Business hub -- B2B service index */

import type { FAQItem } from "@/components/ui/FAQAccordion";

export type BusinessHubService = {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  priceHint?: string;
  audienceNote?: string;
};

export type BusinessHubGroup = {
  id: string;
  title: string;
  description: string;
  services: readonly BusinessHubService[];
};

export const BUSINESS_HUB_GROUPS: readonly BusinessHubGroup[] = [
  {
    id: "content",
    title: "תוכן וסושיאל",
    description:
      "רילז, שורטס ונוכחות ברשת. באולפן או בעסק. לא מתאים לחתונות ואירועים פרטיים.",
    services: [
      {
        id: "content-studio",
        icon: "📱",
        title: "סושיאל דאמפ, רילז באולפן",
        description:
          "יום צילום מרוכז: 2 שעות באולפן, 10–15 סרטונים קצרים ערוכים עם כתוביות.",
        href: "/business/content-studio",
        priceHint: "החל מ-1,650 ₪",
      },
      {
        id: "social-media",
        icon: "📈",
        title: "ניהול סושיאל לעסקים",
        description:
          "ריטיינר חודשי: צילום בעסק, עריכה, טיקטוק ואינסטגרם. עם יקיר איזמירלי.",
        href: "/business/social-media",
        priceHint: "החל מ-2,500 ₪/חודש",
      },
      {
        id: "reel-factory",
        icon: "⚡",
        title: "מפעל רילס לספקי אירועים",
        description:
          "Rave 24 שעות ו-Content Hub. ל-DJ, צלמים ומפעילי אטרקציות בלבד.",
        href: "/business/reel-factory",
        priceHint: "החל מ-950 ₪",
        audienceNote: "לספקים, לא לבעלי עסקים כלליים",
      },
    ],
  },
  {
    id: "production",
    title: "הפקה ווידאו",
    description: "סרטים, פודקאסט ותוכן ארוך. לחברות וארגונים.",
    services: [
      {
        id: "corporate-video",
        icon: "🎬",
        title: "סרט תדמית לעסק",
        description: "אפיון, צילום ועריכה. מסר מותגי ברמת שידור.",
        href: "/video/corporate-video",
        priceHint: "הצעה לפי פרויקט",
      },
      {
        id: "on-site-studio",
        icon: "🏢",
        title: "אולפן זמני בחברה",
        description:
          "אולפן נייד בחדר ישיבות. 2 מצלמות, מיקרופונים ותאורה. יום צילום במשרד.",
        href: "/business/on-site-studio",
        priceHint: "החל מ-6,500 ₪",
      },
      {
        id: "corporate-songs",
        icon: "🎵",
        title: "שירים לחברות",
        description:
          "שיר הרמת כוסית, פרישה או הימנון. הפקה מלאה וקליפ, עם חשבונית מס.",
        href: "/business/corporate-songs",
        priceHint: "החל מ-5,000 ₪",
      },
      {
        id: "employer-branding",
        icon: "👋",
        title: "תוכן HR וקליטה",
        description: "סרטוני onboarding, ברוכים הבאים, תוכן לעובדים חדשים.",
        href: "/business/employer-branding",
        priceHint: "החל מ-4,500 ₪",
      },
      {
        id: "bulk-production",
        icon: "🏭",
        title: "פס ייצור פודקאסט",
        description: "עריכה שוטפת לחברות. פרק מוכן וקליפים כל שבוע.",
        href: "/podcast/bulk-production",
        priceHint: "החל מ-950 ₪/פרק",
      },
      {
        id: "studio-in-a-box",
        icon: "📦",
        title: "אולפן בקופסה",
        description: "תכנון אולפן + 10 פרקים. לעסק שרוצה פורמט קבוע.",
        href: "/podcast/studio-in-a-box",
        priceHint: "החל מ-2,500 ₪",
      },
    ],
  },
  {
    id: "voice",
    title: "קול ומיתוג",
    description: "איך המותג שלכם נשמע. IVR, פרסומות וקריינות.",
    services: [
      {
        id: "professional-voiceover",
        icon: "🎙️",
        title: "קריינות מקצועית",
        description: "פרסומות, IVR, מרכזיות ותוכן דיגיטלי. באולפן במודיעין.",
        href: "/business/professional-voiceover",
        priceHint: "הצעה לפי פרויקט",
      },
      {
        id: "audio-branding",
        icon: "🔊",
        title: "מיתוג קולי",
        description: "ג'ינגל, IVR, מוזיקת המתנה ואפקטים. חבילת סאונד שלמה.",
        href: "/business/audio-branding",
        priceHint: "החל מ-1,500 ₪",
      },
      {
        id: "audiobooks",
        icon: "📚",
        title: "ספרי שמע",
        description: "הקלטה ועריכה מקצה לקצה. ACX, Spotify ואייקאסט.",
        href: "/business/audiobooks",
        priceHint: "החל מ-750 ₪/שעה",
      },
    ],
  },
  {
    id: "online-b2b",
    title: "שירותים דיגיטליים",
    description: "המרה, שחזור וארכיון. גם בלי להגיע לאולפן.",
    services: [
      {
        id: "legacy-digitization",
        icon: "📼",
        title: "החייאת זיכרונות",
        description: "המרת VHS וקלטות לדיגיטל, עם שחזור AI לסאונד ותמונה.",
        href: "/online/legacy-digitization",
        priceHint: "החל מ-350 ₪",
      },
      {
        id: "transcription",
        icon: "📝",
        title: "תמלול וכתוביות",
        description: "פודקאסט, ראיונות, SRT. AI + עריכה אנושית.",
        href: "/online/transcription",
        priceHint: "החל מ-180 ₪",
      },
      {
        id: "voice-cloning",
        icon: "🗣️",
        title: "שיבוט קול",
        description: "עדכוני IVR בלי להקליט מחדש. רק עם אישור בעל הקול.",
        href: "/online/voice-cloning",
        priceHint: "החל מ-2,500 ₪",
      },
    ],
  },
] as const;

export const BUSINESS_HUB_FAQS: FAQItem[] = [
  {
    id: "b2c-vs-b2b",
    question: "האם השירותים כאן מתאימים גם למשפחות ואירועים פרטיים?",
    answer:
      "לא. לשיר במתנה, בר מצווה וחתונות עברו לקטגוריית אולפן או אירועים. כאן מדובר בתוכן, הפקה וקול לעסקים.",
  },
  {
    id: "content-vs-social",
    question: "מה ההבדל בין סושיאל דאמפ לניהול סושיאל?",
    answer:
      "סושיאל דאמפ: צילום באולפן ורילז ערוכים. ניהול סושיאל: ריטיינר עם צילום בעסק וניהול עמודים.",
  },
  {
    id: "reel-factory",
    question: "למי מתאים מפעל הרילס?",
    answer:
      "לספקי אירועים (DJ, צלמים, מפעילי אטרקציות) שמביאים חומר מאירוע. בעלי עסקים כלליים: סושיאל דאמפ או ניהול סושיאל.",
  },
  {
    id: "invoice",
    question: "האם מנפיקים חשבונית מס?",
    answer: "כן. לכל השירותים לעסקים יש חשבונית מס.",
  },
];

export const BUSINESS_HUB_WHATSAPP =
  "שלום, אני מעוניין/ת בפתרונות הפקה לעסק. אשמח לשמוע מה מתאים לנו.";
