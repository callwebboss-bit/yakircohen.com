export type SlideshowExampleVideo = {
  videoId: string;
  title: string;
};

export const SLIDESHOW_EXAMPLE_VIDEOS: readonly SlideshowExampleVideo[] = [
  { videoId: "4uvElfJO8CQ", title: "דוגמה  -  מצגת לאירוע" },
  { videoId: "ZYWML2R8Ujg", title: "דוגמה  -  עריכה קולנועית" },
  { videoId: "AeocfbXnZRY", title: "דוגמה  -  שילוב תמונות וסרטונים" },
  { videoId: "wgL2cix7EFA", title: "דוגמה  -  מצגת משפחתית" },
] as const;

export const SLIDESHOW_HERO_FEATURES: readonly string[] = [
  "עריכה קולנועית  -  מוכן להקרנה תוך 48 שעות",
  "כותרות פתיחה וסיום + ליווי אישי",
  "שיפור איכות תמונות ישנות (כולל AI)",
  "מוזיקה, מעברים וטקסטים מותאמים לאירוע",
  "Full HD 1080p  -  קובץ מוכן למקרן ולטלוויזיה",
] as const;

export const SLIDESHOW_INCLUDED: readonly { title: string; description: string }[] = [
  {
    title: "מיון והתאמה",
    description: "סדר כרונולוגי או לפי נושאים  -  הסיפור שלכם בצורה ברורה.",
  },
  {
    title: "שיפור איכות",
    description: "בהירות, ניגודיות ותיקון פגמים קטנים. גם סריקות ישנות.",
  },
  {
    title: "מעברים ואפקטים",
    description: "זום, פאן, דיסולב והנפשות מקצועיות  -  לא פאוורפוינט יבש.",
  },
  {
    title: "מוזיקה וטקסטים",
    description: "פסקול מותאם (שלכם או שנבחר יחד), שמות, תאריכים וציטוטים.",
  },
  {
    title: "פורמט הקרנה",
    description: "קובץ וידאו מוכן לכל סוג מסך  -  אולם, מקרן או טלוויזיה.",
  },
] as const;

export const SLIDESHOW_AUDIENCES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "💕",
    title: "חתונות",
    description: "מצגת על החתן והכלה  -  מילדות ועד היום.",
  },
  {
    emoji: "🌈",
    title: "בר/בת מצווה",
    description: "מתינוק ועד היום הגדול  -  הילדים אוהבים את זה.",
  },
  {
    emoji: "📹",
    title: "ימי הולדת",
    description: "40, 50, 60  -  סיפור החיים של בעל השמחה.",
  },
  {
    emoji: "🎨",
    title: "ימי נישואין",
    description: "25 שנה, 50 שנה  -  הזוג לאורך השנים.",
  },
] as const;

export const SLIDESHOW_PROCESS_STEPS: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "1",
    title: "שולחים חומרים",
    body: "תמונות וסרטונים ב-Drive, WeTransfer או Dropbox. גם סריקות מעובדות.",
  },
  {
    step: "2",
    title: "מגדירים ויז'ן",
    body: "שיחה קצרה על סגנון, מוזיקה, סדר כרונולוגי ורגעי שיא.",
  },
  {
    step: "3",
    title: "עריכה קולנועית",
    body: "מיון, שיפור, הנפשות, מוזיקה וטקסטים  -  עד 48 שעות (או אקספרס).",
  },
  {
    step: "4",
    title: "מסירה להקרנה",
    body: "קובץ Full HD + קישור הורדה קבוע. סבב תיקונים אחד כלול.",
  },
] as const;

export const SLIDESHOW_SONG_MISTAKES: readonly {
  title: string;
  bad: string;
  good: string;
}[] = [
  {
    title: "שיר ארוך ואיטי מדי",
    bad: "שיר של 5 דקות סלואו בלבד  -  מרדים את הקהל.",
    good: "לשלב שני שירים  -  אחד רגוע ואחד קצבי.",
  },
  {
    title: "מילים שלא מתאימות",
    bad: "לחן יפה עם מילים על פרידה או עצב.",
    good: "לבדוק תרגום ומשמעות לפני הבחירה.",
  },
  {
    title: "איכות יוטיוב נמוכה",
    bad: "הורדה מיוטיוב באיכות נמוכה  -  נשמע צורם באולם.",
    good: "קובץ מקור באיכות גבוהה  -  אנחנו מטפלים בזה.",
  },
  {
    title: "חוסר התאמה לבעל השמחה",
    bad: "מוזיקה קלאסית לאדם אנרגטי.",
    good: "שיר שמשקף אופי, גיל וסגנון החגיגה.",
  },
  {
    title: "ווליום לא אחיד",
    bad: "שיר אחד חזק ואחד חלש כשמחברים לבד.",
    good: "Normalize מקצועי  -  עוצמה אחידה לאורך המצגת.",
  },
] as const;

export const SLIDESHOW_WHY_US: readonly string[] = [
  "עריכה קולנועית  -  לא תבנית אוטומטית עם סימן מים",
  "מסירה מהירה: 1-3 ימי עסקים, אקספרס עד 24 שעות",
  "ליווי אישי מהרגע הראשון ועד ההקרנה",
  "שילוב תמונות, סרטונים וברכות מהמשפחה",
  "שיפור AI לתמונות ישנות בחבילות מתקדמות",
] as const;

export const SLIDESHOW_ACCEPTED_FORMATS: readonly string[] = [
  "תמונות: JPG, PNG",
  "סרטונים: MP4, MOV",
  "מצגות: PDF, PowerPoint",
  "לוגו: PNG, JPG, SVG",
  "כל תוכן דיגיטלי אחר  -  נסדר להקרנה חלקה",
] as const;
