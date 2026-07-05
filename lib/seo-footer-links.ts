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

/** 5 עמודות כוונה, רשת ביטחון crawl אחרי Header מקוצר */
export const FOOTER_SEMANTIC_TREE: readonly FooterSemanticSection[] = [
  {
    heading: "אולפן וסאונד מרחוק",
    links: [
      {
        label: "אולפן הקלטות במודיעין",
        href: "/studio",
        title: "מרכז האולפן, הקלטות במודיעין והמרכז",
      },
      {
        label: "הקלטת שיר במתנה וברכות מוקלטות",
        href: "/studio/recording-song-modiin",
        title: "הקלטת שירים וברכות לאירועים",
      },
      {
        label: "תיקון זיופים ועריכת סאונד מרחוק",
        href: "/online/vocal-fix/pitch-correction",
        title: "Pitch Correction טבעי, לא אוטומטי",
      },
      {
        label: "שחזור הקלטות פגומות ב-AI",
        href: "/online/vocal-fix",
        title: "ניקוי רעשים, הד ותיקון קבצים מזום וקלטות ישנות",
      },
      {
        label: "מיקס ומאסטרינג מקצועי",
        href: "/online/vocal-fix/mixing",
        title: "סאונד מוכן לספוטיפיי ויוטיוב",
      },
      {
        label: "אולפן הקלטות בירושלים",
        href: "/studio/studio-jerusalem",
        title: "הקלטות לקהל מירושלים והסביבה",
      },
      {
        label: "אולפן הקלטות בשוהם",
        href: "/studio/studio-shoham",
        title: "אולפן במודיעין, 10–15 דק׳ משוהם",
      },
      {
        label: "אולפן הקלטות ברחובות",
        href: "/studio/studio-rehovot",
        title: "אולפן במודיעין, 25–30 דק׳ מרחובות",
      },
      {
        label: "ברכות לחתונה ובר מצווה",
        href: "/studio/blessings",
        title: "ברכות מוקלטות לכל סוגי האירועים",
      },
      {
        label: "מחירון אולפן",
        href: "/studio/pricing",
        title: "מחירי הקלטה ושירותי אולפן",
      },
      {
        label: "החייאת קלטות VHS וקלטות ישנות",
        href: "/online/legacy-digitization",
        title: "המרת קלטות ושחזור AI",
      },
      {
        label: "שדרוג תמונות ב-AI",
        href: "/online/vocal-fix/photo-enhance",
        title: "הגדלה וחידוד תמונות ישנות",
      },
      {
        label: "שליחת קבצים לעריכה",
        href: "/online/vocal-fix/send-file",
        title: "העלאת קבצים לשחזור ומיקס",
      },
      {
        label: "שוברי מתנה מהאולפן",
        href: "/studio/recording-song-modiin/gifts",
        title: "מתנות והקלטות כשובר",
      },
      {
        label: "אולפן הקלטות, סקירה",
        href: "/studio/recording-studio",
        title: "השכרת אולפן הקלטות במודיעין",
      },
      {
        label: "אולפן נייד",
        href: "/studio/mobile-studio",
        title: "הקלטות באולפן נייד",
      },
      {
        label: "ברכת חתן וכלה",
        href: "/studio/blessings/bride-groom-blessing",
        title: "ברכות חתן כלה מוקלטות",
      },
      {
        label: "בר מצווה, הקלטת ברכה",
        href: "/studio/blessings/bar-mitzvah",
        title: "ברכות מוקלטות לבר מצווה",
      },
      {
        label: "קליפ בר/בת מצווה",
        href: "/studio/blessings/video-clip",
        title: "קליפ ברכה לבר או בת מצווה",
      },
    ],
  },
  {
    heading: "פודקאסט",
    links: [
      {
        label: "הפקת פודקאסט מאלף עד תאו",
        href: "/podcast/podcast-production",
        title: "ליווי מקצועי מהרעיון ועד פרסום",
      },
      {
        label: "הקלטת פודקאסט באולפן (אודיו ווידאו)",
        href: "/podcast/podcast-recording",
        title: "צילום והקלטת פודקאסט, הפקה מלאה",
      },
      {
        label: "פודקאסט נייד, אולפן עד הבית",
        href: "/podcast/mobile-podcast-at-home",
        title: "הקלטה ועריכה בבית הלקוח",
      },
      {
        label: "עריכת פודקאסט, פרק מוכן ב-24 שעות",
        href: "/podcast/podcast-editing",
        title: "עריכת פודקאסט מקצועית מרחוק",
      },
      {
        label: "הפצה לספוטיפיי ואפל פודקאסטס",
        href: "/podcast/corporate-podcast",
        title: "הפקה, עריכה והפצה לפלטפורמות",
      },
      {
        label: "השכרת אולפן פודקאסט במודיעין",
        href: "/podcast/podcast-studio-modiin",
        title: "השכרת אולפן פודקאסט במודיעין",
      },
      {
        label: "אולפן שירות עצמי",
        href: "/podcast/self-service-studio",
        title: "650 ₪ לשעה, קבצים גולמיים",
      },
      {
        label: "פס ייצור לפודקאסט לעסקים",
        href: "/podcast/bulk-production",
        title: "עריכה שוטפת לחברות",
      },
      {
        label: "פודקאסט עם סבא וסבתא",
        href: "/podcast/podcast-with-grandpa",
        title: "הקלטת סיפורי משפחה",
      },
      {
        label: "אולפן בקופסה לעסקים",
        href: "/podcast/studio-in-a-box",
        title: "תכנון אולפן + 10 פרקים",
      },
      {
        label: "שאלות נפוצות על פודקאסט",
        href: "/podcast/faq",
        title: "מחירים, ציוד ותהליך",
      },
    ],
  },
  {
    heading: "אירועים ואטרקציות",
    links: [
      {
        label: "DJ לחתונה ותקליטן לאירועים",
        href: "/events/dj-events",
        title: "DJ לחתונות ואירועי חברה",
      },
      {
        label: "חבילות אטרקציות לסלואו ורחבה",
        href: "/events/wedding-attractions-packages",
        title: "DJ + עשן + זיקוקים בחבילה אחת",
      },
      {
        label: "מכונת עשן כבד לחתונה",
        href: "/events/attractions/wedding-smoking-machine",
        title: "עשן כבד לרחבה, אפקט חופה וסלואו",
      },
      {
        label: "זיקוקים קרים לאירועים",
        href: "/events/attractions/cold-fireworks",
        title: "זיקוקי ניצוצות בטוחים לחופה ובר מצווה",
      },
      {
        label: "תותחי עשן וקירור רחבה",
        href: "/events/attractions/smoke-cannons-for-events",
        title: "תותחי עשן וקור לרחבה",
      },
      {
        label: "תופים אלקטרוניים ובמה LED",
        href: "/events/stage-led-dj",
        title: "במה עם תאורת LED ותופים אלקטרוניים",
      },
      {
        label: "מכונת בועות לאירועים",
        href: "/events/attractions/bubble-machine",
        title: "אפקט בועות לרחבה וחתונה",
      },
      {
        label: "תותח קונפטי לרגע שיא",
        href: "/events/attractions/confetti-cannon",
        title: "קונפטי לרגע שיא באירוע",
      },
      {
        label: "בלונים ענק לאירועים",
        href: "/events/attractions/giant-balloons",
        title: "בלונים ענק לחתונה ואירועים",
      },
      {
        label: "DJ בירושלים",
        href: "/dj-events/cities/jerusalem",
        title: "DJ לאירועים בירושלים והסביבה",
      },
      {
        label: "DJ בשוהם",
        href: "/dj-events/cities/shoham",
        title: "DJ לאירועים בשוהם והסביבה",
      },
      {
        label: "DJ ברחובות",
        href: "/dj-events/cities/rehovot",
        title: "DJ לאירועים ברחובות והסביבה",
      },
      {
        label: "מנחה אירועים",
        href: "/events/host",
        title: "מנחה ומנהל אירועים מקצועי",
      },
      {
        label: "ציוד הגברה לאירועים",
        href: "/events/equipment",
        title: "השכרת ציוד והגברה",
      },
      {
        label: "השכרת ציוד הגברה",
        href: "/events/equipment/dry-hire",
        title: "השכרת ציוד ללא מפעיל",
      },
      {
        label: "תכנון EASE / SMAART",
        href: "/events/equipment/system-tuning",
        title: "תכנון מערכות הגברה",
      },
      {
        label: "הגברת זמר חי",
        href: "/events/equipment/singer-amplification",
        title: "הגברה לזמר חי באירוע",
      },
      {
        label: "עשן כבד לאירועים גדולים",
        href: "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
        title: "עשן כבד לאולמות גדולים",
      },
    ],
  },
  {
    heading: "עסקים, תוכן ואקדמיה",
    links: [
      {
        label: "קריינות מקצועית לסרטי תדמית",
        href: "/voiceover/services",
        title: "קריינות טלפון, וידאו ומותג",
      },
      {
        label: "הפקת וידאו ותוכן לעסקים",
        href: "/business/content-studio",
        title: "יום צילום, רילז ושורטס לעסקים",
      },
      {
        label: "סרט תדמית לעסק",
        href: "/video/corporate-video",
        title: "הפקת סרט תדמית מקצועי",
      },
      {
        label: "פתרונות אודיו ותוכן לעסקים",
        href: "/business",
        title: "רילז, סושיאל, קריינות ופודקאסט לחברות",
      },
      {
        label: "קורס DJ מקצועי",
        href: "/academy/dj-course",
        title: "לימוד תקליטנות באולפן במודיעין",
      },
      {
        label: "קורס הפקה מוזיקלית",
        href: "/academy/music-production",
        title: "קורס הפקה מוזיקלית",
      },
      {
        label: "שיעורי עברית במודיעין",
        href: "/academy/ulpan",
        title: "שיעור פרטי עברית, פרונטלי או בזום",
      },
      {
        label: "ייעוץ אקוסטיקה ובניית אולפן",
        href: "/academy/home-studio",
        title: "תכנון אולפן ביתי ופודקאסט",
      },
      {
        label: "מגזין הסאונד וההפקות",
        href: "/blog",
        title: "מאמרים מקצועיים על סאונד והפקה",
      },
      {
        label: "ניהול סושיאל לעסקים",
        href: "/business/social-media",
        title: "ניהול סושיאל ומדיה לעסקים",
      },
      {
        label: "מפעל רילס לספקי אירועים",
        href: "/business/reel-factory",
        title: "עריכת פרומואים לספקי אירועים",
      },
      {
        label: "מיתוג קולי לעסק",
        href: "/business/audio-branding",
        title: "ג'ינגל, IVR ולוגו קולי",
      },
      {
        label: "שירים לחברות",
        href: "/business/corporate-songs",
        title: "פרישה, הימנון והרמת כוסית",
      },
      {
        label: "ספרי שמע",
        href: "/business/audiobooks",
        title: "הפקת ספר קולי מקצה לקצה",
      },
      {
        label: "אולפן זמני בחברה",
        href: "/business/on-site-studio",
        title: "צילום בחדר ישיבות",
      },
      {
        label: "קריינות לעסקים",
        href: "/business/professional-voiceover",
        title: "IVR, פרסומות ותוכן דיגיטלי",
      },
      {
        label: "צילום חתונות",
        href: "/photography/wedding",
        title: "צלם חתונות ואירועים",
      },
      {
        label: "צילום אירועים וכנסים",
        href: "/photography/events",
        title: "צילום אירועים וכנסים",
      },
      {
        label: "צילום אירועים בוידאו",
        href: "/video/event-filming",
        title: "צילום וידאו לאירועים",
      },
      {
        label: "שירותים מקצועיים ל-DJ",
        href: "/pro",
        title: "תגים קוליים, סטים וציוד",
      },
      {
        label: "תג קולי לדיג'יי",
        href: "/events/dj/voice-tags",
        title: "תגים קוליים מותאמים אישית",
      },
      {
        label: "סטים מוכנים ל-DJ",
        href: "/events/dj/pre-built-sets",
        title: "סטים מובנים לדיג'ייז",
      },
      {
        label: "קורס קריינות",
        href: "/voiceover/course",
        title: "לימוד קריינות מקצועית",
      },
      {
        label: "שיעורים פרטיים",
        href: "/academy/private-lessons",
        title: "שיעור פרטי 1:1",
      },
      {
        label: "קורס גמגום",
        href: "/academy/stuttering-course",
        title: "טיפול בגמגום",
      },
      {
        label: "סדנאות לצוותים",
        href: "/academy/workshops",
        title: "טיקטוק, רילז ומול מצלמה",
      },
      {
        label: "תמחור שירותי AI",
        href: "/online/online-ai-pricing",
        title: "תמחור שקוף לשירותי AI",
      },
      {
        label: "מאשאפים ומוזיקה",
        href: "/online/mashup-fixer",
        title: "מרכז דיג'יי, מאשאפים וכלים",
      },
      {
        label: "תוכן HR וקליטה",
        href: "/business/employer-branding",
        title: "סרטוני onboarding לעובדים",
      },
      {
        label: "דופק השוק, אירועים",
        href: "/pro/event-index",
        title: "מדדים ומגמות בשוק האירועים",
      },
      {
        label: "עריכת מצגת תמונות",
        href: "/photo-slideshow",
        title: "מצגות תמונות מקצועיות",
      },
      {
        label: "מצגות וידאו",
        href: "/video/presentation",
        title: "עריכת מצגות וידאו",
      },
    ],
  },
  {
    heading: "אמון, מחירון ו-AEO",
    links: [
      {
        label: "מחירון מרוכז ועדכני",
        href: "/pricing",
        title: "מחירי שירותי האולפן, אירועים ופודקאסט",
      },
      {
        label: "מרכז שאלות נפוצות",
        href: "/about/faq",
        title: "תשובות לשאלות נפוצות על השירותים",
      },
      {
        label: "אודות יקיר כהן",
        href: "/about",
        title: "ניסיון, צוות ותקשורת",
      },
      {
        label: "יצירת קשר והזמנת אולפן",
        href: "/contact",
        title: "טלפון, וואטסאפ וטופס יצירת קשר",
      },
      {
        label: "הזמנה מקוונת",
        href: "/book",
        title: "הזמנת שירותים מקוונת",
      },
      {
        label: "איך זה עובד",
        href: "/start",
        title: "מה קורה אחרי שפונים",
      },
      {
        label: "מדיניות פרטיות",
        href: "/privacy",
        title: "מדיניות פרטיות",
      },
      {
        label: "תנאי שירות",
        href: "/terms",
        title: "תנאי שימוש",
      },
      {
        label: "הצהרת נגישות",
        href: "/accessibility",
        title: "הצהרת נגישות",
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
