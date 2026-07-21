type StickyCtaContext = {
  text: string;
  utm_campaign: string;
  /** When true, the secondary (left) button shows "הצעת מחיר" linking to /contact instead of a phone call */
  showQuote?: boolean;
};

const DEFAULT: StickyCtaContext = {
  text: "שלום, אשמח לשמוע על השירותים ולקבל הצעת מחיר מותאמת.",
  utm_campaign: "mobile_sticky_bar",
};

/** כללים ארוכים יותר קודם - prefix matching */
const PREFIX_RULES: readonly { prefix: string; context: StickyCtaContext }[] = [
  {
    prefix: "/studio/mobile-studio",
    context: {
      text: "שלום, מעוניין/ת באולפן נייד - תאריך ומיקום. מה הזמינות והמחיר?",
      utm_campaign: "mobile_sticky_mobile_studio",
    },
  },
  {
    prefix: "/studio/recording-song-modiin",
    context: {
      text: "שלום, מעוניין/ת בהקלטת שיר באולפן במודיעין. מה הזמינות והמחיר?",
      utm_campaign: "mobile_sticky_recording_song",
    },
  },
  {
    prefix: "/studio/blessings",
    context: {
      text: "שלום, מעוניין/ת בהקלטת ברכה באולפן או מהבית. מה המחיר ומתי אפשר?",
      utm_campaign: "mobile_sticky_blessings",
    },
  },
  {
    prefix: "/studio/studio-rehovot",
    context: {
      text: "שלום, מגיע/ה מרחובות ומעוניין/ת באולפן במודיעין (כ-25-30 דק׳). מה הזמינות?",
      utm_campaign: "mobile_sticky_studio_rehovot",
    },
  },
  {
    prefix: "/podcast/podcast-editing",
    context: {
      text: "שלום, יש לי קובץ פודקאסט לעריכה. מה המחיר וזמן המסירה?",
      utm_campaign: "mobile_sticky_podcast_editing",
    },
  },
  {
    prefix: "/business",
    context: {
      text: "שלום, מעוניין/ת באולפן או תוכן לעסק. מה מתאים ומתי יש זמינות?",
      utm_campaign: "mobile_sticky_business",
      showQuote: true,
    },
  },
  {
    prefix: "/pricing",
    context: {
      text: "שלום, ראיתי מחירים באתר ורוצה לדעת מה מתאים לי. אפשר הצעה קצרה?",
      utm_campaign: "mobile_sticky_pricing",
    },
  },
  {
    prefix: "/portfolio",
    context: {
      text: "שלום, ראיתי דוגמאות בתיק העבודות ורוצה סשן דומה. מה הזמינות?",
      utm_campaign: "mobile_sticky_portfolio",
    },
  },
  {
    prefix: "/studio",
    context: {
      text: "שלום, מעוניין/ת בהקלטה באולפן. מה המחיר ומתי אפשר?",
      utm_campaign: "mobile_sticky_studio",
    },
  },
  {
    prefix: "/events",
    context: {
      text: "שלום, מחפש/ת DJ או אטרקציות לאירוע. מה זמין לתאריך שלי?",
      utm_campaign: "mobile_sticky_events",
    },
  },
  {
    prefix: "/online",
    context: {
      text: "שלום, יש לי קובץ לשיפור סאונד/תמונה. אפשר בדיקה ראשונית?",
      utm_campaign: "mobile_sticky_online",
    },
  },
  {
    prefix: "/podcast",
    context: {
      text: "שלום, מעוניין/ת בהקלטת פודקאסט. מה החבילות והזמינות?",
      utm_campaign: "mobile_sticky_podcast",
    },
  },
  {
    prefix: "/voiceover",
    context: {
      text: "שלום, צריך/ה קריינות מקצועית. מה המחיר ולוח הזמנים?",
      utm_campaign: "mobile_sticky_voiceover",
    },
  },
  {
    prefix: "/academy",
    context: {
      text: "שלום, מעוניין/ת בקורס. מה המחיר ומתי מתחילים?",
      utm_campaign: "mobile_sticky_academy",
    },
  },
];

export function getMobileStickyCtaContext(pathname: string): StickyCtaContext {
  for (const rule of PREFIX_RULES) {
    if (pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)) {
      return rule.context;
    }
  }
  return DEFAULT;
}
