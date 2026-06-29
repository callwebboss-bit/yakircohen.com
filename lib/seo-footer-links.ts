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
      {
        label: "פודקאסט נייד עד הבית",
        href: "/podcast/mobile-podcast-at-home",
        title: "הקלטה ועריכה בבית הלקוח",
      },
      {
        label: "שוברי מתנה מהאולפן",
        href: "/studio/recording-song-modiin/gifts",
        title: "מתנות והקלטות כשובר",
      },
      {
        label: "אולפן הקלטות — סקירה",
        href: "/studio/recording-studio",
        title: "השכרת אולפן הקלטות במודיעין",
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
      {
        label: "במה LED + DJ",
        href: "/events/stage-led-dj",
        title: "במה עם תאורת LED ותופים אלקטרוניים",
      },
      {
        label: "מכונת בועות לאירועים",
        href: "/events/attractions/bubble-machine",
        title: "אפקט בועות לרחבה וחתונה",
      },
      {
        label: "תותח קונפטי",
        href: "/events/attractions/confetti-cannon",
        title: "קונפטי לרגע שיא באירוע",
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
      {
        label: "ייעוץ אקוסטיקה ובניית אולפן",
        href: "/academy/home-studio",
        title: "תכנון אולפן ביתי ופודקאסט",
      },
      {
        label: "הפקה מוזיקלית",
        href: "/academy/music-production",
        title: "קורס הפקה מוזיקלית",
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
        label: "שחזור הקלטות ב-AI",
        href: "/online/vocal-fix",
        title: "ניקוי רעשים, הד ותיקון זיופים",
      },
      {
        label: "שדרוג תמונות ב-AI",
        href: "/online/vocal-fix/photo-enhance",
        title: "הגדלה וחידוד תמונות ישנות",
      },
      {
        label: "החייאת קלטות VHS",
        href: "/online/legacy-digitization",
        title: "המרת קלטות ושחזור AI",
      },
      {
        label: "תיקון זיופים",
        href: "/online/vocal-fix/pitch-correction",
        title: "Pitch Correction טבעי",
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
        label: "הנחיית אירועים עסקיים",
        href: "/events/host",
        title: "מנחה ומנהל אירועים מקצועי",
      },
      {
        label: "ברכת חתן וכלה",
        href: "/studio/blessings/bride-groom-blessing",
        title: "ברכות חתן כלה מוקלטות",
      },
      {
        label: "בר מצווה — הקלטת ברכה",
        href: "/studio/blessings/bar-mitzvah",
        title: "ברכות מוקלטות לבר מצווה",
      },
      {
        label: "סרט תדמית לעסק",
        href: "/video/corporate-video",
        title: "הפקת סרט תדמית מקצועי",
      },
      {
        label: "צילום אירועים",
        href: "/video/event-filming",
        title: "צילום וידאו לאירועים",
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
