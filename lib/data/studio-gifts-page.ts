import {
  BAT_MITZVAH_CLIP_TYPES,
  BAT_MITZVAH_CLIP_VIDEOS,
  BAT_MITZVAH_FEATURED_VIDEO_ID,
  BAT_MITZVAH_PRODUCTION_STYLES,
} from "@/lib/data/bat-mitzvah-gifts-page";
import {
  PROPOSAL_CLIP_FEATURED_VIDEO_ID,
  PROPOSAL_CLIP_VIDEOS,
} from "@/lib/data/proposal-clip-gifts-page";
import { RINGTONE_PAGE_PATH } from "@/lib/data/funny-ringtone-page";
import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";
import { withVat } from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";
import { buildSongOfferHref, calcSongOffer } from "@/lib/data/song-offer";
import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";
import { GIFT_VALIDITY_YEARS } from "@/lib/sales/voucher";

export {
  BAT_MITZVAH_CLIP_TYPES,
  BAT_MITZVAH_CLIP_VIDEOS,
  BAT_MITZVAH_FEATURED_VIDEO_ID,
  BAT_MITZVAH_PRODUCTION_STYLES,
  PROPOSAL_CLIP_FEATURED_VIDEO_ID,
  PROPOSAL_CLIP_VIDEOS,
};

/* מחירים לצרכן כולל מע״מ. העמוד מציג את טופס השיר במצב מתנה (2.10.2026) */
const GIFTS_PATH = "/studio/recording-song-modiin/gifts";
const nis = (amount: number) => `${amount.toLocaleString("he-IL")} ₪`;
const SONG_BASE = calcSongOffer([]);
const SONG_WITH_CLIP = calcSongOffer(["studio_session_clip_edited"]);
const PITCH_WITH_VAT = withVat(getExVat("song_pitch_coaching"));
const BLESSING_WITH_VAT = withVat(getExVat("blessing_recording"));

/* תוקף שובר המתנה בעמוד. תשובות הבעלים 8.10.2026, תשובה 4: שנתיים בכל מקום
   (חוק הגנת הצרכן מחייב לפחות שנתיים). העמוד כתב "שנה" בשני מקומות, בזמן
   שהשובר שיוצא מ-/admin/sales מדפיס שנתיים. לכן הניסוח נגזר מאותו קבוע
   שהשובר מדפיס, GIFT_VALIDITY_YEARS ב-lib/sales/voucher.ts, ולא נכתב ביד.
   אותה מפת מילים כמו בבדיקה ב-lib/sales/voucher.test.ts. */
const VALIDITY_WORDS: Readonly<Record<number, string>> = {
  2: "שנתיים",
  3: "שלוש שנים",
  5: "חמש שנים",
};
export const STUDIO_GIFT_VALIDITY_TEXT =
  VALIDITY_WORDS[GIFT_VALIDITY_YEARS] ?? `${GIFT_VALIDITY_YEARS} שנים`;

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
  /** שורת מחיר כולל מע״מ, מקשרת לטופס השיר בעמוד */
  priceLine?: string;
  priceHref?: string;
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
    /* תשובות הבעלים 8.10.2026: מתנה שמשאירה גם חוויה וגם מוצר ביד (היה: "לא עם עוד חפץ") */
    body: "הנמען בוחר תאריך, מגיע לאולפן במודיעין (או שירות בשטח לפי סוג), חווה את החוויה ויוצא עם השיר או ההקלטה ביד.",
  },
] as const;

export const STUDIO_GIFT_IDEAS: readonly StudioGiftIdea[] = [
  {
    id: "grandpa-podcast",
    badge: "מתנה משפחתית",
    title: "פודקאסט עם סבא וסבתא",
    description:
      "מתנה שיוצאת דופן ליובל, יום הולדת או סתם כי אוהבים את המשפחה: שיחה מוקלטת, שיר באולפן וקובץ דיגיטלי שנשמר. מתאים למי שמחפש מתנה בעלת ערך אישי, לא עוד מוצר.",
    highlights: [
      "חוויה משותפת לכל המשפחה",
      "אפשרות לשלב הקלטת שיר או קטעים מהשיחה",
      "מסירה דיגיטלית לשיתוף בוואטסאפ",
    ],
    href: "/podcast/podcast-with-grandpa",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["podcast-with-grandpa"],
    videoTitle: "פודקאסט עם סבא - דוגמה",
    whatsappText:
      "היי יקיר, מעוניינים בשובר מתנה - פודקאסט עם סבא/סבתא. אשמח לפרטים.",
    utmCampaign: "gift_grandpa_podcast",
  },
  {
    id: "proposal-clip",
    badge: "הצעת נישואין",
    title: "קליפ מתננה - שיר בהפתעה לבת/בן הזוג",
    description:
      "שיר מקורי עם הקדשה אישית - לאישה, לחברה או לבן/בת הזוג. הקלטה, עריכה ומיקס באולפן, מוכן להקרנה ברגע המתננה.",
    highlights: [
      "מילים אישיות וליווי בניסוח",
      "גם למי שלא זמר/ית",
      "קובץ מוכן לוואטסאפ ולהקרנה",
    ],
    href: "/studio/recording-song-modiin",
    videoId: PROPOSAL_CLIP_FEATURED_VIDEO_ID,
    videoTitle: PROPOSAL_CLIP_VIDEOS[0]?.title ?? "קליפ מתננה מהאולפן",
    whatsappText:
      "היי יקיר, מעוניין/ת בקליפ מתננה / שיר בהפתעה לבת או בן הזוג.",
    utmCampaign: "gift_proposal_clip",
  },
  {
    id: "bat-mitzvah",
    badge: "בר/בת מצווה",
    title: "הקלטת שיר וקליפ לבת/בר מצווה",
    description:
      "שיר אישי, קליפ בהפתעה עם המשפחה או סולו במרכז - הפקה מלאה באולפן. מקצועי ומותאם לכלת או חתן השמחה.",
    highlights: [
      "שאלון סיפור אישי וכתיבת מילים",
      "ליווי גם למי שלא זמר/ית",
      "קובץ להקרנה באולם + גרסה לרשתות",
    ],
    href: "/studio/blessings/bat-mitzvah-clip",
    videoId: BAT_MITZVAH_FEATURED_VIDEO_ID,
    videoTitle: "קליפ בת מצווה - תמונות ילדות וקליפ מהאולפן",
    whatsappText:
      "היי יקיר, מעוניינים בשובר מתנה - הקלטת שיר/קליפ לבת או בר מצווה.",
    utmCampaign: "gift_bat_mitzvah",
  },
  {
    id: "birthday-song",
    badge: "יום הולדת",
    title: "שיר מתנה ליום הולדת",
    description:
      "סשן באולפן: הקלטה, מיקס ומאסטר, והשיר אצלכם בסוף הסשן. מתנה מקורית לגיל 30, 40, 50 או לילד/ה.",
    highlights: [
      "מתאים לכל גיל",
      "אפשר שיר מוכן או מילים אישיות",
      "חוויה ייחודית גם בלי אירוע גדול",
    ],
    href: "/studio/recording-song-modiin",
    videoId: "c55HTqTArFo",
    videoTitle: "מתנה ליום הולדת באולפן",
    whatsappText:
      "היי יקיר, מעוניינים בשובר מתנה - שיר ליום הולדת באולפן.",
    utmCampaign: "gift_birthday_song",
    priceLine: `${nis(SONG_BASE.totalWithVat)} כולל מע״מ: הקלטה, מיקס ומאסטר`,
    priceHref: buildSongOfferHref([], GIFTS_PATH),
  },
  {
    id: "blessing-couple",
    badge: "חתונה",
    title: "ברכת חתן וכלה באולפן",
    description:
      "מתנה לפני החתונה: הקלטה שקטה, מיקס מקצועי ומוזיקת רקע. קובץ מוכן להקרנה לפני הטקס.",
    highlights: [
      "ליווי בניסוח הברכה",
      "אווירה אינטימית באולפן",
      "קובץ מוכן להקרנה בחופה או במסיבה",
    ],
    href: "/studio/blessings/bride-groom-blessing",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["blessings-hub"],
    videoTitle: "הקלטת ברכות באולפן",
    whatsappText:
      "היי יקיר, מעוניינים בשובר מתנה - ברכת חתן/כלה באולפן.",
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
      "סגנון מוזיקלי MTv או אינטימי",
      "מסירה ב-Full HD",
    ],
    href: "/studio/blessings/video-clip",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["blessings-video-clip"],
    videoTitle: "שיר וקליפ - דוגמה",
    whatsappText:
      "היי יקיר, מעוניינים בשובר מתנה - שיר וקליפ באולפן.",
    utmCampaign: "gift_song_clip",
    priceLine: `${nis(SONG_WITH_CLIP.totalWithVat)} כולל מע״מ: הקלטת שיר וקליפ ערוך מהסשן`,
    priceHref: buildSongOfferHref(["studio_session_clip_edited"], GIFTS_PATH),
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
      "היי יקיר, מעוניינים בשובר מתנה - הקלטת פודקאסט באולפן.",
    utmCampaign: "gift_podcast_studio",
  },
  {
    id: "slideshow",
    badge: "מצגת + מוזיקה",
    title: "מצגת תמונות עם שיר מקורי",
    description:
      "משלבים אלבום משפחתי עם שיר שנכתב והוקלט באולפן. מתנה ליום נישואין, יובל או אירוע משפחתי - מוכן להקרנה על המסך הגדול.",
    highlights: [
      "סינכרון תמונות למוזיקה",
      "שיר אישי או קיים מעובד",
      "קובץ מוכן להקרנה",
    ],
    href: "/photo-slideshow",
    videoId: YOUTUBE_SERVICE_EMBED_IDS["video-photo-slideshow"],
    videoTitle: "מצגת ושיר - דוגמה",
    whatsappText:
      "היי יקיר, מעוניינים בשובר מתנה - מצגת תמונות עם שיר באולפן.",
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
      "היי יקיר, מעוניינים בשובר מתנה - הקלטה עם ילדים באולפן.",
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
      "היי יקיר, מעוניינים בשובר מתנה - אטרקציה לאירוע (חתונה/יום הולדת).",
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
    /* תשובות הבעלים 8.10.2026, תשובה 3, במילים שלו. ראשונה ברשימה כי העמוד
       פותח עכשיו בשיר במתנה. FaqPageSchema בעמוד נבנה מהרשימה הזו, ולכן
       ה-JSON-LD מתעדכן יחד עם מה שרואים. */
    id: "choose-song",
    question: "איך בוחרים שיר, ומה עושים כשאין מילים?",
    answer:
      "בוחרים שיר לפי מה שחושבים שיעשה טוב למי שמקבל את המתנה. כשאין מילים, תמיד אפשר להדפיס אותן. באולפן אפשר לעשות הכל.",
    whatsappText: "היי יקיר, שיר במתנה: מתלבטים איזה שיר לבחור. אשמח לעזרה.",
    utmCampaign: "gift_faq_choose_song",
  },
  {
    id: "voucher-any-service",
    question: "האם השובר מוגבל לסכום או לשירות מסוים?",
    answer:
      `שובר המתנה יכול לייצג כל שירות באתר, לפי המחירון. למשל הקלטת שיר ${nis(SONG_BASE.totalWithVat)} כולל מע״מ, או הקלטת ברכה ${nis(BLESSING_WITH_VAT)} כולל מע״מ. מציינים בשובר שמדובר במתנה.`,
    whatsappText:
      "היי יקיר, רוצים שובר מתנה - לא בטוחים איזה שירות. אשמח להמלצה.",
    utmCampaign: "gift_faq_voucher",
  },
  {
    id: "cant-sing",
    question: "אני ממש לא יודע לשיר, זה יכול לצאת מקצועי?",
    answer:
      `זה החשש הכי נפוץ, ורוב הלקוחות אינם זמרים. מי שרוצה ביטחון נוסף מוסיף לשיר את תוספת תיקון הזיופים (${nis(PITCH_WITH_VAT)} כולל מע״מ): טכנאי שמכוון ומנחה בזמן ההקלטה, ותיקון זיופים בעריכה.`,
    whatsappText:
      "היי יקיר, שובר מתנה להקלטת שיר - חוששים מהשירה. איך זה עובד?",
    utmCampaign: "gift_faq_sing",
  },
  {
    id: "personal",
    question: "איך הופכים שיר או קליפ למתנה אישית באמת?",
    answer:
      'אחרי ההזמנה תקבלו שאלון "סיפור אישי". הכותבים יהפכו בדיחות, רגעים וזיכרונות לשיר או לקליפ שנבנה סביב מקבל המתנה.',
    whatsappText: "היי יקיר, שובר מתנה עם שיר אישי - מה השלבים?",
    utmCampaign: "gift_faq_personal",
  },
  {
    id: "timing",
    question: "כמה זמן מראש צריך לתאם?",
    answer:
      "לרוב 2-3 שבועות לפני האירוע או המימוש. אירוע קרוב? דברו איתנו ונבדוק מועד פנוי. בהקלטת שיר הסשן הוא שעה, והשיר אצלכם בסוף הסשן.",
    whatsappText: "היי יקיר, שובר מתנה - האירוע בעוד שבועיים. אפשרי?",
    utmCampaign: "gift_faq_timing",
  },
  {
    id: "delivery",
    question: "איך מקבלים את המתנה והאם מתאים להקרנה?",
    answer:
      "השובר עצמו נשלח אליכם מיד, בוואטסאפ או במייל. אחרי המימוש: לינק להורדה ב-Full HD להקרנה, וגרסה קלה לוואטסאפ ורשתות - לפי סוג השירות.",
    whatsappText: "היי יקיר, שאלה על מסירת שובר מתנה / קליפ.",
    utmCampaign: "gift_faq_delivery",
  },
] as const;

export const STUDIO_GIFT_EXTRA_VIDEOS: readonly RecordingSongExampleVideo[] =
  BAT_MITZVAH_CLIP_VIDEOS;
