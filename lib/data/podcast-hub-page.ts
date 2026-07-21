import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import type { TestimonialItem } from "@/components/marketing/Testimonials";
import { getExVat } from "@/lib/data/pricing-catalog";
import { PODCAST_PACKAGES, PODCAST_STARTER_PRICE } from "./podcast-calculator";

export type PodcastExampleVideo = {
  videoId: string;
  title: string;
};

export const PODCAST_EXAMPLE_VIDEOS: readonly PodcastExampleVideo[] = [
  { videoId: "q1Omi-3L3QM", title: "דוגמה, פודקאסט מהאולפן" },
  { videoId: "eKGkeVYzUl4", title: "דוגמה, הפקת פודקאסט מלאה" },
] as const;

/** השוואה קצרה בין שלושת המסלולים הנפוצים בעמוד ה-hub */
export const PODCAST_HUB_SERVICE_COMPARE: readonly {
  id: string;
  title: string;
  priceFrom: number;
  outcome: string;
  bestFor: string;
  href: string;
  linkLabel: string;
}[] = [
  {
    id: "recording",
    title: "הקלטה רגילה",
    priceFrom: PODCAST_STARTER_PRICE,
    outcome: "קובץ MP3 גולמי מאולפן - עד חצי שעה",
    bestFor: "פיילוט, פרק קצר, או מי שעורך בעצמו",
    href: "/book#podcast",
    linkLabel: "להזמנת הקלטה",
  },
  {
    id: "video",
    title: "פודקאסט וידאו",
    priceFrom: getExVat("podcast_video"),
    outcome: "MP4 ליוטיוב + MP3 לספוטיפיי אחרי עריכה",
    bestFor: "ראיונות, מיתוג ונוכחות ויזואלית",
    href: "/podcast/podcast-production",
    linkLabel: "לפרטי פודקאסט וידאו",
  },
  {
    id: "editing",
    title: "עריכת פודקאסט",
    priceFrom: getExVat("podcast_editing_hour"),
    outcome: "ניקוי רעשים, חיתוך ומיקס לקובץ מוכן",
    bestFor: "מי שכבר יש לו הקלטה (זום / בית / ארכיון)",
    href: "/podcast/podcast-editing",
    linkLabel: "לעריכת פודקאסט",
  },
] as const;

export const PODCAST_HUB_HERO_FEATURES: readonly string[] = [
  `פרק ${TIME_CLAIMS.podcastDelivery24h} להעלאה`,
  "4 מתחמי הקלטה עצמאיים - עד 4 מיקרופונים נפרדים בו זמנית",
  "מצלמות Sony ZV-E10 + DJI Osmo 4 + צילום 4K רב-זוויתי",
  "שרשרת סאונד אולפנית - ממשקי UAD + iZotope",
  "WAV + MP3 + MP4 + קובץ RSS + הדרכת הפצה לספוטיפיי ואפל",
] as const;

export const PODCAST_HUB_PACKAGE_HIGHLIGHTS: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🎬",
    title: "3 חללי הקלטה",
    description: "אורבני, ירוק או רשמי, בוחרים את האווירה שמתאימה לכם.",
  },
  {
    emoji: "🎙️",
    title: "סאונד אולפני",
    description: "מיקרופונים דינמיים מקצועיים, הקלטה ישירה למערכת אולפן.",
  },
  {
    emoji: "📹",
    title: "צילום 4K",
    description: "2-3 מצלמות, זוויות מגוונות ותאורת סטודיו מקצועית.",
  },
  {
    emoji: "📤",
    title: "מוכן להעלאה",
    description: "MP3 לספוטיפיי ואפל, קובץ RSS מוכן להפצה, MP4 ליוטיוב.",
  },
  {
    emoji: "⚡",
    title: TIME_CLAIMS.podcastDelivery24h,
    description: "אתם מדברים, אנחנו דואגים לטכניקה, לעריכה ולמסירה.",
  },
  {
    emoji: "✂️",
    title: "עריכה מקצועית",
    description: "חיתוך, מעברים בין מצלמות, תיקוני צבע ועריכת סאונד.",
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
    description: "פודקאסט תדמיתי/שיווקי ברמה גבוהה, בלי צוות הפקה פנימי.",
  },
  {
    emoji: "🎥",
    title: "יוצרי תוכן",
    description: "להתמקד בתוכן, לא בטכניקה, אנחנו דואגים לשאר.",
  },
  {
    emoji: "💡",
    title: "מומחים ויועצים",
    description: "לחלוק ידע בלי להיות טכנאים, פשוט מגיעים ומדברים.",
  },
  {
    emoji: "📈",
    title: "בעלי עסקים",
    description: "פודקאסט מקצועי בלי להתעסק, תוצאה מוכנה להעלאה.",
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
    description: "מקצועי ויוקרתי, עיצוב אלגנטי, תחושת פרימיום.",
  },
  {
    emoji: "🌿",
    title: "החלל הירוק",
    description: "רענן - צמחייה טבעית ואור טבעי.",
  },
  {
    emoji: "🏙️",
    title: "החלל האורבני",
    description: "מודרני ונעים, קירות חשופים, אווירה אורבנית.",
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
    description: "לא צריכים לזכור הכל, קוראים בנוחות מול המצלמה.",
  },
  {
    title: "אוזניות לכל משתתף",
    description: "שומעים את עצמכם בזמן אמת, שליטה בקצב ובביטחון.",
  },
  {
    title: "הקלטת סאונד אולפנית",
    description: "מיקרופונים ומגברים מקצועיים, הקלטה ישירה למערכת אולפן.",
  },
  {
    title: "צילום וידאו",
    description: "2-3 מצלמות 4K, תאורת סטודיו, framing מקצועי.",
  },
  {
    title: "קבצים סופיים",
    description: "MP4 (1080p/4K) + MP3 מנורמל, מוכן להפצה.",
  },
  {
    title: "תיקוני צבע",
    description: "הכל נראה אחיד ומקצועי בין כל הזוויות.",
  },
  {
    title: "שיפור סאונד",
    description: "נורמליזציה ושיפור קולי, נשמע ברור ומאוזן בכל פלטפורמה.",
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
    body: "יוצרים קשר, מתאמים תאריך ובוחרים חלל, אורבני, ירוק או רשמי.",
  },
  {
    step: "2",
    title: "הגעה לאולפן",
    body: "מגיעים לאולפן במודיעין, מתארגנים בנוחות, חניה בשפע.",
  },
  {
    step: "3",
    title: "הקלטה וצילום",
    body: "עד שעה של צילום, אתם מדברים, אנחנו דואגים לשאר.",
  },
  {
    step: "4",
    title: "עריכה מקצועית",
    body: "לוקחים את החומר ועורכים אותו, חיתוך, תיקוני צבע וסאונד מקצועי.",
  },
  {
    step: "5",
    title: "פרק מוכן!",
    body: `${TIME_CLAIMS.podcastDelivery24h}, קבצים מוכנים להעלאה לספוטיפיי ויוטיוב.`,
  },
] as const;

export const PODCAST_HUB_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "hub-price-start",
    question: "כמה עולה פודקאסט באולפן?",
    answer: `הקלטה רגילה מתחילה מ-${PODCAST_STARTER_PRICE.toLocaleString("he-IL")} ₪ לפני מע״מ (עד חצי שעה). פודקאסט וידאו מ-${getExVat("podcast_video").toLocaleString("he-IL")} ₪. עריכת פודקאסט מ-${getExVat("podcast_editing_hour").toLocaleString("he-IL")} ₪ לשעה. מחיר סופי לפי חבילה במחשבון בעמוד.`,
  },
  {
    id: "hub-delivery",
    question: "תוך כמה זמן מקבלים את הפרק?",
    answer: `${TIME_CLAIMS.podcastDelivery24h} להעלאה ברוב החבילות. פרויקטים מורכבים נמסרים עד 4 ימים.`,
  },
  {
    id: "hub-who-for",
    question: "למי מתאים השירות?",
    answer:
      "ליוצרי תוכן, עסקים, מומחים ומשפחות שרוצים פרק מוכן בלי לנהל ציוד ועריכה. אם כבר יש הקלטה - מספיק מסלול עריכת פודקאסט.",
  },
  {
    id: "location-modiin",
    question: "איפה נמצא האולפן ואיך מגיעים ממרכז הארץ?",
    answer:
      "אולפן הפודקאסט ממוקם במודיעין - בין תל אביב לירושלים, עם גישה נוחה מכביש 1 ו-431. חניה בשפע ממש ליד הכניסה. הנסיעה מתל אביב לוקחת כ-30 דקות ומירושלים כ-25 דקות.",
  },
  {
    id: "professional-vs-home",
    question: "מה ההבדל בין הקלטת פודקאסט באולפן מקצועי לבין הקלטה ביתית?",
    answer:
      "חדר הקלטה עם בידוד אקוסטי מלא מחסל רעשי רקע, אקו ותהודה שפוגעים באיכות ההקלטה הביתית. ציוד ההקלטה המקצועי מעביר את הקול בבהירות מלאה, ושיפור הקלטות בבינה מלאכותית מנקה כל שאריות. התוצאה בטווח שידורי מקצועי - לא כמו שיחת זום.",
  },
  {
    id: "price",
    question: "כמה עולה הקלטת פודקאסט מקצועית ומה כלול במחיר?",
    answer:
      "חבילת בסיס מתחילה מ-750 ₪ לפרק (לפני מע״מ) וכוללת שעת סטודיו, הקלטה ועריכת סאונד מקצועית. הפקה עם צילום 4K מתחילה מ-2,500 ₪ ומגיעה עם MP4 ליוטיוב, MP3 להפצה לספוטיפיי ואפל פודקאסט. מחשבון מחירים מפורט זמין בדף זה.",
  },
  {
    id: "duration",
    question: "שעה מספיקה להקלטת פרק?",
    answer:
      "בדרך כלל שעה מייצרת 30-60 דקות תוכן ערוך, תלוי בקצב הדיבור. אפשר להאריך בתיאום.",
  },
  {
    id: "guests",
    question: "כמה משתתפים יכולים להקליט בו זמנית?",
    answer:
      "המערכת מנתבת עד 4 מיקרופונים נפרדים בו זמנית, בפורמט של יחיד, זוג או פאנל מרובה משתתפים. כל משתתף מקבל מיקרופון ייעודי ואוזניות אישיות.",
  },
  {
    id: "deliverables",
    question: "אילו חומרים מתקבלים בסוף התהליך?",
    answer:
      "התוצרים כוללים קבצי WAV ו-MP3, גרסה חתוכה, תוספות מוזיקה (פתיח וסגיר), וקובץ וידאו MP4. בנוסף ניתנת עזרה טכנית בהעלאה, הדרכה על תהליך ההפצה, הדרכת סושיאל ואפשרות לניהול מלא של הפודקאסט.",
  },
  {
    id: "remote-recording",
    question: "האם קיימת אפשרות להקלטה ועריכה מרחוק?",
    answer:
      "כן. המערכת תומכת בהקלטה מרחוק, עריכה מרחוק וביצוע עריכה מיד בתום הצילום. שולחים קובץ גולמי ומקבלים פרק מוכן - בלי צורך להגיע לאולפן.",
  },
  {
    id: "family-podcast",
    question: "אפשר להקליט פודקאסט משפחתי - למשל עם סבא וסבתא?",
    answer:
      "כן. פודקאסט משפחתי הוא אחד השירותים הפופולריים שלנו. מקליטים שיחה עם בן משפחה - סבים, הורים, ילדים - ויוצרים מזכרת קולית לדורות. ניתן לשלב עם הקלטת שיר לחוויה מלאה.",
  },
  {
    id: "hardware-backup",
    question: "האם יש גיבוי לציוד?",
    answer:
      "כן. קיים גיבוי חומרתי מלא לכל רכיב קריטי בתהליך ההקלטה - ממשק אודיו, מיקרופונים ומצלמות. הסשן לא נעצר עקב תקלת ציוד.",
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
      "שכיח מאוד. נותנים כיוון ותמיכה לגבי נוכחות מצלמה - ויש טלפרומפטר אם צריך.",
  },
  {
    id: "zoom-cleanup",
    question: "האם אפשר לנקות הקלטת זום או הקלטה ביתית?",
    answer:
      "כן. שירות ניקוי רעשים ושיפור הקלטות זמין גם לקבצים שהוקלטו בבית, בזום או בכל סביבה רועשת. שולחים קובץ, ומקבלים גרסה נקייה ומעובדת תוך 24-48 שעות - בלי צורך להגיע לאולפן.",
  },
  {
    id: "time-overrun",
    question: "מה קורה אם עברנו את זמן ההקלטה בכמה דקות?",
    answer:
      "אנחנו לא עומדים עם סטופר. המטרה שלנו היא שהתוכן יצא מוכן ומדויק - אם צריך עוד 10-15 דקות לסגור פרק כמו שצריך, נדאג לזה.",
  },
  {
    id: "mobile-national",
    question: "האם השירות זמין רק במודיעין או גם ברחבי הארץ?",
    answer:
      "האולפן הקבוע נמצא במודיעין, אך שירות האולפן הנייד מגיע אליכם לכל מקום - בית, משרד, אירוע או חלל פרטי, בכל רחבי הארץ. מתאים לפי לוחות הזמנים שלכם.",
  },
] as const;

export const PODCAST_HUB_TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: "podcast-hub-1",
    quote:
      "תוך שעה הכנסנו, דיברנו, ויצאנו עם פרק מוכן. הסאונד יצא כמו רדיו מקצועי. ממליץ בחום.",
    name: "דניאל כ.",
    role: "בעל עסק, מודיעין",
    initials: "דכ",
    datePublished: "2025-07-18",
    serviceCategory: "podcast",
    serviceHref: "/podcast",
    serviceLabel: "אולפן פודקאסט",
    projectImageSrc:
      "/images/services/academy/music-production/אולפני יקיר כהן הפקות פודקאסט.webp",
    projectImageAlt: "הקלטת פודקאסט באולפן",
  },
  {
    id: "podcast-hub-2",
    quote:
      "לא האמנתי שאפשר להקליט פודקאסט משפחתי ברמה כזאת. יקיר ידע בדיוק איך לגרום לנו להרגיש בנוח.",
    name: "מיכל ש.",
    role: "פודקאסט עם סבא",
    initials: "מש",
    datePublished: "2025-11-02",
    serviceCategory: "podcast",
    serviceHref: "/podcast/podcast-with-grandpa",
    serviceLabel: "פודקאסט עם סבא",
    projectImageSrc:
      "/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp",
    projectImageAlt: "פודקאסט משפחתי באולפן",
  },
  {
    id: "podcast-hub-3",
    quote:
      "הגשנו 3 פרקים לספוטיפיי שבוע אחרי שהתחלנו. הצוות דאג לכל הטכנולוגיה ואנחנו רק דיברנו.",
    name: "רן א.",
    role: "יוצר תוכן, ירושלים",
    initials: "רא",
    datePublished: "2026-01-22",
    serviceCategory: "podcast",
    serviceHref: "/podcast/podcast-production",
    serviceLabel: "הפקת פודקאסט",
    projectImageSrc:
      "/images/services/events/equipment/singer-amplification/מיקרופון שור לזמרים.webp",
    projectImageAlt: "הקלטת פודקאסט",
  },
] as const;

export const PODCAST_HUB_CTA_BENEFITS: readonly string[] = [
  "חוסכים זמן ואנרגיה",
  "תוצאה מקצועית",
  TIME_CLAIMS.podcastDelivery24h,
  "נוח ופשוט",
  "משתלם כלכלית",
] as const;

export const PODCAST_HUB_STARTING_PRICE = String(PODCAST_STARTER_PRICE);
export const PODCAST_HUB_STARTING_PRICE_NOTE =
  "לפרק של חצי שעה - אולפן במודיעין - חניה בשפע - לפני מע״מ (+18%)";

/** תווית CTA: תוצאה + מחיר התחלתי קיים */
export const PODCAST_HUB_CTA_LABEL = `פרק מוכן להעלאה מ-${PODCAST_STARTER_PRICE.toLocaleString("he-IL")} ₪`;

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
    id: "video-premium",
    badge: null,
    title: "פודקאסט וידאו / פרימיום",
    subtitle: "מזכרת לדורות - צילום 4K וליווי אישי",
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
      "שלום, מעוניין/ת בפודקאסט וידאו / פרמיום - אשמח לפרטים ותיאום.",
    highlighted: false,
  },
  {
    id: "audio-production",
    badge: "הכי פופולרי",
    title: "הפקת פודקאסט אודיו",
    subtitle: "הפתרון המלא - שעת סטודיו, עריכה וקובץ מוכן",
    priceFrom: _audioPrice,
    features: [
      "הקלטה מלאה של עד שעה - בלי לחץ",
      "שיפור הקלטות וניקוי רעשים בבינה מלאכותית",
      "עריכה, מיקס ונורמליזציה מלאים",
      "MP3 מוכן לספוטיפיי, אפל פודקאסטס ועוד",
      "✓ כולל מאגר מוזיקה מורשה לשימוש חופשי",
      "✓ גיבוי מאובטח של חומרי הגלם למשך שנה",
    ],
    ctaLabel: "בדיקת זמינות לחבילת עריכה",
    whatsappText:
      "שלום, מעוניין/ת בחבילת הפקת פודקאסט אודיו - אשמח לשמוע על זמינות ומחיר.",
    highlighted: true,
  },
  {
    id: "recording-only",
    badge: null,
    title: "הקלטה בלבד",
    subtitle: "ליוצרים שמעדיפים לערוך בעצמם",
    priceFrom: PODCAST_STARTER_PRICE,
    features: [
      "זמן הקלטה של עד 30 דקות - בלי לחץ",
      "ציוד הקלטה מקצועי - סאונד ברמת רדיו",
      "3 חללי הקלטה לבחירה",
      "קובץ MP3 גולמי איכותי, מוכן לעריכה",
      "✓ כולל מאגר מוזיקה מורשה לשימוש חופשי",
      "✓ גיבוי חומרי גלם למשך שנה",
    ],
    ctaLabel: "בדיקת זמינות לחבילת הקלטה",
    whatsappText:
      "שלום, מעוניין/ת בחבילת הקלטה בלבד באולפן - אשמח לשמוע על זמינות.",
    highlighted: false,
  },
] as const;
