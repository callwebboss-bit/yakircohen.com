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
};

/** סדר תצוגה בתפריט — מקור אמת יחיד (Google priority) */
export const NAV_DISPLAY_ORDER = [
  "studio",
  "podcast",
  "online",
  "attractions",
  "dj-voice",
  "social",
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
      { label: "עריכת פודקאסט", href: "/podcast/podcast-editing" },
      {
        label: "אולפן בקופסה לעסקים",
        href: "/podcast/studio-in-a-box",
        description: "תכנון אולפן + 10 פרקים",
      },
      {
        label: "פס ייצור לפודקאסט",
        href: "/podcast/bulk-production",
        description: "פרק + 3 Shorts לכל פרק",
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
        label: "שיפור קול + שחזור הקלטות",
        href: "/online/vocal-fix",
        description: "ניקוי רעשים, הד, עיוותים - 250 ₪ עד 5 דק׳",
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
        label: "מאשאפ חירום",
        href: "/online/mashup-fixer",
        description: "עריכת מאשאפ עד 24 שעות",
      },
    ],
  },
  attractions: {
    id: "attractions",
    label: "אטרקציות",
    href: "/events/attractions",
    children: [
      { label: "מרכז אטרקציות", href: "/events/attractions" },
      { label: "חבילות אירועים", href: "/events/wedding-attractions-packages" },
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
  social: {
    id: "social",
    label: "סושיאל",
    href: "/business/social-media",
    children: [
      {
        label: "קידום סושיאל לעסקים",
        href: "/business/social-media",
        description: "ניהול סושיאל ומדיה",
      },
      {
        label: "מפעל רילס לספקים",
        href: "/business/reel-factory",
        description: "עריכת פרומואים לספקי אירועים",
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
      { label: "לימוד עברית (אולפן)", href: "/academy/ulpan" },
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
      { label: "מאשאפ חירום", href: "/online/mashup-fixer" },
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
  { prefix: "/business/social-media", categoryId: "social" },
  { prefix: "/business/reel-factory", categoryId: "social" },
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

/** מחזיר קישורים פנימיים מותרים לאותה קטגוריה (לרכיבי Related) */
export function getSameCategoryLinks(pathname: string): SiteNavLink[] {
  const cat = getCategoryForPath(pathname);
  if (!cat) return [];
  return cat.children.filter((c) => c.href !== pathname);
}
