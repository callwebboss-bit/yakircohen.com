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

const PREFIX_RULES: readonly { prefix: string; context: StickyCtaContext }[] = [
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
