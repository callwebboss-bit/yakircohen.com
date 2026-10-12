import type { ShowcaseVideoItem } from "@/lib/data/video-catalog";
import {
  getPlaylistVideos,
  getVideoFromCatalog,
  toShowcaseItem,
} from "@/lib/data/video-portfolio";
import type { PlaylistId } from "@/lib/data/video-playlists";

/**
 * המבנה של /portfolio לפי הלקוח (שלב ב, אישור הבעלים 12.10.2026).
 * ארבע קבוצות, ובכל אחת תתי-קטגוריות. בכל תת-קטגוריה 3 סרטונים נבחרים
 * מוצגים ככרטיסים, וכל השאר נמצאים ב-HTML ברשימה מקופלת.
 *
 * בלוק "הקלטת שיר" הישן החזיק 134 סרטונים, וחצי מהם לא היו הקלטת שיר
 * (פארודיות, סטים של DJ, ראיונות, טיפים). הרשימות למטה הן המיון הידני שהבעלים אישר.
 * הפלייליסטים של עמודי השירות לא השתנו.
 */

export type PortfolioSectionSource =
  | { kind: "ids"; ids: readonly string[] }
  | { kind: "playlist"; playlistId: PlaylistId };

export type PortfolioSection = {
  id: string;
  /** שם קצר לניווט */
  label: string;
  heading: string;
  subheading: string;
  source: PortfolioSectionSource;
  /** איזה CTA מ-PORTFOLIO_PLAYLIST_CTA מתאים */
  ctaPlaylist?: PlaylistId;
  serviceLink?: { href: string; label: string };
  /** השוואת הקריינים מעל הסרטונים */
  voiceoverCompare?: boolean;
};

export type PortfolioGroup = {
  id: string;
  label: string;
  heading: string;
  intro: string;
  sections: readonly PortfolioSection[];
};

/**
 * כמה כרטיסים מוצגים בכל תת-קטגוריה, שורה אחת. השאר ברשימה המקופלת.
 * עם 6 כרטיסים הדף הגיע ל-51 אלף פיקסלים (נמדד 12.10.2026), ארוך פי 2.7 מקודם.
 */
export const PORTFOLIO_FEATURED_PER_SECTION = 3;

export const PORTFOLIO_TIP_BADGE = "טיפ";

export const PORTFOLIO_GROUPS: readonly PortfolioGroup[] = [
  {
    id: "events-gifts",
    label: "אירוע ומתנה",
    heading: "לאירוע ולמתנה",
    /* שלב ג (הבעלים 12.10.2026). "שעה" רק לשיר על פלייבק, services.ts:219 */
    intro: "שיר מתנה על פלייבק מקליטים בסשן של שעה, ויוצאים עם השיר ביד. רוב מי שרואים כאן לא שרו אף פעם באולפן.",
    sections: [
      {
        id: "gift-song",
        label: "שיר מתנה",
        heading: "שיר מתנה",
        subheading: "שירים שהוקלטו באולפן כמתנה: לחברה, ליום נישואין, לאמא ולבר מצווה.",
        source: {
          kind: "ids",
          ids: ["LKg3pwdon_M", "VntWmw5Su6c", "7y7IQPL8k9M", "SgoAVkFSyDs", "8NO8nNnzXwI"],
        },
        ctaPlaylist: "recording-song-modiin",
      },
      {
        id: "wedding",
        label: "חתונה",
        heading: "שיר לחתונה",
        subheading: "שיר לחופה, שיר כניסה, ברכת כלה וקליפ מהחברים.",
        source: {
          kind: "ids",
          ids: ["8i4K2f5gQfM", "2apMsrmEsDs", "1ilgnokOS7Q", "kLA-XVH3m4E", "qY67kRGsRnY", "sNZPrz-rasQ"],
        },
        ctaPlaylist: "recording-song-modiin",
      },
      {
        id: "bar-bat-mitzvah",
        label: "בר ובת מצווה",
        heading: "שיר ודרשה לבר ובת מצווה",
        subheading: "שירים, קליפים ודרשות שהוקלטו באולפן, כולל תיקון זיופים.",
        source: {
          kind: "ids",
          ids: [
            "Fsy4Eg00dCA",
            "RtAiHRFzx9U",
            "hC2GgTt_cmo",
            "BGORA8bST3A",
            "PBmwYVdgWLw",
            "OMEyJKQuOtk",
            "y8w_BRwe_tg",
            "6RnF9SB9n6w",
            "63R17iIWrTM",
            "KYAah8VSNg8",
            "TGKBqHswS_I",
            "T-otXbppZMA",
            "X1IO30Jsfqg",
            "Z5w1v5naEaY",
            "grgkgxRuvX0",
            "hg4u1GhrZ3Y",
            "hzOHnLHN9lM",
            "wVLVfYFAVys",
          ],
        },
        ctaPlaylist: "recording-song-modiin",
      },
      {
        id: "kids-family",
        label: "ילדים ומשפחה",
        heading: "ילדים, משפחה ובית ספר",
        subheading: "הקלטות של ילדים באולפן, שיר משפחתי והקלטה לבית ספר.",
        source: {
          kind: "ids",
          ids: ["02F0dsG2-V0", "Djl7sxQjbXk", "lCIoEuxBm7A", "iPLLWvcvpR4", "Jb4RYS0rGVA"],
        },
        ctaPlaylist: "recording-song-modiin",
      },
      {
        id: "blessings",
        label: "ברכות",
        heading: "ברכות מוקלטות",
        subheading: "ברכות לחתן ולכלה, לבר ובת מצווה ולאירועים, מוקלטות באולפן.",
        source: { kind: "playlist", playlistId: "blessings-hub" },
        ctaPlaylist: "blessings-hub",
      },
      {
        id: "dj",
        label: "תקליטן",
        heading: "DJ לאירועים",
        subheading: "תקליטן לחתונה, לבר ובת מצווה ולאירועים, מהשטח.",
        source: { kind: "playlist", playlistId: "events-dj" },
        ctaPlaylist: "events-dj",
      },
    ],
  },
  {
    id: "musicians",
    label: "מוזיקאים",
    heading: "למוזיקאים ויוצרים",
    intro: "תשמעו איך השירה נשמעת לפני העריכה ואחריה. אפשר להקליט אצלנו, ואפשר לשלוח ערוצים למיקס ומאסטרינג מרחוק.",
    sections: [
      {
        id: "studio",
        label: "האולפן",
        heading: "עבודות מהאולפן",
        subheading: "תיק העבודות המרכזי: אמנים, שיתופי פעולה וסיור באולפן.",
        source: { kind: "playlist", playlistId: "studio-hub" },
        ctaPlaylist: "studio-hub",
      },
      {
        id: "mix-mastering",
        label: "מיקס",
        heading: "מיקס ומאסטרינג",
        subheading: "שירים שעשינו להם מיקס ומאסטרינג, ושני טיפים מהעבודה.",
        source: { kind: "playlist", playlistId: "mix-mastering" },
        serviceLink: { href: "/online/vocal-fix/mixing", label: "למיקס ומאסטרינג מרחוק" },
      },
      {
        id: "clip-cover",
        label: "קליפ וקאבר",
        heading: "קליפ, קאבר ושיר מקורי",
        subheading: "קליפים מסשן הקלטה, קאברים, חידושים ושירים מקוריים.",
        source: {
          kind: "ids",
          ids: ["QRMxKVUOOl0", "ocV3Dzs7dL4", "HXrv5XwSuTo", "K8c9xAHWN-g", "P425XNK7z5M", "t3GQFHrd7wk", "Z9LMW3nQJfw"],
        },
        ctaPlaylist: "recording-song-modiin",
      },
      {
        id: "before-after",
        label: "לפני ואחרי",
        heading: "לפני ואחרי: עריכה ותיקון זיופים",
        subheading: "איך נשמעת השירה לפני העריכה ואחריה, ומה תיקון זיופים עושה.",
        source: {
          kind: "ids",
          ids: [
            "OLgVysdB6fA",
            "OixEalmqjQk",
            "7u6dviEF0ag",
            "rBwtACnVHcU",
            "M-lKFCzrz5Y",
            "uY871OUAjMM",
            "4uFnJgKF5ps",
            "RScxQ_D9OQ0",
            "no2r9mKhno0",
            "vr8TVTmPsrI",
          ],
        },
        ctaPlaylist: "recording-song-modiin",
      },
    ],
  },
  {
    id: "business-podcast",
    label: "עסקים ופודקאסט",
    heading: "לעסקים ולפודקאסט",
    /* "3 גרסאות" לפי VOICEOVER_YAKIR_NOTE ב-voiceover-narrator-compare.ts */
    intro: "פרסומת ששודרה בערוץ 14, קריינות ליקב, פרקי פודקאסט מהאולפן ועריכה לרשתות. בקריינות מקבלים 3 גרסאות של כל משפט.",
    sections: [
      {
        id: "podcast",
        label: "פודקאסט",
        heading: "פודקאסט מהאולפן",
        subheading: "פרקים שהוקלטו וצולמו באולפן, ולפני ואחרי עריכה.",
        source: { kind: "playlist", playlistId: "podcast-hub" },
        ctaPlaylist: "podcast-hub",
      },
      {
        id: "voiceover",
        label: "קריינות",
        heading: "קריינות",
        subheading: "קריינות לפרסומות, לטלוויזיה, ליקבים ולסטים של DJ.",
        source: { kind: "playlist", playlistId: "voiceover-hub" },
        ctaPlaylist: "voiceover-hub",
        voiceoverCompare: true,
      },
      {
        id: "video-editing",
        label: "עריכה",
        heading: "עריכת וידאו ורשתות חברתיות",
        subheading: "מסך ירוק ושורטס לעסקים: דוגמאות לעבודות עריכה.",
        source: { kind: "playlist", playlistId: "video-editing" },
        serviceLink: { href: "/business/content-studio", label: "לחבילות רילז לעסקים" },
      },
    ],
  },
  {
    id: "behind-the-scenes",
    label: "מאחורי הקלעים",
    heading: "מאחורי הקלעים",
    intro: "מה קורה באולפן כשלא מקליטים ללקוח: פארודיות שהפקנו בשביל הכיף, וראיונות על מוזיקה ועל ההפקה.",
    sections: [
      {
        id: "entertainment",
        label: "בידור",
        heading: "פארודיות ובידור",
        subheading: "פארודיות וקטעים מצחיקים שהפקנו באולפן.",
        source: { kind: "playlist", playlistId: "studio-hub-entertainment" },
        ctaPlaylist: "studio-hub-entertainment",
      },
      {
        id: "talks",
        label: "ראיונות",
        heading: "ראיונות ושיחות",
        subheading: "ראיונות ושיחות על מוזיקה, להיטים וההפקה עצמה.",
        source: {
          kind: "ids",
          ids: [
            "bVUQCpthGhs",
            "uscGOdmltFA",
            "Sy9IMvgKKwM",
            "RHfbCirXwn4",
            "TCZUjBm6WRc",
            "xzghVo3FTyk",
            "6CWP425rgV0",
            "AXIzb0XrITs",
            "OgPvZ8qCark",
            "mnDVjrt7xPA",
          ],
        },
      },
    ],
  },
];

/** טיפים (תגית education) מקבלים תווית, כדי שיהיה ברור שהם ידע ולא עבודה ללקוח. */
function withTipBadge(item: ShowcaseVideoItem): ShowcaseVideoItem {
  const video = getVideoFromCatalog(item.videoId);
  return video?.tags.includes("education") ? { ...item, badge: PORTFOLIO_TIP_BADGE } : item;
}

export function getPortfolioSectionVideos(section: PortfolioSection): ShowcaseVideoItem[] {
  const items =
    section.source.kind === "playlist"
      ? getPlaylistVideos(section.source.playlistId)
      : section.source.ids
          .map((id) => getVideoFromCatalog(id))
          .filter((v): v is NonNullable<typeof v> => Boolean(v))
          .map(toShowcaseItem);
  return items.map(withTipBadge);
}

export function getPortfolioSectionElementId(section: PortfolioSection): string {
  return `portfolio-${section.id}`;
}

export function getPortfolioGroupElementId(group: PortfolioGroup): string {
  return `portfolio-group-${group.id}`;
}

/** שאלות נפוצות של תיק העבודות. התשובות שבחר הבעלים ב-12.10.2026, ולכל אחת מקור באתר. */
export const PORTFOLIO_FAQS = [
  {
    id: "portfolio-real-work",
    question: "האם הסרטונים בתיק הם עבודות אמיתיות?",
    answer:
      "כן. כל הסרטונים כאן הם עבודות שעשינו באולפן. חלקם בערוץ שלנו, וחלקם בערוצים של האמנים והלקוחות, כמו מג'יק קאס ובנא משקאות.",
  },
  {
    id: "portfolio-demo",
    question: "אפשר לשמוע דוגמה לפני שמזמינים?",
    /* blog.ts:3917, דמו של 30 שניות */
    answer:
      "כן. בתיקון זיופים ובמיקס מרחוק שולחים לנו 30 שניות, ואנחנו מחזירים לפני ואחרי, לפני שמשלמים על כלום. באולפן, הסרטונים כאן הם הדוגמה.",
  },
  {
    id: "portfolio-delivery",
    question: "כמה זמן לוקח עד שהשיר אצלי?",
    /* services.ts:219 */
    answer:
      "שיר על פלייבק: סשן של שעה, והשיר אצלכם בסוף הסשן. ברכה או דרשה: בלי הגבלת זמן. שיר מקורי עם עיבוד חדש: כמה מפגשים, לפי ההפקה.",
  },
  {
    id: "portfolio-singing",
    question: "צריך לדעת לשיר?",
    /* services.ts:432 והחלטה D82 */
    answer:
      "לא. רוב הלקוחות מגיעים בלי ניסיון שירה. הטכנאי מסביר תוך כדי הקלטה איך עובדים מול המיקרופון, ומי שרוצה ביטחון נוסף מוסיף תיקון זיופים.",
  },
] as const;
