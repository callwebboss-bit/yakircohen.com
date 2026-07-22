/**
 * מסלולי החלטה בין שירותים - רק חיבור אמיתי (2–3 יעדים לדף).
 * שכבת נתונים בלבד: לא מחליפה עדיין את *_RELATED_* בדפי עלה.
 * שימוש עתידי: RelatedServices / intro / hub extras.
 */

export type DecisionPathEdge = {
  href: string;
  label: string;
  /** למה החיבור אמיתי - לסוכן ולביקורת, לא חובה ב-UI */
  reason: string;
};

export const SERVICE_DECISION_PATHS: Record<
  string,
  readonly DecisionPathEdge[]
> = {
  "/studio/mobile-studio": [
    {
      href: "/podcast/mobile-podcast-at-home",
      label: "פודקאסט נייד",
      reason: "אותו פורמט נייד - הקלטה מגיעה אליכם",
    },
    {
      href: "/business/on-site-studio",
      label: "אולפן בחברה",
      reason: "גרסת B2B של אולפן במקום הלקוח",
    },
  ],
  "/podcast/mobile-podcast-at-home": [
    {
      href: "/studio/mobile-studio",
      label: "אולפן נייד",
      reason: "אותו מודל נייד - שירה/ברכה במקום פודקאסט",
    },
    {
      href: "/podcast/podcast-editing",
      label: "עריכת פודקאסט",
      reason: "המשך טבעי אחרי הקלטה בשטח",
    },
    {
      href: "/podcast/podcast-studio-modiin",
      label: "אולפן במודיעין",
      reason: "אלטרנטיבה כשאפשר להגיע לאולפן קבוע",
    },
  ],
  "/podcast/corporate-podcast": [
    {
      href: "/business/on-site-studio",
      label: "אולפן בחברה",
      reason: "הקלטה במשרד לאותו קהל עסקי",
    },
    {
      href: "/business/content-studio",
      label: "סושיאל דאמפ",
      reason: "תוכן קצר מאותו יום צילום/הקלטה",
    },
    {
      href: "/podcast/podcast-editing",
      label: "עריכת פודקאסט",
      reason: "עריכה לפרקים עסקיים שכבר הוקלטו",
    },
  ],
  "/business/on-site-studio": [
    {
      href: "/podcast/corporate-podcast",
      label: "פודקאסט לחברות",
      reason: "אותו לקוח B2B - פורמט פודקאסט",
    },
    {
      href: "/studio/mobile-studio",
      label: "אולפן נייד",
      reason: "גרסת צרכן/אירוע של אולפן במקום הלקוח",
    },
  ],
  "/studio/recording-song-modiin": [
    {
      href: "/studio/recording-song-modiin/gifts",
      label: "שיר במתנה",
      reason: "אותו שירות במסגרת מתנה",
    },
    {
      href: "/studio/blessings",
      label: "הקלטת ברכות",
      reason: "אותו אשכול אודיו לאירוע/משפחה",
    },
    {
      href: "/studio/pricing",
      label: "מחירון אולפן",
      reason: "בחירת חבילה לפי תקציב",
    },
  ],
  "/studio/blessings": [
    {
      href: "/studio/recording-song-modiin",
      label: "הקלטת שיר",
      reason: "אותו אשכול אודיו לאירוע",
    },
    {
      href: "/studio/blessings/bride-groom-blessing",
      label: "ברכת חתן וכלה",
      reason: "תת-מסלול ברכות",
    },
    {
      href: "/studio/blessings/bar-mitzvah",
      label: "דרשה לבר מצווה",
      reason: "תת-מסלול ברכות",
    },
  ],
  "/podcast/podcast-recording": [
    {
      href: "/podcast/podcast-editing",
      label: "עריכת פודקאסט",
      reason: "המשך ישיר אחרי הקלטה",
    },
    {
      href: "/podcast/podcast-studio-modiin",
      label: "השכרת אולפן",
      reason: "רק חדר וציוד בלי הפקה מלאה",
    },
  ],
  "/podcast/podcast-editing": [
    {
      href: "/podcast/podcast-recording",
      label: "הקלטת פודקאסט",
      reason: "אם עדיין אין חומר גולמי",
    },
    {
      href: "/online/vocal-fix",
      label: "תיקון קול מרחוק",
      reason: "עריכה נקודתית בלי הפקת פרק מלא",
    },
  ],
  "/events/dj-events": [
    {
      href: "/events/attractions",
      label: "אטרקציות",
      reason: "אותו אירוע - אפקטים לצד DJ",
    },
    {
      href: "/events/wedding-attractions-packages",
      label: "חבילות לחתונה",
      reason: "DJ + אטרקציות במחיר אחד",
    },
  ],
  "/events/attractions": [
    {
      href: "/events/dj-events",
      label: "DJ לאירועים",
      reason: "אותו אירוע - מוזיקה לצד אפקטים",
    },
    {
      href: "/events/wedding-attractions-packages",
      label: "חבילות",
      reason: "שילוב אטרקציות במחיר אחד",
    },
  ],
  "/voiceover": [
    {
      href: "/business/professional-voiceover",
      label: "קריינות עסקית",
      reason: "אותו שירות במסלול B2B",
    },
    {
      href: "/academy/voiceover",
      label: "קורס קריינות",
      reason: "למידה במקום הזמנת קריין",
    },
    {
      href: "/events/dj/voice-tags",
      label: "תגים קוליים",
      reason: "קריינות ממוקדת לדיג'ייז",
    },
  ],
  "/business/professional-voiceover": [
    {
      href: "/voiceover",
      label: "מרכז קריינות",
      reason: "מסלולי קריינות כלליים",
    },
    {
      href: "/business/audio-branding",
      label: "מיתוג קולי",
      reason: "זהות קולית מורחבת לעסק",
    },
  ],
  "/online/vocal-fix": [
    {
      href: "/online/vocal-fix/pitch-correction",
      label: "תיקון זיופים",
      reason: "תת-שירות של תיקון קול",
    },
    {
      href: "/online/vocal-fix/mixing",
      label: "מיקס אונליין",
      reason: "שדרוג הפקה מלא מרחוק",
    },
  ],
} as const;

export function getDecisionPaths(
  pathname: string,
): readonly DecisionPathEdge[] {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return SERVICE_DECISION_PATHS[normalized] ?? [];
}
