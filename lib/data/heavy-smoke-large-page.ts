/** SEO: primary H1 targets "השכרת עשן כבד לאירועים גדולים" */
export const HEAVY_SMOKE_SLOGAN_LINES: readonly string[] = [
  "ענן צח שמרחף בגובה מושלם",
  "מגע רך  -  אפשר לחוש, לא לראות",
  "טכנולוגיה שיודעת להיעלם",
  "אפקט שנשאר בדיוק כמה שצריך",
] as const;

export const HEAVY_SMOKE_MACHINE_WINS: readonly { title: string; description: string }[] = [
  {
    title: "דחיפה כפולה (2 צינורות)",
    description: "פיזור רחב, אחיד ומהיר  -  גם באולמות ענקיים.",
  },
  {
    title: "שליטה בעוצמות",
    description: "צפיפות וגובה ריחוף מדויקים לפי האירוע.",
  },
  {
    title: "טמפרטורה מבוקרת",
    description: "עשן כבד ונמוך  -  לא מתפזר מהר לאוויר.",
  },
  {
    title: "פיזור עדין",
    description: "ללא גושים או כתמים  -  מראה חלק ויוקרתי.",
  },
] as const;

export const HEAVY_SMOKE_SAFETY: readonly string[] = [
  "בטוח לשימוש  -  לא רעיל, נשימה חופשית (כולל ילדים)",
  "ללא כתמים על רצפה, בגדים או ציוד",
  "יבש לחלוטין  -  ללא החלקה",
  "לא משאיר ריח או משקעים  -  רק זיכרונות",
] as const;

export const HEAVY_SMOKE_EVENT_TYPES: readonly {
  emoji: string;
  title: string;
  description: string;
  href?: string;
}[] = [
  {
    emoji: "👰",
    title: "עשן כבד לחופה",
    description: "נמוך  -  מעטר את הרגליים, לא מסתיר את הזוג.",
    href: "/events/attractions/wedding-smoking-machine",
  },
  {
    emoji: "💃",
    title: "עשן כבד לסלואו",
    description: "אפקט קולנועי לריקוד הראשון.",
    href: "/events/attractions/wedding-smoking-machine",
  },
  {
    emoji: "🎉",
    title: "אירועים גדולים והפקות",
    description: "כיסוי מלא  -  שילוב זיקוקים קרים או קונפטי.",
    href: "/events/wedding-attractions-packages",
  },
] as const;

export const HEAVY_SMOKE_INCLUDES: readonly string[] = [
  "מערכת 2 צינורות (Dual Nozzles)",
  "שליטה בעוצמות וצפיפות",
  "מפעיל מקצועי צמוד לאורך האירוע",
  "מתאים מחופה אינטימית ועד אולמות ענק",
] as const;

export const HEAVY_SMOKE_WHY_US: readonly string[] = [
  "מפעיל מנוסה  -  יודע מתי להפעיל ולעצור",
  "איכות ללא פשרות  -  אפקט 9.9/10",
  "מכונות חזקות  -  כיסוי מרבי",
  "שירות אישי  -  ייעוץ, לא רק השכרה",
] as const;
