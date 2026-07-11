import type { ProcessStep } from "@/components/marketing/ProcessSteps";
import type { AudioDemoId } from "@/lib/data/audio-demos";
import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";

export type PitchBeforeAfterDemo = {
  demoId: AudioDemoId;
  title: string;
  description: string;
  compact?: boolean;
};

/** /online/vocal-fix/pitch-correction - דוגמאות וידאו */
export const PITCH_CORRECTION_VIDEOS: readonly RecordingSongExampleVideo[] = [
  {
    videoId: "LKg3pwdon_M",
    title: "קליפ מתננה - שיר מתנה לחברה עם הקדשה אישית",
    description:
      "אחרי שמעים את לפני/אחרי - צפו בקליפ המלא מהאולפן.",
  },
  {
    videoId: "azLQjB4y2vM",
    title:
      "תיקון זיופים מרחוק - מקליטים באולפן אחר ומשתמשים בשירות חיצוני",
  },
  {
    videoId: "aTGqFnijz0Q",
    title: "הדרכת תיקון זיופים - Pitch Correction",
  },
] as const;

export const PITCH_BEFORE_AFTER_DEMOS: readonly PitchBeforeAfterDemo[] = [
  {
    demoId: "proposal-gift-pitch",
    title: "מתלבטים עם תיקון זיופים? שמעו קודם, ואז צפו בקליפ",
    description:
      "שיר מתנה לחברה/בת זוג - אותו קטע לפני ואחרי תיקון זיופים. מתאים גם להצעת נישואין ולמתנות אישיות.",
  },
  {
    demoId: "pitch-correction",
    title: "תיקון זיופים על חומר איכותי",
    description: "אותו קטע שירה לפני ואחרי עריכה ידנית של תיקון זיופים.",
  },
  {
    demoId: "pitch-correction-remote",
    title: "תיקון מרחוק על הקלטה שלא אצלנו",
    description:
      "לקוחה שלחה לנו שיר שהוקלט ונערך במקום אחר. תיקנו את הזיופים מרחוק. השיפור אמיתי, אבל התקרה נמוכה יותר ממה שאפשר כשמקליטים ומלטשים אצלנו באולפן.",
    compact: true,
  },
];

export const PITCH_PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "שולחים את השיר",
    description: "קובץ MP3/WAV של ההקלטה - מהטלפון, מהמחשב או מכל מקור.",
  },
  {
    number: 2,
    title: "ניתוח הזיופים",
    description: "מזהים ומסמנים את כל הזיופים והטעויות בשיר.",
  },
  {
    number: 3,
    title: "תיקון ידני",
    description: "לא Auto-Tune אוטומטי - מתקנים ידנית כל תו, שומרים על הוויברטו והרגש.",
  },
  {
    number: 4,
    title: "מקבלים שיר מתוקן",
    description: "קובץ חדש, ללא זיופים, נשמע טבעי - תוך 3-5 ימי עסקים.",
  },
];

export const PITCH_STUDIO_EXPERIENCE: readonly {
  title: string;
  body: string;
}[] = [
  {
    title: "הדרכה קולית תוך כדי",
    body: "אנחנו לא רק מתקנים אחרי שאתם הולכים. מנחים אתכם בזמן אמת איך להפיק את הקול נכון יותר.",
  },
  {
    title: "הקסם של המניפולציה העדינה",
    body: 'החוויה של לשמוע את עצמך פתאום "יושב" בול על הסולם היא מרגשת. "וואו, זה באמת אני?!"',
  },
  {
    title: "אפס שיפוטיות",
    body: 'באולפן אין "טעות", יש רק "ניסיון נוסף". מרגיעים, מדריכים ומוציאים מכם את המקסימום בחיוך.',
  },
] as const;

export const PITCH_WHO_FOR: readonly string[] = [
  "זמרים של מקלחת: שיר ראשון בלי לפחד",
  "מתנה בהפתעה: שיר לחתונה או בר מצווה",
  "יוצרים בתחילת הדרך: סקיצה מקצועית לשלב הבא",
] as const;

export const PITCH_AUDIENCE: readonly { icon: string; title: string; body: string }[] = [
  {
    icon: "🎤",
    title: "זמרים חובבנים",
    body: "רוצים להקליט שיר אבל לא מושלמים? אנחנו נתקן.",
  },
  {
    icon: "🎵",
    title: "קאברים",
    body: "הקלטתם קאבר אבל יש כמה טעויות? זה הפתרון.",
  },
  {
    icon: "💍",
    title: "שירים לאירועים",
    body: "שיר כניסה לחופה, שיר במתנה - חייב להיות מושלם.",
  },
  {
    icon: "🎁",
    title: "מתנות",
    body: "רוצים לתת שיר במתנה אבל מתביישים מהזיופים?",
  },
  {
    icon: "📹",
    title: "יוצרי תוכן",
    body: "שרים בסרטונים ורוצים שזה יישמע טוב?",
  },
] as const;

export const PITCH_STEPS: readonly { step: string; body: string }[] = [
  { step: "שלב 1: שולחים את השיר", body: "קובץ MP3/WAV של ההקלטה." },
  { step: "שלב 2: אנחנו מנתחים", body: "מזהים את כל הזיופים והטעויות." },
  {
    step: "שלב 3: תיקון ידני",
    body: 'לא סתם "Auto-Tune אוטומטי" - מתקנים ידנית כל תו.',
  },
  {
    step: "שלב 4: מקבלים שיר מתוקן",
    body: "קובץ חדש, ללא זיופים, נשמע טבעי.",
  },
] as const;

export const PITCH_MANUAL_METHOD: readonly string[] = [
  "תיקון ידני של כל תו",
  "שמירה על הוויברטו והרגש",
  "לא נשמע מלאכותי",
] as const;

export const PITCH_PRICE_INCLUDED: readonly string[] = [
  "תיקון זיופים מקצועי",
  "עד 4 דקות (שיר סטנדרטי)",
  "שמירה על הקול הטבעי",
  "אספקה תוך 3-5 ימים",
  "קובץ MP3/WAV מתוקן",
] as const;
