import { STUDIO_PARKING_NOTE } from "@/lib/constants";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import type { TestimonialItem } from "@/components/marketing/Testimonials";
import { formatFromPriceDual, getExVat, PODCAST_VIDEO_CAMERAS_NOTE, PODCAST_AUDIO_SCOPE_NOTE, PODCAST_EXTRA_EDIT_NOTE, PODCAST_PACK_NOTE, STUDIO_TURNS_NOTE } from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";
import {
  PODCAST_AUDIO_PACKS,
  PODCAST_PACKAGES,
  PODCAST_STARTER_PRICE,
  podcastAudioPackLine,
  podcastParticipantPriceLine,
} from "./podcast-calculator";

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
    title: "הקלטה בלבד, בלי עריכה",
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
    /* החלטת הבעלים D63, 7.10.2026: בווידאו הפרק המלא בסוף ההקלטה. עריכה נוספת רק בהפקה המלאה */
    outcome: "MP4 ליוטיוב + MP3 לספוטיפיי, מיד בסוף ההקלטה",
    bestFor: "ראיונות, מיתוג ונוכחות ויזואלית",
    href: "/podcast/podcast-recording",
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
  TIME_CLAIMS.podcastSameSecond,
  "עד 4 מיקרופונים נפרדים בו זמנית, בחלל שמעצבים לפי מה שתרצו",
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
    title: "חלל שמשתנה לפי מה שתרצו",
    description: "אורבני, ירוק, רשמי או רקע אחר שתבחרו. אפשר לשנות גם במקום.",
  },
  {
    emoji: "🎙️",
    title: "סאונד אולפני",
    description: "מיקרופונים דינמיים מקצועיים, הקלטה ישירה למערכת אולפן.",
  },
  {
    emoji: "📹",
    title: "צילום 4K",
    /* החלטת הבעלים D63, 7.10.2026: 3 מצלמות ותאורה (היה "2-3") */
    description: `${PODCAST_VIDEO_CAMERAS_NOTE}, זוויות מגוונות ותאורת סטודיו מקצועית.`,
  },
  {
    emoji: "📤",
    title: "מוכן להעלאה",
    description: "MP3 לספוטיפיי ואפל, קובץ RSS מוכן להפצה, MP4 ליוטיוב.",
  },
  {
    emoji: "⚡",
    title: TIME_CLAIMS.podcastSameSecond,
    description: TIME_CLAIMS.podcastSameSecondLong,
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
    /* החלטת הבעלים D63, 7.10.2026: 3 מצלמות (היה "2-3") */
    description: `צילום 4K ב-${PODCAST_VIDEO_CAMERAS_NOTE}, תאורת סטודיו, framing מקצועי.`,
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
    title: "פרק מוכן",
    body: `${TIME_CLAIMS.podcastSameSecond}, מוכן להעלאה לספוטיפיי וליוטיוב.`,
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
    /* WP3 (PI-02, PB-01): העוגן הוא פרק ערוך (podcast_audio). 750 הוא חצי שעה
       חדר, קובץ גולמי בלי עריכה, ונאמר כך במפורש. */
    answer: `פרק אודיו ערוך ומוכן להפצה ${formatFromPriceDual(getExVat("podcast_audio"))}. פודקאסט וידאו ${formatFromPriceDual(getExVat("podcast_video"))}. הקלטה בלבד (חצי שעה חדר, קובץ גולמי, בלי עריכה) ${formatFromPriceDual(PODCAST_STARTER_PRICE)}. עריכת פודקאסט ${formatFromPriceDual(getExVat("podcast_editing_hour"))} לשעה. מחיר סופי לפי חבילה במחשבון בעמוד.`,
  },
  {
    id: "hub-delivery",
    question: "תוך כמה זמן מקבלים את הפרק?",
    answer: `באותה שנייה שמסיימים להקליט, בכל הקלטת פודקאסט, באולפן וגם אצלכם בבית או במשרד. ${TIME_CLAIMS.podcastSameSecondLong}`,
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
      `אולפן הפודקאסט ממוקם במודיעין - בין תל אביב לירושלים, עם גישה נוחה מכביש 1 ו-431. ${STUDIO_PARKING_NOTE}. הנסיעה מתל אביב ומירושלים לוקחת כ-30 דקות.`,
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
      `פרק אודיו ערוך ${formatFromPriceDual(getExVat("podcast_audio"))}. ${PODCAST_AUDIO_SCOPE_NOTE}, עד שעה. ${podcastParticipantPriceLine()}. הפקה מלאה עם צילום ו${PODCAST_EXTRA_EDIT_NOTE} ${formatFromPriceDual(getExVat("full_podcast_production"))}, ומגיעה עם MP4 ליוטיוב ו-MP3 להפצה בספוטיפיי ואפל פודקאסט. הקלטה בלבד, חצי שעה חדר וקובץ גולמי בלי עריכה, ${formatFromPriceDual(PODCAST_STARTER_PRICE)}. מחשבון מחירים מפורט זמין בדף זה.`,
  },
  /* החלטות 5.10.2026 (פודקאסט): חבילות פרקי אודיו במקום "הצעה לפי סדרה" */
  {
    id: "audio-packs",
    question: "יש חבילה לכמה פרקים?",
    answer: `כן. ${PODCAST_AUDIO_PACKS.map(podcastAudioPackLine).join(". ")}. ${PODCAST_PACK_NOTE}.`,
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
      /* קיבולת האולפן, החלטת הבעלים D64, 7.10.2026 */
      `המערכת מנתבת עד 4 מיקרופונים נפרדים בו זמנית, בפורמט של יחיד, זוג או פאנל מרובה משתתפים. כל משתתף מקבל מיקרופון ייעודי ואוזניות אישיות. ${STUDIO_TURNS_NOTE}.`,
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
    /* F-35 (7.10.2026): בתמונה אולפן ריק, בלי אנשים, ולכן "פודקאסט משפחתי" הטעה */
    projectImageAlt: "אולפן פודקאסט ריק עם שתי כורסאות ומיקרופון על זרוע",
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
    /* F-35: התמונה היא מיקרופון ידני בתקריב ולא הקלטת פודקאסט */
    projectImageAlt: "מיקרופון ידני מקרוב על רקע מטושטש של אורות במה",
  },
] as const;

export const PODCAST_HUB_CTA_BENEFITS: readonly string[] = [
  "חוסכים זמן ואנרגיה",
  "תוצאה מקצועית",
  TIME_CLAIMS.podcastSameSecond,
  "נוח ופשוט",
  "משתלם כלכלית",
] as const;

/*
 * WP3 (PI-02, PB-01, PJ-16, S08): "פרק מוכן להעלאה מ-750" הציג את מחיר חצי
 * שעה חדר, קובץ גולמי בלי עריכה (studio_half_hour). פרק מוכן הוא
 * podcast_audio. כולל מע״מ קודם (החלטת הבעלים 2.10.2026).
 */
const PODCAST_HUB_ANCHOR = formatPrice(getExVat("podcast_audio"), { from: true });
/** "מ-1,121 ₪ כולל מע״מ (950 ₪ + מע״מ)" */
export const PODCAST_HUB_STARTING_PRICE = PODCAST_HUB_ANCHOR.inline;
export const PODCAST_HUB_STARTING_PRICE_NOTE =
  "פרק אודיו ערוך ומוכן להפצה - אולפן במודיעין - חניה בשפע";

/** תווית CTA: תוצאה + מחיר התחלתי של אותה תוצאה */
export const PODCAST_HUB_CTA_LABEL = `פרק ערוך מוכן להעלאה ${PODCAST_HUB_ANCHOR.headline}`;

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
    subtitle: "ההקלטה, עריכת ההקלטה וחלל האולפן, או שיפור סאונד להקלטה שלכם",
    priceFrom: _audioPrice,
    features: [
      "הקלטה מלאה של עד שעה - בלי לחץ",
      "או: שיפור סאונד להקלטה קיימת שאתם מביאים",
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
      "רקע ועיצוב לפי בחירה",
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
