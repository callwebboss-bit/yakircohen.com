export type AudioDemoDifficulty = "severe" | "moderate" | "polish";

export type AudioDemoStatus = "ready" | "pending";

export type AudioDemoId =
  | "weber-restoration"
  | "podcast-zoom-cleanup"
  | "recording-vocal-polish"
  | "pitch-correction"
  | "blessing-mix"
  | "full-production"
  | "funny-ringtone"
  | "singer-live-tuning";

export type AudioDemo = {
  id: AudioDemoId;
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  beforeNote?: string;
  afterNote?: string;
  difficulty: AudioDemoDifficulty;
  status: AudioDemoStatus;
  /** Hebrew disclaimer for severe / restoration demos */
  disclaimerHe?: string;
  recommendedPages: readonly string[];
  storageKey: string;
};

export const SEVERE_RESTORATION_DISCLAIMER =
  "דוגמה מהקלטה פגומה מאוד. שחזור כזה אפשרי - אבל קשה, לוקח זמן, ותלוי במקור: ככל שההקלטה המקורית ברורה יותר, התוצאה מדויקת יותר. ב-2026 הכלים משתפרים כל הזמן, אבל יש גבולות לכל הקלטה.";

export const AUDIO_DEMOS: readonly AudioDemo[] = [
  {
    id: "weber-restoration",
    beforeSrc: "/audio/weber-before_01.mp3",
    afterSrc: "/audio/weber-AFTER_01.mp3",
    beforeLabel: "הקלטה פגומה (מקור)",
    afterLabel: "אחרי שחזור מקצועי + AI",
    beforeNote: "פודקאסט ישן, הרצאה, קלטת או ארכיון - דוגמה קיצונית",
    afterNote: "ניקוי רעשים, EQ ועריכה ידנית",
    difficulty: "severe",
    status: "ready",
    disclaimerHe: SEVERE_RESTORATION_DISCLAIMER,
    recommendedPages: [
      "/podcast/podcast-editing",
      "/podcast",
      "/online/vocal-fix",
      "/online",
      "/online/audio-music",
      "/online/online-ai-pricing",
      "/online/vocal-fix/mixing",
      "/blog/ai-audio-restoration-guide",
      "/blog/sound-recovery-ai-podcast",
      "/book",
    ],
    storageKey: "weber-restoration",
  },
  {
    id: "podcast-zoom-cleanup",
    beforeSrc: "/audio/podcast-raw-sample.mp3",
    afterSrc: "/audio/podcast-clean-sample.mp3",
    beforeLabel: "הקלטת זום גולמית",
    afterLabel: "אחרי ניקוי רעשים",
    beforeNote: "רעשי רקע, אקו ותהודה בחדר",
    afterNote: "קול נקי ומאוזן - דוגמה קלה יותר",
    difficulty: "moderate",
    status: "ready",
    recommendedPages: [
      "/podcast",
      "/podcast/podcast-editing",
      "/online",
      "/online/podcast-voice",
      "/book",
    ],
    storageKey: "podcast-zoom",
  },
  {
    id: "recording-vocal-polish",
    beforeSrc: "/audio/recording-raw-sample.mp3",
    afterSrc: "/audio/recording-clean-sample.mp3",
    beforeLabel: "הקלטה גולמית באולפן",
    afterLabel: "אחרי מיקס ופיץ׳",
    beforeNote: "לפני עריכה ותיקון זיופים",
    afterNote: "מיקס, מאסטר ופיץ׳ קורקשן",
    difficulty: "polish",
    status: "ready",
    recommendedPages: [
      "/studio/recording-song-modiin",
      "/online/audio-music",
      "/book",
    ],
    storageKey: "recording-vocal",
  },
  {
    id: "pitch-correction",
    beforeSrc: "/audio/pitch-raw.mp3",
    afterSrc: "/audio/pitch-tuned.mp3",
    beforeLabel: "שירה גולמית",
    afterLabel: "אחרי תיקון זיופים",
    difficulty: "polish",
    status: "ready",
    recommendedPages: ["/online/vocal-fix/pitch-correction"],
    storageKey: "pitch-correction",
  },
  {
    id: "blessing-mix",
    beforeSrc: "/audio/bride-blessing-raw.mp3",
    afterSrc: "/audio/bride-blessing-tuned.mp3",
    beforeLabel: "ברכה גולמית",
    afterLabel: "אחרי עריכה ומוזיקה",
    beforeNote: "הקלטה ישירה ללא עיבוד",
    afterNote: "מוזיקת רקע ומיקס מקצועי",
    difficulty: "polish",
    status: "ready",
    recommendedPages: ["/studio/blessings/bride-groom-blessing"],
    storageKey: "blessing-mix",
  },
  {
    id: "full-production",
    beforeSrc: "/audio/dry-vocal-raw.mp3",
    afterSrc: "/audio/full-production.mp3",
    beforeLabel: "ווקאל יבש",
    afterLabel: "הפקה מלאה",
    beforeNote: "שירה בלי מוזיקה ובלי עיבוד",
    afterNote: "תופים, בס, הרמוניות ומיקס",
    difficulty: "polish",
    status: "ready",
    recommendedPages: [
      "/studio/recording-song-modiin",
      "/studio/recording-song-modiin/gifts/funny-ringtone",
    ],
    storageKey: "full-production",
  },
  {
    id: "funny-ringtone",
    beforeSrc: "/audio/before-rengtone.mp3",
    afterSrc: "/audio/after-ringtone.mp3",
    beforeLabel: "הקלטה גולמית",
    afterLabel: "רינגטון מוכן",
    difficulty: "polish",
    status: "ready",
    recommendedPages: ["/studio/recording-song-modiin/gifts/funny-ringtone"],
    storageKey: "funny-ringtone",
  },
  {
    id: "singer-live-tuning",
    beforeSrc: "/audio/singer-live-raw.mp3",
    afterSrc: "/audio/singer-live-tuned.mp3",
    beforeLabel: "סאונד גולמי",
    afterLabel: "אחרי כיוון אקוסטי",
    beforeNote: "ללא איזון תדרים, סכנת פידבק",
    afterNote: "RTA ואופטימיזציה לפני ההופעה",
    difficulty: "moderate",
    status: "pending",
    recommendedPages: ["/events/equipment/singer-amplification"],
    storageKey: "singer-live",
  },
] as const;

export const AUDIO_DEMO_BY_ID: Record<AudioDemoId, AudioDemo> =
  Object.fromEntries(AUDIO_DEMOS.map((d) => [d.id, d])) as Record<
    AudioDemoId,
    AudioDemo
  >;

export function getAudioDemo(id: AudioDemoId): AudioDemo {
  return AUDIO_DEMO_BY_ID[id];
}

export function getRestorationDemo(): AudioDemo {
  return AUDIO_DEMO_BY_ID["weber-restoration"];
}
