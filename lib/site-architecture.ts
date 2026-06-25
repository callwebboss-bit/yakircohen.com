/**
 * מפת אתר מרכזית - מקור אמת אחד לניווט, קנוניקליזציה וקישורים פנימיים.
 * עדכן כאן כשמוסיפים/מאחדים עמודים; Header, Footer ו-redirects נגזרים מכאן.
 */

export type SiteNavLink = {
  label: string;
  href: string;
  /** תיאור קצר בתפריט (אופציונלי) */
  description?: string;
};

export type SiteNavCategory = {
  id: string;
  label: string;
  href: string;
  /** קישורים פנימיים - רק בתוך הקטגוריה */
  children: SiteNavLink[];
  /** 3 קיצורי דרך ממוקדי קהל - מוצגים בראש ה-dropdown בdesktop */
  featured?: readonly { label: string; href: string }[];
};

/** סדר תצוגה בתפריט - מקור אמת יחיד (Google priority) */
export const NAV_DISPLAY_ORDER = [
  "studio",
  "podcast",
  "business",
  "online",
  "attractions",
  "dj-voice",
  "video",
  "photography",
  "academy",
  "pro",
  "events",
] as const;

export type NavCategoryId = (typeof NAV_DISPLAY_ORDER)[number];

/** 301 - עמוד כפול כתובת קנונית (SEO) */
export const CANONICAL_REDIRECTS: Record<string, string> = {
  "/podcast/podcast-studio": "/podcast/podcast-studio-modiin",
  "/courses": "/academy",
  "/dj-course": "/academy/dj-course",
  "/production-course": "/academy/music-production",
};

/**
 * זוגות שדומים אבל נשארים נפרדים - קישורי hub מצביעים לקנוני בלבד.
 * duplicate: URL ישן או משני | canonical: העמוד הראשי לנושא
 */
export const DUPLICATE_PAGE_NOTES: readonly {
  duplicate: string;
  canonical: string;
  reason: string;
}[] = [
  {
    duplicate: "/home",
    canonical: "/",
    reason: "כתובת ישנה מ-Google Sites - 301 לשורש; אין עמוד נפרד בשם home",
  },
  {
    duplicate: "/podcast/podcast-studio",
    canonical: "/podcast/podcast-studio-modiin",
    reason: "אותו אולפן - עמוד SEO מלא אחד (השכרת סטודיו במודיעין)",
  },
  {
    duplicate: "/courses",
    canonical: "/academy",
    reason: "אותה רשימת קורסים - האקדמיה היא המרכז",
  },
  {
    duplicate: "/photography/events",
    canonical: "/photography/wedding",
    reason: "גלריה משותפת כרגע - עמוד אירועים נשאר ל-SEO, קישורים פנימיים לצילום",
  },
];

const NAV_CATEGORIES: Record<NavCategoryId, SiteNavCategory> = {
  studio: {
    id: "studio",
    label: "אולפן הקלטות",
    href: "/studio",
    children: [
      { label: "מרכז האולפן", href: "/studio" },
      { label: "הקלטת שיר במודיעין", href: "/studio/recording-song-modiin" },
      { label: "מתנות ושוברים מהאולפן", href: "/studio/recording-song-modiin/gifts" },
      { label: "אולפן הקלטות", href: "/studio/recording-studio" },
      {
        label: "ייעוץ אקוסטיקה ובניית אולפן",
        href: "/academy/home-studio",
        description: "אולפן ביתי, פודקאסט ומשדר",
      },
      { label: "ברכות מוקלטות", href: "/studio/blessings" },
      { label: "ברכת חתן וכלה", href: "/studio/blessings/bride-groom-blessing" },
      { label: "בר מצווה", href: "/studio/blessings/bar-mitzvah" },
      { label: "קליפ בר/בת מצווה", href: "/studio/blessings/video-clip" },
      { label: "אולפן נייד", href: "/studio/mobile-studio" },
      { label: "אולפן ירושלים", href: "/studio/studio-jerusalem" },
      { label: "מחירון", href: "/studio/pricing" },
      { label: "מחירון מרכזי", href: "/pricing" },
    ],
  },
  podcast: {
    id: "podcast",
    label: "פודקאסט",
    href: "/podcast",
    children: [
      {
        label: "מרכז הפודקאסט",
        href: "/podcast",
        description: "סקירה, מחירון ומחשבון",
      },
      {
        label: "הפקה מלאה (24 שעות)",
        href: "/podcast/podcast-recording",
        description: "צילום + עריכה - מ-2,500 ₪",
      },
      {
        label: "השכרת סטודיו במודיעין",
        href: "/podcast/podcast-studio-modiin",
        description: "הקלטה באולפן - חצי שעה 750 ₪ - שעה 1,500 ₪ (לפני מע״מ)",
      },
      {
        label: "אולפן שירות עצמי (650 ₪/שעה)",
        href: "/podcast/self-service-studio",
        description: "650 ₪ לשעה, בלי עריכה. קבצים גולמיים",
      },
      { label: "עריכת פודקאסט", href: "/podcast/podcast-editing" },
      {
        label: "אולפן בקופסה לעסקים",
        href: "/podcast/studio-in-a-box",
        description: "תכנון אולפן + 10 פרקים",
      },
      {
        label: "פס ייצור לפודקאסט",
        href: "/podcast/bulk-production",
        description: "עריכה שוטפת לחברות. פרק מוכן וקליפים כל שבוע.",
      },
      { label: "ליווי מא׳ עד ת׳", href: "/podcast/podcast-production" },
      { label: "פודקאסט נייד עד הבית", href: "/podcast/mobile-podcast-at-home" },
      { label: "פודקאסט עם סבא וסבתא", href: "/podcast/podcast-with-grandpa" },
      { label: "שאלות נפוצות", href: "/podcast/faq" },
    ],
  },
  online: {
    id: "online",
    label: "שירותי AI",
    href: "/online",
    children: [
      {
        label: "מרכז שירותי AI",
        href: "/online",
        description: "כל שירותי הסאונד, וידאו ותמונה מרחוק",
      },
      {
        label: "שחזור סאונד AI",
        href: "/online/vocal-fix",
        description: "ניקוי רעשים, הד, עיוותים - 250 ₪ עד 5 דק׳",
      },
      {
        label: "החייאת זיכרונות (VHS)",
        href: "/online/legacy-digitization",
        description: "המרת קלטות + שחזור AI",
      },
      {
        label: "מיקס ומאסטרינג",
        href: "/online/vocal-fix/mixing",
        description: "סאונד מסחרי מוכן לספוטיפיי ויוטיוב",
      },
      {
        label: "תיקון זיופים",
        href: "/online/vocal-fix/pitch-correction",
        description: "Pitch Correction טבעי - לא אוטומטי",
      },
      {
        label: "שדרוג תמונות AI",
        href: "/online/vocal-fix/photo-enhance",
        description: "הגדלה, חידוד ושיפור תמונות ישנות",
      },
      { label: "תמחור שירותים", href: "/online/online-ai-pricing" },
      { label: "שליחת קבצים", href: "/online/vocal-fix/send-file" },
      {
        label: "מאשאפים ומוזיקה",
        href: "/online/mashup-fixer",
        description: "מרכז דיג'יי - רעיונות מאשאפ, כלים חינמיים וייצור",
      },
    ],
  },
  attractions: {
    id: "attractions",
    label: "אטרקציות לאירועים",
    href: "/events/attractions",
    children: [
      { label: "כל האטרקציות לחתונה ואירועים", href: "/events/attractions" },
      { label: "חבילות DJ ואטרקציות", href: "/events/wedding-attractions-packages" },
      { label: "מכונת עשן לחתונה", href: "/events/attractions/wedding-smoking-machine" },
      {
        label: "עשן כבד לאירועים גדולים",
        href: "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
      },
      { label: "מכונת בועות", href: "/events/attractions/bubble-machine" },
      { label: "זיקוקים קרים", href: "/events/attractions/cold-fireworks" },
      { label: "תותח קונפטי", href: "/events/attractions/confetti-cannon" },
      { label: "בלונים ענק", href: "/events/attractions/giant-balloons" },
      { label: "במה LED + DJ", href: "/events/stage-led-dj" },
    ],
  },
  "dj-voice": {
    id: "dj-voice",
    label: "DJ וקריינות",
    href: "/events/dj-events",
    children: [
      { label: "תקליטן לאירועים", href: "/events/dj-events" },
      { label: "DJ בירושלים", href: "/dj-events/cities/jerusalem" },
      { label: "תגים קוליים לדיג'ייז", href: "/events/dj/voice-tags" },
      { label: "סטים מובנים ל-DJ", href: "/events/dj/pre-built-sets" },
      { label: "מרכז קריינות", href: "/voiceover" },
      { label: "שירותי קריינות", href: "/voiceover/services" },
      { label: "קורס קריינות", href: "/voiceover/course" },
    ],
  },
  business: {
    id: "business",
    label: "לעסקים",
    href: "/business",
    children: [
      {
        label: "מרכז פתרונות לעסקים",
        href: "/business",
        description: "תוכן, הפקה וקול. במקום אחד",
      },
      {
        label: "סושיאל דאמפ, רילז באולפן",
        href: "/business/content-studio",
        description: "2 שעות צילום, חודש של תוכן",
      },
      {
        label: "אולפן זמני בחברה",
        href: "/business/on-site-studio",
        description: "צילום בחדר ישיבות. מודיעין והמרכז",
      },
      {
        label: "שירים לחברות",
        href: "/business/corporate-songs",
        description: "פרישה, הימנון, הרמת כוסית",
      },
      {
        label: "מיתוג קולי",
        href: "/business/audio-branding",
        description: "ג'ינגל, IVR, לוגו קולי",
      },
      {
        label: "ספרי שמע",
        href: "/business/audiobooks",
        description: "הפקת ספר קולי מקצה לקצה",
      },
      {
        label: "ניהול סושיאל לעסקים",
        href: "/business/social-media",
        description: "ריטיינר חודשי, צילום בעסק + עריכה",
      },
      {
        label: "קריינות מקצועית",
        href: "/business/professional-voiceover",
        description: "IVR, פרסומות ותוכן דיגיטלי",
      },
      {
        label: "מפעל רילס לספקי אירועים",
        href: "/business/reel-factory",
        description: "DJ, צלמים ומפעילי אטרקציות בלבד",
      },
      {
        label: "תוכן HR וקליטה",
        href: "/business/employer-branding",
        description: "סרטוני onboarding לעובדים",
      },
      {
        label: "סרט תדמית לעסק",
        href: "/video/corporate-video",
        description: "הפקה מלאה. מודיעין והמרכז",
      },
      {
        label: "פס ייצור פודקאסט",
        href: "/podcast/bulk-production",
        description: "עריכה שוטפת לחברות. פרק מוכן וקליפים כל שבוע.",
      },
      {
        label: "אולפן בקופסה לעסקים",
        href: "/podcast/studio-in-a-box",
        description: "תכנון אולפן + 10 פרקים",
      },
    ],
  },
  video: {
    id: "video",
    label: "וידאו",
    href: "/video",
    children: [
      { label: "מרכז וידאו", href: "/video" },
      { label: "צילום אירועים", href: "/video/event-filming" },
      { label: "סרט תדמית", href: "/video/corporate-video" },
      { label: "מצגות", href: "/video/presentation" },
      { label: "עריכת מצגת תמונות", href: "/photo-slideshow" },
    ],
  },
  photography: {
    id: "photography",
    label: "צילום",
    href: "/photography",
    children: [
      { label: "מרכז צילום", href: "/photography" },
      { label: "צילום חתונות", href: "/photography/wedding" },
      { label: "צילום אירועים וכנסים", href: "/photography/events" },
    ],
  },
  academy: {
    id: "academy",
    label: "אקדמיה",
    href: "/academy",
    children: [
      { label: "מרכז האקדמיה", href: "/academy" },
      { label: "קורס DJ", href: "/academy/dj-course" },
      { label: "הפקה מוזיקלית", href: "/academy/music-production" },
      { label: "קורס גמגום", href: "/academy/stuttering-course" },
      { label: "שיעור פרטי עברית", href: "/academy/ulpan" },
      {
        label: "סדנאות לצוותים",
        href: "/academy/workshops",
        description: "טיקטוק, רילז, מול מצלמה",
      },
      {
        label: "שיעור פרטי - 990 / 1,280 ₪",
        href: "/academy/private-lessons",
        description: "60 או 90 דקות 1:1",
      },
      {
        label: "ייעוץ אקוסטיקה ובניית אולפן",
        href: "/academy/home-studio",
        description: "אולפן ביתי, פודקאסט ומשדר",
      },
    ],
  },
  pro: {
    id: "pro",
    label: "שירותים מקצועיים",
    href: "/pro",
    children: [
      { label: "מרכז שירותים מקצועיים", href: "/pro" },
      { label: "תג קולי לדיג'יי", href: "/events/dj/voice-tags" },
      { label: "מרכז הדיג'יי", href: "/online/mashup-fixer" },
      { label: "סטים מוכנים", href: "/events/dj/pre-built-sets" },
      { label: "אולפן בקופסה", href: "/podcast/studio-in-a-box" },
      { label: "פס ייצור פודקאסט", href: "/podcast/bulk-production" },
      { label: "השכרת ציוד הגברה", href: "/events/equipment/dry-hire" },
      { label: "תכנון הגברה", href: "/events/equipment/system-tuning" },
      { label: "דופק השוק", href: "/pro/event-index" },
    ],
  },
  events: {
    id: "events",
    label: "אירועים",
    href: "/events",
    children: [
      { label: "מרכז אירועים", href: "/events" },
      { label: "ציוד הגברה", href: "/events/equipment" },
      { label: "השכרת ציוד הגברה", href: "/events/equipment/dry-hire" },
      { label: "תכנון EASE / SMAART", href: "/events/equipment/system-tuning" },
      { label: "הגברת זמר חי", href: "/events/equipment/singer-amplification" },
      { label: "מנחה אירועים", href: "/events/host" },
    ],
  },
};

/** תפריט ראשי - קטגוריה + ילדים (ללא קפיצה לקטגוריות אחרות בילדים) */
export const SITE_NAVIGATION: SiteNavCategory[] = NAV_DISPLAY_ORDER.map(
  (id) => NAV_CATEGORIES[id],
);

/**
 * תפריט Desktop - 5 קטגוריות ראשיות בלבד.
 * אירועים מאוחדת (DJ + אטרקציות + אירועים), שירותים נוספים מאגדת את השאר.
 * Mobile Drawer ממשיך להשתמש ב-SITE_NAVIGATION המלא.
 */
export const NAV_PRIMARY_DESKTOP: SiteNavCategory[] = [
  {
    ...NAV_CATEGORIES["studio"],
    featured: [
      { label: "שיר לחתונה", href: "/studio/recording-song-modiin" },
      { label: "ברכה לבר מצווה", href: "/studio/blessings/bar-mitzvah" },
      { label: "ברכה לחתן וכלה", href: "/studio/blessings/bride-groom-blessing" },
    ],
  },
  {
    ...NAV_CATEGORIES["podcast"],
    featured: [
      { label: "פרק ראשון באולפן", href: "/podcast/podcast-studio-modiin" },
      { label: "עריכת פרק מוכן", href: "/podcast/podcast-editing" },
      { label: "פודקאסט לעסקים", href: "/podcast/bulk-production" },
    ],
  },
  {
    id: "events",
    label: "אירועים",
    href: "/events",
    featured: [
      { label: "DJ לחתונה", href: "/events/dj-events" },
      { label: "עשן כניסה", href: "/events/attractions/wedding-smoking-machine" },
      { label: "DJ + אטרקציות", href: "/events/wedding-attractions-packages" },
    ],
    children: [
      { label: "כל שירותי האירועים", href: "/events" },
      { label: "תקליטן לאירועים", href: "/events/dj-events", description: "DJ לחתונות ואירועים" },
      { label: "DJ בירושלים", href: "/dj-events/cities/jerusalem" },
      { label: "מכונת עשן לחתונה", href: "/events/attractions/wedding-smoking-machine" },
      { label: "זיקוקים קרים", href: "/events/attractions/cold-fireworks" },
      { label: "תותח קונפטי", href: "/events/attractions/confetti-cannon" },
      { label: "בלונים ענק", href: "/events/attractions/giant-balloons" },
      { label: "מכונת בועות", href: "/events/attractions/bubble-machine" },
      { label: "חבילות אירועים", href: "/events/wedding-attractions-packages", description: "DJ + אטרקציות בחבילה" },
      { label: "במה LED + DJ", href: "/events/stage-led-dj" },
      { label: "מנחה אירועים", href: "/events/host" },
      { label: "ציוד הגברה", href: "/events/equipment" },
    ],
  },
  {
    ...NAV_CATEGORIES["academy"],
    featured: [
      { label: "קורס DJ", href: "/academy/dj-course" },
      { label: "שיעורים פרטיים", href: "/academy/private-lessons" },
      { label: "AI ומוזיקה", href: "/academy/ai-music" },
    ],
  },
  {
    id: "pro",
    label: "שירותים נוספים",
    href: "/pro",
    featured: [
      { label: "שחזור הקלטה", href: "/online/vocal-fix" },
      { label: "לעסקים", href: "/business" },
      { label: "קריינות", href: "/voiceover/services" },
    ],
    children: [
      { label: "שירותי AI ועריכה", href: "/online", description: "שחזור סאונד, מיקס ותמונות" },
      { label: "שחזור סאונד AI", href: "/online/vocal-fix", description: "ניקוי רעשים ותיקון זיופים" },
      { label: "לעסקים", href: "/business", description: "תוכן, רילז, פודקאסט וקריינות לחברות" },
      { label: "קריינות מקצועית", href: "/voiceover/services" },
      { label: "וידאו", href: "/video", description: "אירועים, תדמית ומצגות" },
      { label: "צילום", href: "/photography", description: "חתונות ואירועים" },
      { label: "שירותים מקצועיים לDJ", href: "/pro", description: "תגים קוליים, סטים וציוד" },
    ],
  },
];

/**
 * תפריט ראשי - 8 פריטים (AEO) + mega-menu לשירותים.
 * Mobile / פוטר נשארים על SITE_NAVIGATION המלא.
 */
export const VOICEOVER_HEADER_CATEGORY: SiteNavCategory = {
  id: "voiceover-header",
  label: "קריינות",
  href: "/voiceover",
  featured: [
    { label: "שירותי קריינות", href: "/voiceover/services" },
    { label: "קריינות לעסק", href: "/business/professional-voiceover" },
    { label: "קורס קריינות", href: "/academy/voiceover" },
  ],
  children: [
    { label: "מרכז קריינות", href: "/voiceover" },
    { label: "שירותי קריינות", href: "/voiceover/services" },
    { label: "קריינות לעסקים", href: "/business/professional-voiceover" },
    { label: "קורס קריינות", href: "/voiceover/course" },
    { label: "תג קולי ל-DJ", href: "/events/dj/voice-tags" },
  ],
};

const HEADER_STUDIO_NAV: SiteNavCategory = {
  ...NAV_CATEGORIES.studio,
  label: "אולפן",
  featured: [
    { label: "הקלטת שיר לחתונה", href: "/studio/recording-song-modiin" },
    { label: "ברכות מוקלטות", href: "/studio/blessings" },
    { label: "מחירון אולפן", href: "/studio/pricing" },
  ],
};

const HEADER_PODCAST_NAV: SiteNavCategory = {
  ...NAV_CATEGORIES.podcast,
  featured: [
    { label: "פרק ראשון באולפן", href: "/podcast/podcast-studio-modiin" },
    { label: "עריכת פרק", href: "/podcast/podcast-editing" },
    { label: "פודקאסט לעסקים", href: "/podcast/bulk-production" },
  ],
};

const HEADER_EVENTS_NAV =
  NAV_PRIMARY_DESKTOP.find((c) => c.id === "events") ?? NAV_CATEGORIES.events;

export type HeaderNavEntry =
  | { kind: "dropdown"; category: SiteNavCategory }
  | { kind: "link"; label: string; href: string };

export const HEADER_PRIMARY_NAV: readonly HeaderNavEntry[] = [
  { kind: "dropdown", category: HEADER_STUDIO_NAV },
  { kind: "dropdown", category: HEADER_EVENTS_NAV },
  { kind: "dropdown", category: HEADER_PODCAST_NAV },
  { kind: "dropdown", category: VOICEOVER_HEADER_CATEGORY },
  { kind: "link", label: "אודות", href: "/about" },
  { kind: "link", label: "מחירון", href: "/pricing" },
  { kind: "link", label: "שאלות נפוצות", href: "/about/faq" },
  { kind: "link", label: "קשר", href: "/contact" },
];

/** אקדמיה, AI, וידאו - dropdown משני (לא מחליף SITE_NAVIGATION בפוטר) */
export const HEADER_MORE_SERVICES_NAV: SiteNavCategory = {
  ...(NAV_PRIMARY_DESKTOP.find((c) => c.id === "pro") ?? NAV_CATEGORIES.pro),
  label: "עוד שירותים",
};

/** קישורים גלובליים (מחוץ לקטגוריות) */
export const SITE_GLOBAL_LINKS: SiteNavLink[] = [
  { label: "הזמנה מקוונת", href: "/book" },
  { label: "איך זה עובד", href: "/start" },
  { label: "מגזין", href: "/blog" },
  { label: "אודות", href: "/about" },
  { label: "שאלות נפוצות", href: "/about/faq" },
  { label: "צור קשר", href: "/contact" },
];

/** נושאים להעשרת תוכן - שלח טקסטים מהאתר הישן לפי נושא */
export const CONTENT_EXPANSION_TOPICS: readonly {
  id: string;
  targetPath: string;
  title: string;
  sendUs: string;
}[] = [
  {
    id: "dj-events",
    targetPath: "/events/dj-events",
    title: "תקליטן לחתונה ואירועים",
    sendUs: "טקסטים, FAQ, חבילות, המלצות לקוחות",
  },
  {
    id: "podcast-studio",
    targetPath: "/podcast/podcast-studio-modiin",
    title: "השכרת סטודיו / אולפן פודקאסט",
    sendUs: "מחירון מפורט, ציוד, כללי אולפן, גלריה",
  },
  {
    id: "podcast-recording",
    targetPath: "/podcast/podcast-recording",
    title: "הפקת פודקאסט מלאה",
    sendUs: "תהליך 24 שעות, דוגמאות, השוואת חבילות",
  },
  {
    id: "recording-song",
    targetPath: "/studio/recording-song-modiin",
    title: "הקלטת שיר לאירוע",
    sendUs: "שיר כניסה, בר מצווה, תהליך והמחצה",
  },
  {
    id: "blessings",
    targetPath: "/studio/blessings",
    title: "ברכות מוקלטות",
    sendUs: "סוגי ברכות, מחירים, דוגמאות",
  },
  {
    id: "attractions-hub",
    targetPath: "/events/attractions",
    title: "אטרקציות לאירועים",
    sendUs: "רשימת אפקטים, בטיחות, שילובים",
  },
  {
    id: "wedding-smoke",
    targetPath: "/events/attractions/wedding-smoking-machine",
    title: "מכונת עשן לחתונה",
    sendUs: "סוגי עשן, מפעיל, אולמות",
  },
  {
    id: "stage-led",
    targetPath: "/events/stage-led-dj",
    title: "במה LED + DJ",
    sendUs: "מידות במה, תאורה, דוגמאות וידאו",
  },
  {
    id: "voiceover",
    targetPath: "/voiceover/services",
    title: "קריינות מקצועית",
    sendUs: "סוגי פרויקטים, דמו, מחירון",
  },
  {
    id: "academy",
    targetPath: "/academy",
    title: "אקדמיה וקורסים",
    sendUs: "סילבוסים, מחירים, המלצות תלמידים",
  },
  {
    id: "photo-slideshow",
    targetPath: "/photo-slideshow",
    title: "עריכת מצגת תמונות",
    sendUs: "לפני/אחרי, זמני ביצוע, סגנונות",
  },
  {
    id: "about",
    targetPath: "/about",
    title: "אודות יקיר כהן",
    sendUs: "ביוגרפיה, ניסיון, תקשורת",
  },
  {
    id: "workshops",
    targetPath: "/academy/workshops",
    title: "סדנאות לצוותים",
    sendUs: "נושאים, משך, דוגמאות מהשטח",
  },
  {
    id: "transcription",
    targetPath: "/online/transcription",
    title: "תמלול וכתוביות",
    sendUs: "דוגמאות, זמני מסירה",
  },
  {
    id: "employer-branding",
    targetPath: "/business/employer-branding",
    title: "תוכן HR וקליטה",
    sendUs: "סוגי סרטונים, לקוחות HR",
  },
  {
    id: "content-studio",
    targetPath: "/business/content-studio",
    title: "סושיאל דאמפ",
    sendUs: "דוגמאות רילז, תהליך יום צילום",
  },
  {
    id: "on-site-studio",
    targetPath: "/business/on-site-studio",
    title: "אולפן זמני בחברה",
    sendUs: "לוגיסטיקה, דוגמאות מהשטח",
  },
  {
    id: "corporate-songs",
    targetPath: "/business/corporate-songs",
    title: "שירים לחברות",
    sendUs: "סוגי פרויקטים, דוגמאות",
  },
  {
    id: "audiobooks",
    targetPath: "/business/audiobooks",
    title: "הפקת ספרי שמע",
    sendUs: "תהליך, פלטפורמות, דוגמאות",
  },
  {
    id: "audio-branding",
    targetPath: "/business/audio-branding",
    title: "מיתוג קולי לעסק",
    sendUs: "חבילות, דוגמאות IVR",
  },
  {
    id: "legacy-digitization",
    targetPath: "/online/legacy-digitization",
    title: "המרת VHS וקלטות",
    sendUs: "סוגי מדיה, זמני טיפול",
  },
  {
    id: "voice-cloning",
    targetPath: "/online/voice-cloning",
    title: "שיבוט קול",
    sendUs: "שימושים, דוגמאות",
  },
];

/** קישורי hub לפוטר / מסך בית - ללא כפילויות */
export const SITE_HUB_LINKS: SiteNavLink[] = SITE_NAVIGATION.map((c) => ({
  label: c.label,
  href: c.href,
}));

const PATH_CATEGORY_RULES: readonly { prefix: string; categoryId: NavCategoryId }[] = [
  { prefix: "/events/attractions", categoryId: "attractions" },
  { prefix: "/events/wedding-attractions-packages", categoryId: "attractions" },
  { prefix: "/events/stage-led-dj", categoryId: "attractions" },
  { prefix: "/voiceover", categoryId: "dj-voice" },
  { prefix: "/events/dj-events", categoryId: "dj-voice" },
  { prefix: "/events/dj/", categoryId: "dj-voice" },
  { prefix: "/dj-events/", categoryId: "dj-voice" },
  { prefix: "/business", categoryId: "business" },
  { prefix: "/photo-slideshow", categoryId: "video" },
];

export function getCategoryForPath(pathname: string): SiteNavCategory | undefined {
  const normalized = pathname.replace(/\/$/, "") || "/";

  for (const rule of PATH_CATEGORY_RULES) {
    if (
      normalized === rule.prefix ||
      normalized.startsWith(`${rule.prefix}/`)
    ) {
      return NAV_CATEGORIES[rule.categoryId];
    }
  }

  const byHrefLength = [...SITE_NAVIGATION].sort(
    (a, b) => b.href.length - a.href.length,
  );

  return byHrefLength.find(
    (cat) =>
      normalized === cat.href || normalized.startsWith(`${cat.href}/`),
  );
}

/** מזהה dropdown פעיל בתפריט 8-פריטים (desktop) */
export function getHeaderNavActiveCategory(
  pathname: string,
): SiteNavCategory | undefined {
  const normalized = pathname.replace(/\/$/, "") || "/";

  if (
    normalized === "/voiceover" ||
    normalized.startsWith("/voiceover/")
  ) {
    return VOICEOVER_HEADER_CATEGORY;
  }

  for (const entry of HEADER_PRIMARY_NAV) {
    if (entry.kind !== "dropdown") continue;
    const { href } = entry.category;
    if (normalized === href || normalized.startsWith(`${href}/`)) {
      return entry.category;
    }
  }

  return getCategoryForPath(pathname);
}

export function isHeaderNavLinkActive(href: string, pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  if (target === "/about") {
    return normalized === "/about";
  }
  return normalized === target || normalized.startsWith(`${target}/`);
}

/** מחזיר קישורים פנימיים מותרים לאותה קטגוריה (לרכיבי Related) */
export function getSameCategoryLinks(pathname: string): SiteNavLink[] {
  const cat = getCategoryForPath(pathname);
  if (!cat) return [];
  return cat.children.filter((c) => c.href !== pathname);
}
