export type HubDecisionRow = {
  ifYouWant: string;
  thenGo: string;
  href: string;
};

/** נשמר לשימוש/ייצוא - בדף /studio הרנדר הוא StudioHubPathSections (בלי כפילות) */
export const STUDIO_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "שיר לחופה, בר מצווה או מתנה",
    thenGo: "הקלטת שיר באולפן",
    href: "/studio/recording-song-modiin",
  },
  {
    ifYouWant: "ברכה, דרשה או אמירה מוקלטת",
    thenGo: "הקלטת ברכות",
    href: "/studio/blessings",
  },
  {
    ifYouWant: "שהאולפן יגיע אליכם (בלי נסיעה למודיעין)",
    thenGo: "אולפן נייד",
    href: "/studio/mobile-studio",
  },
  {
    ifYouWant: "פודקאסט או ראיון באולפן",
    thenGo: "מרכז פודקאסט",
    href: "/podcast",
  },
  {
    ifYouWant: "לראות מחירים לפי חבילה",
    thenGo: "מחירון אולפן",
    href: "/studio/pricing",
  },
] as const;

export const PODCAST_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "פרק מוכן מההקלטה עד העריכה",
    thenGo: "הקלטת פודקאסט",
    href: "/podcast/podcast-recording",
  },
  {
    ifYouWant: "רק חדר וציוד, בלי הפקה מלאה",
    thenGo: "השכרת אולפן פודקאסט",
    href: "/podcast/podcast-studio-modiin",
  },
  {
    ifYouWant: "לשפר הקלטה שכבר יש",
    thenGo: "עריכת פודקאסט",
    href: "/podcast/podcast-editing",
  },
  {
    ifYouWant: "פודקאסט לעסק עם חשבונית",
    thenGo: "פודקאסט לחברות",
    href: "/podcast/corporate-podcast",
  },
  {
    ifYouWant: "שהאולפן יגיע לבית או למשרד",
    thenGo: "פודקאסט נייד",
    href: "/podcast/mobile-podcast-at-home",
  },
] as const;

export const EVENTS_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "DJ לחתונה או אירוע",
    thenGo: "DJ לאירועים",
    href: "/events/dj-events",
  },
  {
    ifYouWant: "עשן, קונפטי, זיקוקים או בועות",
    thenGo: "אטרקציות",
    href: "/events/attractions",
  },
  {
    ifYouWant: "חבילה משולבת במחיר אחד",
    thenGo: "חבילות לחתונה",
    href: "/events/wedding-attractions-packages",
  },
  {
    ifYouWant: "שיר לחופה או ברכה לאירוע",
    thenGo: "הקלטת שיר באולפן",
    href: "/studio/recording-song-modiin",
  },
] as const;

/** מסלול לפי צורך - לא השוואת מחירים (יש PricingComparisonTable) */
export const PRICING_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "שיר, ברכה או שעת אולפן",
    thenGo: "מחירון אולפן",
    href: "/studio/pricing",
  },
  {
    ifYouWant: "הקלטה או עריכת פודקאסט",
    thenGo: "מסלולי פודקאסט",
    href: "/podcast",
  },
  {
    ifYouWant: "DJ או אטרקציה לאירוע",
    thenGo: "אירועים ומחירים",
    href: "/events",
  },
  {
    ifYouWant: "תוכן לעסק עם חשבונית",
    thenGo: "שירותי עסקים",
    href: "/business",
  },
  {
    ifYouWant: "תיקון קול או עיבוד מרחוק",
    thenGo: "שירותים אונליין",
    href: "/online",
  },
  {
    ifYouWant: "להזמין עם מחיר שקוף",
    thenGo: "הזמנה מקוונת",
    href: "/book",
  },
] as const;

export const BUSINESS_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "רילז ושורטס באולפן או בעסק",
    thenGo: "סושיאל דאמפ",
    href: "/business/content-studio",
  },
  {
    ifYouWant: "יום צילום בחדר ישיבות",
    thenGo: "אולפן בחברה",
    href: "/business/on-site-studio",
  },
  {
    ifYouWant: "פודקאסט לעסק עם חשבונית",
    thenGo: "פודקאסט לחברות",
    href: "/podcast/corporate-podcast",
  },
  {
    ifYouWant: "סרט תדמית או וידאו מותגי",
    thenGo: "סרט תדמית",
    href: "/video/corporate-video",
  },
  {
    ifYouWant: "קריינות או מיתוג קולי",
    thenGo: "קריינות עסקית",
    href: "/business/professional-voiceover",
  },
] as const;

export const ONLINE_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "לתקן זיופים או לנקות שירה",
    thenGo: "תיקון שירה",
    href: "/online/vocal-fix/pitch-correction",
  },
  {
    ifYouWant: "מיקס ומאסטרינג מרחוק",
    thenGo: "מיקס אונליין",
    href: "/online/vocal-fix/mixing",
  },
  {
    ifYouWant: "לשחזר קלטות ישנות או דיגיטציה",
    thenGo: "שחזור ודיגיטציה",
    href: "/online/legacy-digitization",
  },
  {
    ifYouWant: "תמלול של הקלטה",
    thenGo: "תמלול",
    href: "/online/transcription",
  },
  {
    ifYouWant: "שיבוט קול או AI קולי",
    thenGo: "שיבוט קול",
    href: "/online/voice-cloning",
  },
  {
    ifYouWant: "לתקן מאשאפ דחוף ל-DJ",
    thenGo: "תיקון מאשאפ",
    href: "/online/mashup-fixer",
  },
] as const;

export const VOICEOVER_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "קריינות לפרסומת, IVR או סרטון",
    thenGo: "שירותי קריינות",
    href: "/voiceover/services",
  },
  {
    ifYouWant: "קריינות לעסק עם חשבונית",
    thenGo: "קריינות עסקית",
    href: "/business/professional-voiceover",
  },
  {
    ifYouWant: "ללמוד קריינות באולפן",
    thenGo: "קורס קריינות",
    href: "/academy/voiceover",
  },
  {
    ifYouWant: "תג קולי לדיג'יי",
    thenGo: "תגים קוליים",
    href: "/events/dj/voice-tags",
  },
] as const;

export const VIDEO_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "סרט תדמית לעסק",
    thenGo: "וידאו עסקי",
    href: "/video/corporate-video",
  },
  {
    ifYouWant: "צילום סטילס לחתונה או אירוע",
    thenGo: "צילום",
    href: "/photography",
  },
  {
    ifYouWant: "קליפ וידאו לברכה או שיר",
    thenGo: "קליפ ברכה",
    href: "/studio/blessings/video-clip",
  },
  {
    ifYouWant: "מצגת תמונות לאירוע",
    thenGo: "מצגת תמונות",
    href: "/photo-slideshow",
  },
] as const;

export const ACADEMY_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "ללמוד DJ מהבסיס עד הרחבה",
    thenGo: "קורס DJ",
    href: "/academy/dj-course",
  },
  {
    ifYouWant: "הפקת מוזיקה באולפן",
    thenGo: "הפקת מוזיקה",
    href: "/academy/music-production",
  },
  {
    ifYouWant: "קריינות מקצועית",
    thenGo: "קורס קריינות",
    href: "/academy/voiceover",
  },
  {
    ifYouWant: "שיעור אחד ממוקד, בלי קורס מלא",
    thenGo: "שיעורים פרטיים",
    href: "/academy/private-lessons",
  },
  {
    ifYouWant: "לבנות אולפן ביתי שעובד",
    thenGo: "אולפן ביתי",
    href: "/academy/home-studio",
  },
] as const;

export const PRO_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "תג קולי או קריינות לסט",
    thenGo: "תגים קוליים",
    href: "/events/dj/voice-tags",
  },
  {
    ifYouWant: "לתקן מאשאפ דחוף",
    thenGo: "תיקון מאשאפ",
    href: "/online/mashup-fixer",
  },
  {
    ifYouWant: "סטים מוכנים לדיג'יי",
    thenGo: "סטים מוכנים",
    href: "/events/dj/pre-built-sets",
  },
  {
    ifYouWant: "פס ייצור לפודקאסטים",
    thenGo: "הפקה בכמות",
    href: "/podcast/bulk-production",
  },
  {
    ifYouWant: "השכרת ציוד או כיוון מערכת",
    thenGo: "הגברה וציוד",
    href: "/events/equipment/dry-hire",
  },
] as const;

export const ATTRACTIONS_HUB_DECISIONS: readonly HubDecisionRow[] = [
  {
    ifYouWant: "עשן כבד לחופה או כניסה",
    thenGo: "עשן כבד",
    href: "/events/attractions/wedding-smoking-machine",
  },
  {
    ifYouWant: "קונפטי ברגע השיא",
    thenGo: "תותח קונפטי",
    href: "/events/attractions/confetti-cannon",
  },
  {
    ifYouWant: "זיקוקים קרים לבמה",
    thenGo: "זיקוקים קרים",
    href: "/events/attractions/cold-fireworks",
  },
  {
    ifYouWant: "חבילה משולבת במחיר אחד",
    thenGo: "חבילות אטרקציות",
    href: "/events/wedding-attractions-packages",
  },
  {
    ifYouWant: "גם DJ לאותו אירוע",
    thenGo: "DJ לאירועים",
    href: "/events/dj-events",
  },
] as const;
