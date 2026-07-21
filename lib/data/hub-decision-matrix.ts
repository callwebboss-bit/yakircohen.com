export type HubDecisionRow = {
  ifYouWant: string;
  thenGo: string;
  href: string;
};

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
