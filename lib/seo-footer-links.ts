/** קישורי זנב SEO פנימיים - Additive only; כל href חייב להיות עמוד קיים באתר */
export type SeoFooterLink = {
  label: string;
  href: string;
  title?: string;
};

export const SEO_FOOTER_LINKS: SeoFooterLink[] = [
  {
    label: "אולפן הקלטות במרכז",
    href: "/studio/recording-song-modiin",
    title: "הקלטת שירים במודיעין ובמרכז",
  },
  {
    label: "תקליטן לחתונה בירושלים",
    href: "/dj-events/cities/jerusalem",
    title: "DJ לאירועים בירושלים והסביבה",
  },
  {
    label: "קורס דיג'יי במודיעין",
    href: "/academy",
    title: "אקדמיה וקורסי DJ",
  },
  {
    label: "הקלטת ברכת כלה",
    href: "/studio/blessings/bride-groom-blessing",
    title: "ברכות חתן כלה מוקלטות",
  },
  {
    label: "אולפן הקלטות בירושלים",
    href: "/studio/studio-jerusalem",
    title: "הקלטות לקהל מירושלים והסביבה",
  },
  {
    label: "תקליטן דתי וקהל מעורב",
    href: "/events/dj-events",
    title: "DJ לאירועים וחתונות",
  },
  {
    label: "עמדת לד להשכרה",
    href: "/events/stage-led-dj",
    title: "עמדת DJ LED לאירועים",
  },
  {
    label: "אטרקציות לאירועים",
    href: "/events/attractions",
    title: "זיקוקים, עשן, קונפטי ועוד",
  },
  {
    label: "הפקת פודקאסט לעסקים",
    href: "/podcast/podcast-recording",
    title: "צילום והקלטת פודקאסט — הפקה מלאה",
  },
  {
    label: "קריינות מקצועית",
    href: "/voiceover/services",
    title: "קריינות טלפון, וידאו ומותג",
  },
  {
    label: "ניהול סושיאל לעסקים",
    href: "/business/social-media",
    title: `ניהול סושיאל ומדיה | יקיר איזמירלי`,
  },
];
