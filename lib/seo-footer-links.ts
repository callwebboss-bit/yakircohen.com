/** קישורי זנב SEO פנימיים - Additive only; כל href חייב להיות עמוד קיים באתר */
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
    heading: "אולפן ופודקאסט",
    links: [
      {
        label: "אולפן הקלטות במודיעין",
        href: "/studio/recording-song-modiin",
        title: "הקלטת שירים במודיעין ובמרכז",
      },
      {
        label: "אולפן הקלטות בירושלים",
        href: "/studio/studio-jerusalem",
        title: "הקלטות לקהל מירושלים והסביבה",
      },
      {
        label: "אולפן הקלטות בשוהם",
        href: "/studio/studio-shoham",
        title: "אולפן במודיעין - 10–15 דק׳ משוהם",
      },
      {
        label: "אולפן הקלטות ברחובות",
        href: "/studio/studio-rehovot",
        title: "אולפן במודיעין - 25–30 דק׳ מרחובות",
      },
      {
        label: "הפקת פודקאסטים במרכז",
        href: "/podcast/podcast-recording",
        title: "צילום והקלטת פודקאסט - הפקה מלאה",
      },
      {
        label: "אולפן פודקאסט במודיעין",
        href: "/podcast/podcast-studio-modiin",
        title: "השכרת אולפן פודקאסט במודיעין",
      },
    ],
  },
  {
    heading: "אטרקציות לאירועים",
    links: [
      {
        label: "אטרקציות לחתונה ואירועי חברה",
        href: "/events/attractions",
        title: "עשן, בועות, זיקוקים וקונפטי לחתונה, בר מצווה ואירועים עסקיים",
      },
      {
        label: "מכונת עשן לחתונה",
        href: "/events/attractions/wedding-smoking-machine",
        title: "עשן כבד לרחבה «אפקט חופה וסלואו»",
      },
      {
        label: "זיקוקים קרים לאירועים",
        href: "/events/attractions/cold-fireworks",
        title: "זיקוקי ניצוצות בטוחים לחופה, בר מצווה ורגע שיא",
      },
      {
        label: "חבילות DJ ואטרקציות לחתונה",
        href: "/events/wedding-attractions-packages",
        title: "DJ + עשן + זיקוקים בחבילה אחת לחתונה ואירועי חברה",
      },
    ],
  },
  {
    heading: "לימוד ואקדמיה",
    links: [
      {
        label: "שיעורי עברית במודיעין",
        href: "/academy/ulpan",
        title: "שיעור פרטי עברית - פרונטלי או בזום",
      },
      {
        label: "קורס DJ מקצועי",
        href: "/academy/dj-course",
        title: "לימוד תקליטנות באולפן במודיעין",
      },
    ],
  },
  {
    heading: "AI ודיגיטל",
    links: [
      {
        label: "שירותי AI לאודיו",
        href: "/online/online-ai-pricing",
        title: "תמחור שקוף לשירותי AI לאודיו",
      },
      {
        label: "יצירת סרטוני AI לעסקים",
        href: "/online/video-content",
        title: "עריכת וידאו שיווקי ותוכן דיגיטלי",
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
    heading: "DJ, קריינות ועסקים",
    links: [
      {
        label: "פתרונות לעסקים וארגונים",
        href: "/business",
        title: "רילז, סושיאל, קריינות וסרט תדמית לעסקים",
      },
      {
        label: "סושיאל דאמפ, רילז באולפן",
        href: "/business/content-studio",
        title: "יום צילום, רילז ושורטס לעסקים",
      },
      {
        label: "תקליטן לאירועים",
        href: "/events/dj-events",
        title: "DJ לחתונות ואירועים",
      },
      {
        label: "תקליטן לחתונה בירושלים",
        href: "/dj-events/cities/jerusalem",
        title: "DJ לאירועים בירושלים והסביבה",
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
        title: "The Reel Factory - עריכת פרומואים לספקי אירועים",
      },
    ],
  },
  {
    heading: "צילום ועסקים",
    links: [
      {
        label: "צילום חתונות",
        href: "/photography/wedding",
        title: "צלם חתונות ואירועים אינטימיים",
      },
      {
        label: "הקלטת ברכת כלה",
        href: "/studio/blessings/bride-groom-blessing",
        title: "ברכות חתן כלה מוקלטות",
      },
      {
        label: "הנחיית אירועים עסקיים",
        href: "/events/host",
        title: "מנחה ומנהל אירועים מקצועי",
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
