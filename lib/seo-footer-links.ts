/** קישורי זנב SEO פנימיים — Additive only; כל href חייב להיות עמוד קיים באתר */
export type SeoFooterLink = {
  label: string;
  href: string;
  title?: string;
};

export type FooterSemanticSection = {
  heading: string;
  links: readonly SeoFooterLink[];
};

export const FOOTER_SEMANTIC_TREE: readonly FooterSemanticSection[] = [
  {
    heading: "פודקאסט וסטודיו",
    links: [
      {
        label: "הפקת פודקאסטים במרכז",
        href: "/podcast/podcast-recording",
        title: "צילום והקלטת פודקאסט — הפקה מלאה",
      },
      {
        label: "אולפן הקלטות במודיעין",
        href: "/studio/recording-song-modiin",
        title: "הקלטת שירים במודיעין ובמרכז",
      },
      {
        label: "אולפן פודקאסט במודיעין",
        href: "/podcast/podcast-studio-modiin",
        title: "השכרת אולפן פודקאסט במודיעין",
      },
      {
        label: "אולפן הקלטות בירושלים",
        href: "/studio/studio-jerusalem",
        title: "הקלטות לקהל מירושלים והסביבה",
      },
    ],
  },
  {
    heading: "אירועים ומיקומים",
    links: [
      {
        label: "הנחיית אירועים עסקיים",
        href: "/events/host",
        title: "מנחה ומנהל אירועים מקצועי",
      },
      {
        label: "תקליטן לחתונה בירושלים",
        href: "/dj-events/cities/jerusalem",
        title: "DJ לאירועים בירושלים והסביבה",
      },
      {
        label: "תקליטן דתי וקהל מעורב",
        href: "/events/dj-events",
        title: "DJ לאירועים וחתונות",
      },
      {
        label: "אטרקציות חובה לחתונה",
        href: "/events/wedding-attractions-packages",
        title: "חבילות DJ ואטרקציות לחתונה",
      },
    ],
  },
  {
    heading: "AI ודיגיטל",
    links: [
      {
        label: "יצירת סרטוני AI לעסקים",
        href: "/online/video-content",
        title: "עריכת וידאו שיווקי ותוכן דיגיטלי",
      },
      {
        label: "שירותי AI לאודיו",
        href: "/online/online-ai-pricing",
        title: "תמחור שקוף לשירותי AI לאודיו",
      },
      {
        label: "עריכת פודקאסט אונליין",
        href: "/podcast/podcast-editing",
        title: "עריכת פודקאסט מקצועית מרחוק",
      },
      {
        label: "שירותים מקצועיים לעסקים",
        href: "/pro",
        title: "תגים קוליים, פודקאסט והגברה לאנשי מקצוע",
      },
    ],
  },
  {
    heading: "צילום, קריינות ועסקים",
    links: [
      {
        label: "צילום חתונות",
        href: "/photography/wedding",
        title: "צלם חתונות ואירועים אינטימיים",
      },
      {
        label: "קריינות מקצועית",
        href: "/voiceover/services",
        title: "קריינות טלפון, וידאו ומותג",
      },
      {
        label: "ניהול סושיאל לעסקים",
        href: "/business/social-media",
        title: "ניהול סושיאל ומדיה לעסקים",
      },
      {
        label: "מפעל רילס לספקים",
        href: "/business/reel-factory",
        title: "The Reel Factory — עריכת פרומואים לספקי אירועים",
      },
      {
        label: "הקלטת ברכת כלה",
        href: "/studio/blessings/bride-groom-blessing",
        title: "ברכות חתן כלה מוקלטות",
      },
    ],
  },
] as const;

/** @deprecated Use FOOTER_SEMANTIC_TREE */
export const FOOTER_POPULAR_LINKS: SeoFooterLink[] =
  FOOTER_SEMANTIC_TREE[0]!.links.map((l) => ({ ...l }));

/** @deprecated Use FOOTER_SEMANTIC_TREE */
export const SEO_FOOTER_LINKS: SeoFooterLink[] = FOOTER_SEMANTIC_TREE.flatMap(
  (s) => [...s.links],
);
