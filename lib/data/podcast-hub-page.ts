export type PodcastExampleVideo = {
  videoId: string;
  title: string;
};

export const PODCAST_EXAMPLE_VIDEOS: readonly PodcastExampleVideo[] = [
  { videoId: "q1Omi-3L3QM", title: "דוגמה  -  פודקאסט מהאולפן" },
  { videoId: "eKGkeVYzUl4", title: "דוגמה  -  הפקת פודקאסט מלאה" },
] as const;

export const PODCAST_HUB_HERO_FEATURES: readonly string[] = [
  "פרק מוכן להעלאה תוך 24 שעות",
  "צילום 4K + הקלטה אולפנית + עריכה מקצועית",
  "3 חללי הקלטה  -  אורבני, ירוק או רשמי",
  "MP4 ליוטיוב · MP3 לספוטיפיי",
  "טלפרומפטר, אוזניות ומיקרופונים Shure & Rode",
] as const;

export const PODCAST_HUB_PACKAGE_HIGHLIGHTS: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🎬",
    title: "3 חללי הקלטה",
    description: "אורבני, ירוק או רשמי  -  בוחרים את האווירה שמתאימה לכם.",
  },
  {
    emoji: "🎙️",
    title: "סאונד אולפני",
    description: "מיקרופונים מקצועיים Shure & Rode  -  הקלטה ישירה למערכת אולפן.",
  },
  {
    emoji: "📹",
    title: "צילום 4K",
    description: "2–3 מצלמות, זוויות מגוונות ותאורת סטודיו מקצועית.",
  },
  {
    emoji: "📤",
    title: "מוכן להעלאה",
    description: "MP4 ליוטיוב, MP3 לספוטיפיי  -  קבצים סופיים מוכנים להפצה.",
  },
  {
    emoji: "⚡",
    title: "מוכן תוך 24 שעות",
    description: "מגיעים, מדברים  -  ויוצאים עם פרק מוכן בלי כאב ראש טכני.",
  },
  {
    emoji: "✂️",
    title: "עריכה מקצועית",
    description: "חיתוך, מעברים בין מצלמות, תיקוני צבע ושיפור סאונד.",
  },
] as const;

export const PODCAST_HUB_AUDIENCES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🏢",
    title: "חברות",
    description: "פודקאסט תדמיתי/שיווקי ברמה גבוהה  -  בלי צוות הפקה פנימי.",
  },
  {
    emoji: "🎥",
    title: "יוצרי תוכן",
    description: "להתמקד בתוכן, לא בטכניקה  -  אנחנו דואגים לשאר.",
  },
  {
    emoji: "💡",
    title: "מומחים ויועצים",
    description: "לחלוק ידע בלי להיות טכנאים  -  פשוט מגיעים ומדברים.",
  },
  {
    emoji: "📈",
    title: "בעלי עסקים",
    description: "פודקאסט מקצועי בלי להתעסק  -  תוצאה מוכנה להעלאה.",
  },
] as const;

export const PODCAST_HUB_STUDIO_SPACES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🏛️",
    title: "החלל הרשמי",
    description: "מקצועי ויוקרתי  -  עיצוב אלגנטי, תחושת פרימיום.",
  },
  {
    emoji: "🌿",
    title: "החלל הירוק",
    description: "רענן ומרגיע  -  צמחייה טבעית, אנרגיה חיובית.",
  },
  {
    emoji: "🏙️",
    title: "החלל האורבני",
    description: "מודרני ונעים  -  קירות חשופים, אווירה אורבנית.",
  },
] as const;

export const PODCAST_HUB_INCLUDED: readonly {
  title: string;
  description: string;
}[] = [
  {
    title: "סשן צילום והקלטה",
    description: "עד שעה באולפן + עריכה מקצועית מלאה.",
  },
  {
    title: "טלפרומפטר",
    description: "לא צריכים לזכור הכל  -  קוראים בנוחות מול המצלמה.",
  },
  {
    title: "אוזניות לכל משתתף",
    description: "שומעים את עצמכם בזמן אמת  -  שליטה בקצב ובביטחון.",
  },
  {
    title: "הקלטת סאונד אולפנית",
    description: "Shure, Rode, Audio-Technica  -  הקלטה ישירה למערכת אולפן.",
  },
  {
    title: "צילום וידאו",
    description: "2–3 מצלמות 4K, תאורת סטודיו, Framing מושלם.",
  },
  {
    title: "קבצים סופיים",
    description: "MP4 (1080p/4K) + MP3 מנורמל  -  מוכן להפצה.",
  },
  {
    title: "תיקוני צבע",
    description: "הכל נראה אחיד ומקצועי בין כל הזוויות.",
  },
  {
    title: "שיפור סאונד",
    description: "נורמליזציה ושיפור קולי  -  נשמע מושלם בכל פלטפורמה.",
  },
  {
    title: "חיתוך ועריכה",
    description: "הסרת טעויות, מעברים דינמיים בין מצלמות.",
  },
] as const;

export const PODCAST_HUB_WORKFLOW: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "1",
    title: "תיאום ותכנון",
    body: "יוצרים קשר, מתאמים תאריך ובוחרים חלל  -  אורבני, ירוק או רשמי.",
  },
  {
    step: "2",
    title: "הגעה לאולפן",
    body: "מגיעים לאולפן במודיעין, מתארגנים בנוחות  -  חניה בשפע.",
  },
  {
    step: "3",
    title: "הקלטה וצילום",
    body: "עד שעה של צילום  -  אתם מדברים, אנחנו דואגים לשאר.",
  },
  {
    step: "4",
    title: "עריכה מקצועית",
    body: "לוקחים את החומר ועושים ממנו פרק מושלם  -  חיתוך, צבע וסאונד.",
  },
  {
    step: "5",
    title: "פרק מוכן!",
    body: "תוך 24 שעות  -  קבצים מוכנים להעלאה לספוטיפיי ויוטיוב.",
  },
] as const;

export const PODCAST_HUB_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "duration",
    question: "שעה מספיקה?",
    answer:
      "בדרך כלל שעה מייצרת 30–60 דקות תוכן ערוך, תלוי בקצב הדיבור. אפשר להאריך בתיאום.",
  },
  {
    id: "guests",
    question: "אפשר להביא אורחים?",
    answer: "בהחלט. יש מיקרופונים ואוזניות לכמה משתתפים.",
  },
  {
    id: "revisions",
    question: "מה אם צריכים תיקונים?",
    answer: "סבב תיקונים אחד כלול. תיקונים נוספים בתוספת סמלית.",
  },
  {
    id: "visit",
    question: "אפשר לראות את הסטודיו לפני?",
    answer: "כן  -  אפשר לתאם ביקור מקדים ללא עלות.",
  },
  {
    id: "camera-shy",
    question: "מה אם לא מרגישים בנוח מול מצלמה?",
    answer:
      "זה נורמלי. נותנים כיוון ותמיכה, עוזרים להרגיש בנוח  -  ויש טלפרומפטר אם צריך.",
  },
] as const;

export const PODCAST_HUB_CTA_BENEFITS: readonly string[] = [
  "חוסכים זמן ואנרגיה",
  "תוצאה מקצועית",
  "מוכן תוך 24 שעות",
  "נוח ופשוט",
  "משתלם כלכלית",
] as const;

import { PODCAST_STARTER_PRICE } from "./podcast-calculator";

export const PODCAST_HUB_STARTING_PRICE = String(PODCAST_STARTER_PRICE);
export const PODCAST_HUB_STARTING_PRICE_NOTE =
  "לפרק של חצי שעה · אולפן במודיעין · חניה בשפע · לפני מע״מ (+18%)";
