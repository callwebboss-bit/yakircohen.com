import {
  BAT_MITZVAH_CLIP_TYPES,
  BAT_MITZVAH_CLIP_VIDEOS,
  BAT_MITZVAH_FEATURED_VIDEO_ID,
  BAT_MITZVAH_PRODUCTION_STYLES,
} from "@/lib/data/bat-mitzvah-gifts-page";
import { RINGTONE_PAGE_PATH } from "@/lib/data/funny-ringtone-page";
import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";
import {
  formatMeNis,
  formatNis,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "@/lib/data/pricing";
import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";

export {
  BAT_MITZVAH_CLIP_TYPES,
  BAT_MITZVAH_CLIP_VIDEOS,
  BAT_MITZVAH_FEATURED_VIDEO_ID,
  BAT_MITZVAH_PRODUCTION_STYLES,
};

export type StudioGiftIdea = {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlights: readonly string[];
  href: string;
  videoId: string;
  videoTitle: string;
  whatsappText: string;
  utmCampaign: string;
};

/** קישורים פנימיים בין עמודי מתנות / שוברים */
export const STUDIO_GIFT_QUICK_LINKS: readonly {
  href: string;
  label: string;
}[] = [
  { href: RINGTONE_PAGE_PATH, label: "רינגטון מצחיק במתנה" },
  { href: "/studio/blessings/bat-mitzvah-clip", label: "קליפ בת/בר מצווה" },
  { href: "/voucher", label: "שובר מתנה" },
  { href: "/podcast/podcast-with-grandpa", label: "פודקאסט עם סבא" },
  { href: "/studio/recording-song-modiin", label: "הקלטת שיר במודיעין" },
] as const;

export const GIFT_VOUCHER_STEPS: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "1",
    title: "בוחרים את החוויה",
    body: "כל שירות שמופיע באתר - הקלטת שיר, פודקאסט עם סבא, ברכה, קליפ, פודקאסט באולפן ועוד. המחיר לפי השירות שבחרתם, לא סכום קבוע.",
  },
  {
    step: "2",
    title: "שובר מתנה מסומן",
    body: "מזמינים שובר ומציינים במפורש שמדובר במתנה. אפשר לשלב טווח תקציב או שירות מדויק - נכין שובר מעוצב עם פרטי מימוש.",
  },
  {
    step: "3",
    title: "המקבל מממש מתי שנוח",
    body: "הנמען בוחר תאריך, מגיע לאולפן במודיעין (או שירות בשטח לפי סוג) וחווה את החוויה. אתם נשארים עם הרגע, לא עם עוד חפץ.",
  },
] as const;

export const STUDIO_GIFT_IDEAS: readonly StudioGiftIdea[] = [
  {
    id: "grandpa-podcast",
    badge: "מתנה משפחתית",
    title: "פודקאסט עם סבא וסבתא",
    description:
      "מתנה שיוצאת דופן ליובל, יום הולדת או סתם כי אוהבים את המשפחה: שיחה מוקלטת, שיר באולפן ומזכרת לדורות. מושלם למי שמחפש מתנה משמעותית, לא עוד מוצר.",
    highlights: [
      "חוויה משותפת לכל המשפחה",
      "אפשרות לשלב הקלטת שיר או קטעים מהשיחה",
      "מסירה דיגיטלית לשיתוף בוואטסאפ",
    ],
    href: "/podcast/podcast-with-grandpa",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["podcast-with-grandpa"],
    videoTitle: "פודקאסט עם סבא - דוגמה",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - פודקאסט עם סבא/סבתא. אשמח לפרטים.",
    utmCampaign: "gift_grandpa_podcast",
  },
  {
    id: "bat-mitzvah",
    badge: "בר/בת מצווה",
    title: "הקלטת שיר וקליפ לבת/בר מצווה",
    description:
      "שיר אישי, קליפ בהפתעה עם המשפחה או סולו במרכז - הפקה מלאה באולפן. מתנה שהאולם לא ישכח: מרגש, מקצועי ומותאם לכלת או חתן השמחה.",
    highlights: [
      "שאלון סיפור אישי וכתיבת מילים",
      "ליווי גם למי שלא זמר/ית",
      "קובץ להקרנה באולם + גרסה לרשתות",
    ],
    href: "/studio/blessings/bat-mitzvah-clip",
    videoId: BAT_MITZVAH_FEATURED_VIDEO_ID,
    videoTitle: "קליפ בת מצווה - תמונות ילדות וקליפ מהאולפן",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - הקלטת שיר/קליפ לבת או בר מצווה.",
    utmCampaign: "gift_bat_mitzvah",
  },
  {
    id: "birthday-song",
    badge: "יום הולדת",
    title: "שיר מתנה ליום הולדת",
    description:
      "יום חוויה באולפן: הקלטה, עריכה ומיקס מקצועי. מתנה מקורית לגיל 30, 40, 50 או לילד/ה - שיר שנשאר לכל החיים.",
    highlights: [
      "מתאים לכל גיל",
      "אפשר שיר מוכן או מילים אישיות",
      "חוויה בלתי נשכחת גם בלי אירוע גדול",
    ],
    href: "/studio/recording-song-modiin",
    videoId: "c55HTqTArFo",
    videoTitle: "מתנה ליום הולדת באולפן",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - שיר ליום הולדת באולפן.",
    utmCampaign: "gift_birthday_song",
  },
  {
    id: "blessing-couple",
    badge: "חתונה",
    title: "ברכת חתן וכלה באולפן",
    description:
      "מתנה לפני החתונה: הקלטה שקטה, מיקס מקצועי ומוזיקת רקע. מרגש את ההורים, את הזוג והאורחים - בלי לחץ של במה.",
    highlights: [
      "ליווי בניסוח הברכה",
      "אווירה אינטימית באולפן",
      "קובץ מוכן להקרנה בחופה או במסיבה",
    ],
    href: "/studio/blessings/bride-groom-blessing",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["blessings-hub"],
    videoTitle: "הקלטת ברכות באולפן",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - ברכת חתן/כלה באולפן.",
    utmCampaign: "gift_wedding_blessing",
  },
  {
    id: "song-and-clip",
    badge: "שיר + וידאו",
    title: "שיר וקליפ במתנה",
    description:
      "הפקה משולבת: הקלטה, צילום ועריכת וידאו. מתנה ויזואלית ומוזיקלית - לחתונה, יום הולדת או הפתעה למישהו שאתם אוהבים.",
    highlights: [
      "סאונד ווידאו תחת קורת גג אחת",
      "סגנון מוזיקלי MTv או מרגש",
      "מסירה ב-Full HD",
    ],
    href: "/studio/blessings/video-clip",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["blessings-video-clip"],
    videoTitle: "שיר וקליפ - דוגמה",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - שיר וקליפ באולפן.",
    utmCampaign: "gift_song_clip",
  },
  {
    id: "podcast-studio",
    badge: "פודקאסט",
    title: "הקלטת פודקאסט באולפן",
    description:
      "מתנה ליזם, לבן משפחה או לחברה קטנה: פרק מוקלט, עריכה ומסירה מוכנה להעלאה. חוויה מקצועית במודיעין.",
    highlights: [
      "אולפן מצויד לפודקאסט",
      "אפשרות ל-2-4 משתתפים",
      "ליווי טכני ואקוסטי",
    ],
    href: "/podcast/podcast-studio-modiin",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["podcast-studio"],
    videoTitle: "אולפן פודקאסט - היכרות",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - הקלטת פודקאסט באולפן.",
    utmCampaign: "gift_podcast_studio",
  },
  {
    id: "slideshow",
    badge: "מצגת + מוזיקה",
    title: "מצגת תמונות עם שיר מקורי",
    description:
      "משלבים אלבום משפחתי עם שיר שנכתב והוקלט באולפן. מתנה ליום נישואין, יובל או אירוע משפחתי - מרגש במיוחד על המסך הגדול.",
    highlights: [
      "סינכרון תמונות למוזיקה",
      "שיר אישי או קיים מעובד",
      "קובץ מוכן להקרנה",
    ],
    href: "/photo-slideshow",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["video-photo-slideshow"],
    videoTitle: "מצגת ושיר - דוגמה",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - מצגת תמונות עם שיר באולפן.",
    utmCampaign: "gift_slideshow",
  },
  {
    id: "kids-studio",
    badge: "משפחות",
    title: "הקלטה עם ילדים באולפן",
    description:
      "מתנה לילדים ולהורים: חוויה באולפן, שיר או הקלטה מודרכת, אווירה משחקית וסבלנות. מתאים ליום הולדת, סיום שנה או הפתעה משפחתית.",
    highlights: [
      "ליווי לילדים שלא זמרים",
      "אפשר שיר מוכן או מילים משפחתיות",
      "זיכרון שמחוברים אליו שנים",
    ],
    href: "/studio/recording-song-modiin",
    videoId: "WMvdVNw3tIU",
    videoTitle: "הקלטת שיר יומולדת עם ילדים",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - הקלטה עם ילדים באולפן.",
    utmCampaign: "gift_kids_studio",
  },
  {
    id: "event-attraction",
    badge: "אירועים",
    title: "שובר לאטרקציה באירוע",
    description:
      "מתנה לחתונה, בר/בת מצווה או יום הולדת: עשן, קונפטי, בועות, עמדת LED, DJ ועוד. השובר מציין שזו מתנה - המחיר לפי האטרקציה שנבחרת.",
    highlights: [
      "בחירה ממגוון אטרקציות באתר",
      "חבילות מרובות לחיסכון",
      "תיאום אישי לפני האירוע",
    ],
    href: "/events/attractions",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["events-hub"],
    videoTitle: "אטרקציות לאירועים - דוגמאות",
    whatsappText:
      "היי יקיר! מעוניינים בשובר מתנה - אטרקציה לאירוע (חתונה/יום הולדת).",
    utmCampaign: "gift_event_attraction",
  },
] as const;

export const STUDIO_GIFT_FAQ: readonly {
  id: string;
  question: string;
  answer: string;
  whatsappText: string;
  utmCampaign: string;
}[] = [
  {
    id: "voucher-any-service",
    question: "האם השובר מוגבל לסכום או לשירות מסוים?",
    answer:
      `שובר המתנה יכול לייצג כל שירות באתר - לפי המחירון (חצי שעה ${formatMeNis(STUDIO_HALF_HOUR_NIS)}, שעת אולפן ${formatNis(STUDIO_ONE_HOUR_NIS)}). מציינים בשובר שמדובר במתנה.`,
    whatsappText:
      "היי יקיר! רוצים שובר מתנה - לא בטוחים איזה שירות. אשמח להמלצה.",
    utmCampaign: "gift_faq_voucher",
  },
  {
    id: "cant-sing",
    question: "אני ממש לא יודע לשיר, זה יכול לצאת מקצועי?",
    answer:
      "זה החשש הכי נפוץ. רוב הלקוחות אינם זמרים. עם ליווי באולפן, הנחיה קולית ועריכה מתקדמת - כולם נשמעים במיטבם.",
    whatsappText:
      "היי יקיר! שובר מתנה להקלטת שיר - חוששים מהשירה. איך זה עובד?",
    utmCampaign: "gift_faq_sing",
  },
  {
    id: "personal",
    question: "איך הופכים שיר או קליפ למתנה אישית באמת?",
    answer:
      'אחרי ההזמנה תקבלו שאלון "סיפור אישי". הכותבים יהפכו דיחות, רגעים וזיכרונות לשיר או לקליפ שנבנה סביב מקבל המתנה.',
    whatsappText: "היי יקיר! שובר מתנה עם שיר אישי - מה השלבים?",
    utmCampaign: "gift_faq_personal",
  },
  {
    id: "timing",
    question: "כמה זמן מראש צריך לתאם?",
    answer:
      "לרוב 2-3 שבועות לפני האירוע או המימוש. אירוע קרוב? דברו איתנו - נבדוק אפשרות אקספרס.",
    whatsappText: "היי יקיר! שובר מתנה - האירוע בעוד שבועיים. אפשרי?",
    utmCampaign: "gift_faq_timing",
  },
  {
    id: "delivery",
    question: "איך מקבלים את המתנה והאם מתאים להקרנה?",
    answer:
      "לינק להורדה ב-Full HD להקרנה, וגרסה קלה לוואטסאפ ורשתות - לפי סוג השירות.",
    whatsappText: "היי יקיר! שאלה על מסירת שובר מתנה / קליפ.",
    utmCampaign: "gift_faq_delivery",
  },
] as const;

export const STUDIO_GIFT_EXTRA_VIDEOS: readonly RecordingSongExampleVideo[] =
  BAT_MITZVAH_CLIP_VIDEOS;
