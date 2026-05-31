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
    description: "2-3 מצלמות, זוויות מגוונות ותאורת סטודיו מקצועית.",
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
    description: "2-3 מצלמות 4K, תאורת סטודיו, Framing מושלם.",
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
    id: "location-modiin",
    question: "איפה נמצא האולפן ואיך מגיעים ממרכז הארץ?",
    answer:
      "אולפן הפודקאסט ממוקם במודיעין — בין תל אביב לירושלים, עם גישה נוחה מכביש 1 ו-431. חניה בשפע ממש ליד הכניסה. הנסיעה מתל אביב לוקחת כ-30 דקות ומירושלים כ-25 דקות.",
  },
  {
    id: "professional-vs-home",
    question: "מה ההבדל בין הקלטת פודקאסט באולפן מקצועי לבין הקלטה ביתית?",
    answer:
      "חדר הקלטה עם בידוד אקוסטי מלא מחסל רעשי רקע, אקו ותהודה שפוגעים באיכות ההקלטה הביתית. ציוד Shure ו-Rode מקצועי מעביר את הקול בבהירות מלאה, ושיפור הקלטות בבינה מלאכותית מנקה כל שאריות. התוצאה נשמעת כמו רדיו — לא כמו שיחת זום.",
  },
  {
    id: "price",
    question: "כמה עולה הקלטת פודקאסט מקצועית ומה כלול במחיר?",
    answer:
      "חבילת בסיס מתחילה מ-750 ₪ לפרק (לפני מע״מ) וכוללת שעת סטודיו, הקלטה, עריכה ושיפור סאונד. הפקה עם צילום 4K מתחילה מ-2,500 ₪ ומגיעה עם MP4 ליוטיוב ו-MP3 לספוטיפיי. מחשבון מחירים מפורט זמין בדף זה.",
  },
  {
    id: "duration",
    question: "שעה מספיקה להקלטת פרק?",
    answer:
      "בדרך כלל שעה מייצרת 30-60 דקות תוכן ערוך, תלוי בקצב הדיבור. אפשר להאריך בתיאום.",
  },
  {
    id: "guests",
    question: "אפשר להביא אורחים לאולפן הפודקאסט?",
    answer:
      "בהחלט. יש מיקרופונים ואוזניות לכמה משתתפים — ניתן להגיע עם אורח אחד עד שלושה.",
  },
  {
    id: "family-podcast",
    question: "אפשר להקליט פודקאסט משפחתי — למשל עם סבא וסבתא?",
    answer:
      "כן. פודקאסט משפחתי הוא אחד השירותים הפופולריים שלנו. מקליטים שיחה עם בן משפחה — סבים, הורים, ילדים — ויוצרים מזכרת קולית לדורות. ניתן לשלב עם הקלטת שיר לחוויה מלאה.",
  },
  {
    id: "revisions",
    question: "מה אם צריכים תיקונים אחרי העריכה?",
    answer: "סבב תיקונים אחד כלול בכל חבילה. תיקונים נוספים בתוספת סמלית.",
  },
  {
    id: "camera-shy",
    question: "מה אם לא מרגישים בנוח מול מצלמה?",
    answer:
      "זה נורמלי לגמרי. נותנים כיוון ותמיכה ועוזרים להרגיש בנוח — ויש טלפרומפטר אם צריך.",
  },
  {
    id: "zoom-cleanup",
    question: "האם אפשר לנקות הקלטת זום או הקלטה ביתית?",
    answer:
      "כן. שירות ניקוי רעשים ושיפור הקלטות זמין גם לקבצים שהוקלטו בבית, בזום או בכל סביבה רועשת. שולחים קובץ, ומקבלים גרסה נקייה ומושלמת תוך 24–48 שעות — בלי צורך להגיע לאולפן.",
  },
  {
    id: "time-overrun",
    question: "מה קורה אם עברנו את זמן ההקלטה בכמה דקות?",
    answer:
      "אנחנו לא עומדים עם סטופר. המטרה שלנו היא שהתוכן יצא מושלם — אם צריך עוד 10–15 דקות לסגור פרק כמו שצריך, נדאג לזה. הכי חשוב שתצאו מרוצים.",
  },
  {
    id: "mobile-national",
    question: "האם השירות זמין רק במודיעין או גם ברחבי הארץ?",
    answer:
      "האולפן הקבוע נמצא במודיעין, אך שירות האולפן הנייד מגיע אליכם לכל מקום — בית, משרד, אירוע או חלל פרטי, בכל רחבי הארץ. מתאים לפי לוחות הזמנים שלכם.",
  },
] as const;

export const PODCAST_HUB_TESTIMONIALS: readonly {
  quote: string;
  name: string;
  role: string;
}[] = [
  {
    quote:
      "תוך שעה הכנסנו, דיברנו, ויצאנו עם פרק מוכן. הסאונד יצא כמו רדיו מקצועי. ממליץ בחום.",
    name: "דניאל כ.",
    role: "בעל עסק, מודיעין",
  },
  {
    quote:
      "לא האמנתי שאפשר להקליט פודקאסט משפחתי ברמה כזאת. יקיר ידע בדיוק איך לגרום לנו להרגיש בנוח.",
    name: "מיכל ש.",
    role: "פודקאסט עם סבא",
  },
  {
    quote:
      "הגשנו 3 פרקים לספוטיפיי שבוע אחרי שהתחלנו. הצוות דאג לכל הטכנולוגיה ואנחנו רק דיברנו.",
    name: "רן א.",
    role: "יוצר תוכן, ירושלים",
  },
] as const;

export const PODCAST_HUB_CTA_BENEFITS: readonly string[] = [
  "חוסכים זמן ואנרגיה",
  "תוצאה מקצועית",
  "מוכן תוך 24 שעות",
  "נוח ופשוט",
  "משתלם כלכלית",
] as const;

import { PODCAST_PACKAGES, PODCAST_STARTER_PRICE } from "./podcast-calculator";

export const PODCAST_HUB_STARTING_PRICE = String(PODCAST_STARTER_PRICE);
export const PODCAST_HUB_STARTING_PRICE_NOTE =
  "לפרק של חצי שעה · אולפן במודיעין · חניה בשפע · לפני מע״מ (+18%)";

const _audioPrice = PODCAST_PACKAGES.find((p) => p.id === "audio")?.price ?? 950;
const _videoPrice = PODCAST_PACKAGES.find((p) => p.id === "video")?.price ?? 1650;

export const PODCAST_HUB_PRICING_PACKAGES: readonly {
  id: string;
  badge: string | null;
  title: string;
  subtitle: string;
  priceFrom: number;
  features: readonly string[];
  ctaLabel: string;
  whatsappText: string;
  highlighted: boolean;
}[] = [
  {
    id: "recording-only",
    badge: null,
    title: "הקלטה בלבד",
    subtitle: "ליוצרים שמעדיפים לערוך בעצמם",
    priceFrom: PODCAST_STARTER_PRICE,
    features: [
      "זמן הקלטה של עד 30 דקות — בלי לחץ",
      "ציוד Shure & Rode — סאונד ברמת רדיו",
      "3 חללי הקלטה לבחירה",
      "קובץ MP3 גולמי איכותי, מוכן לעריכה",
      "✓ כולל מאגר מוזיקה מורשה לשימוש חופשי",
      "✓ גיבוי חומרי גלם למשך שנה",
    ],
    ctaLabel: "בדיקת זמינות לחבילת הקלטה",
    whatsappText:
      "שלום, מעוניין/ת בחבילת הקלטה בלבד באולפן — אשמח לשמוע על זמינות.",
    highlighted: false,
  },
  {
    id: "audio-production",
    badge: "הכי פופולרי",
    title: "הפקת פודקאסט אודיו",
    subtitle: "הפתרון המלא — מגיעים, מדברים, ויוצאים",
    priceFrom: _audioPrice,
    features: [
      "הקלטה מלאה של עד שעה — בלי לחץ",
      "שיפור הקלטות וניקוי רעשים בבינה מלאכותית",
      "עריכה, מיקס ונורמליזציה מלאים",
      "MP3 מוכן לספוטיפיי, אפל פודקאסטס ועוד",
      "✓ כולל מאגר מוזיקה מורשה לשימוש חופשי",
      "✓ גיבוי מאובטח של חומרי הגלם למשך שנה",
    ],
    ctaLabel: "בדיקת זמינות לחבילת עריכה",
    whatsappText:
      "שלום, מעוניין/ת בחבילת הפקת פודקאסט אודיו — אשמח לשמוע על זמינות ומחיר.",
    highlighted: true,
  },
  {
    id: "video-premium",
    badge: null,
    title: "פודקאסט וידאו / פרימיום",
    subtitle: "מזכרת לדורות — צילום 4K וליווי אישי",
    priceFrom: _videoPrice,
    features: [
      "הקלטת פודקאסט + צילום 4K רב-מצלמת",
      "ליווי אישי לאורך כל ההפקה",
      "שיפור קול, עריכה ותיקוני צבע מקצועיים",
      "MP4 ליוטיוב + MP3 לספוטיפיי",
      "✓ כולל מאגר מוזיקה מורשה לשימוש חופשי",
      "✓ גיבוי מאובטח של חומרי הגלם למשך שנה",
    ],
    ctaLabel: "בדיקת זמינות לפרויקט פרימיום",
    whatsappText:
      "שלום, מעוניין/ת בפודקאסט וידאו / פרמיום — אשמח לפרטים ותיאום.",
    highlighted: false,
  },
] as const;
