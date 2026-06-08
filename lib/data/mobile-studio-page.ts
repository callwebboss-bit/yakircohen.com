export type MobileStudioChecklistItem = {
  title: string;
  description: string;
};

export type MobileStudioAudienceCase = {
  title: string;
  description: string;
};

export type MobileStudioExampleVideo = {
  videoId?: string;
  title: string;
};

export const MOBILE_STUDIO_HIGHLIGHTS: readonly string[] = [
  "פתרון מושלם לקבוצות גדולות, משפחות וארגונים",
  "מפיק מוזיקלי צמוד לאורך כל ההקלטה",
  "מיקרופונים ואקוסטיקה ניידת ברמה הגבוהה ביותר",
] as const;

export const MOBILE_STUDIO_CHECKLIST: readonly MobileStudioChecklistItem[] = [
  {
    title: "חדר סגור",
    description: "כל חדר שקט (סלון, כיתה או משרד) יעשה את העבודה.",
  },
  {
    title: "נקודת חשמל",
    description: "שקע סטנדרטי אחד פנוי  -  זה כל מה שצריך מכם.",
  },
  {
    title: "כיבוד קל ואנרגיות",
    description:
      "המיקרופונים, הפנלים האקוסטיים והמפיק  -  אנחנו מביאים ומתקינים.",
  },
  {
    title: "זמן הקמה",
    description:
      "מגיעים כ-30 דקות לפני ההקלטה כדי להקים את הציוד ולבדוק סאונד.",
  },
] as const;

export const MOBILE_STUDIO_AUDIENCE: readonly MobileStudioAudienceCase[] = [
  {
    title: "הקלטות לקבוצות גדולות",
    description:
      "שכבה שלמה בבית ספר, צוות במשרד או משפחה מורחבת  -  הרבה יותר פשוט להביא את המפיק אליכם.",
  },
  {
    title: "נוחות לילדים ונוער",
    description:
      "שיר לבר/בת מצווה בסביבה מוכרת מוריד לחץ ועוזר להשתחרר מול המיקרופון.",
  },
  {
    title: "הפקת תוכן לארגונים",
    description:
      "ימי גיבוש או סרטוני תדמית עם הקלטת שיר משותף באתר הלקוח.",
  },
] as const;

export const MOBILE_STUDIO_WHATS_INCLUDED: readonly string[] = [
  "מחשב עוצמתי",
  "כרטיס קול מקצועי",
  "מיקרופון איכותי",
  "אוזניות",
  "ציוד נלווה",
  "איש מקצוע שמלווה אתכם לאורך כל הדרך",
] as const;

export const MOBILE_STUDIO_CLIP_FEATURES: readonly string[] = [
  "צילום במצלמות DSLR",
  "סנכרון מלא לשיר שהוקלט",
  "צילום בבית, בחצר או בכל לוקיישן שתבחרו",
  "תוצאה שנראית כמו קליפ אמיתי",
] as const;

/** דוגמאות וידאו - videoId מ-youtube-embeds / המאגר */
export const MOBILE_STUDIO_EXAMPLE_VIDEOS: readonly MobileStudioExampleVideo[] = [
  {
    videoId: "UECS5GpAck4",
    title: "הקלטה ניידת באיכות אולפן - דוגמה מהשטח",
  },
  {
    videoId: "ne023hwMqH0",
    title: "הקלטת קבוצה - איך נראה סשן באולפן",
  },
] as const;
