import { MAGIC_KASS_CLIP_CREDITS } from "@/lib/data/youtube-showcases";
import {
  cta,
  getPortfolioPlaylistCta,
  type PortfolioPlaylistCtaConfig,
} from "@/lib/data/portfolio-playlist-cta";

/**
 * עמודי עבודה בתיק העבודות (/portfolio/[slug]), שלב ד (אישור הבעלים 12.10.2026).
 * חמש העבודות הראשונות הן אלה שכבר היה להן תיאור אמיתי באתר, ולכן כל משפט כאן
 * מגיע ממקור קיים (מצוין ליד כל עבודה). עבודה חדשה נכנסת כרשומה נוספת, רק עם
 * תוכן מהבעלים: מה הלקוח ביקש, מה עשינו, כמה זמן, והאם מותר לציין שם.
 */
export type PortfolioWork = {
  slug: string;
  videoId: string;
  /** H1 ושם העבודה בכרטיסים */
  title: string;
  /** תיאור למטא ול-VideoObject */
  summary: string;
  /** פסקאות "מה עשינו" */
  story: readonly string[];
  credits?: readonly { role: string; name: string }[];
  cta: PortfolioPlaylistCtaConfig | null;
  serviceLink?: { href: string; label: string };
};

function splitCredits(line: string): { role: string; name: string }[] {
  return line.split(" · ").map((part) => {
    const [role, ...rest] = part.split(": ");
    return rest.length ? { role: role!.trim(), name: rest.join(": ").trim() } : { role: "", name: part.trim() };
  });
}

export const PORTFOLIO_WORKS: readonly PortfolioWork[] = [
  {
    /* קרדיטים: youtube-showcases.ts (MAGIC_KASS_CLIP_CREDITS). מיקס ומאסטרינג: המשרד 11.10.2026 */
    slug: "magic-kass-official-clip",
    videoId: "1DUnuS_hv5Y",
    title: "מג'יק קאס - הקליפ הרשמי",
    summary:
      "הקליפ הרשמי של מג'יק קאס, עם מעל מיליון צפיות ביוטיוב. הפקה ועיבוד מוזיקלי יחד עם רועי מאנה, ומיקס ומאסטרינג ביקיר כהן הפקות.",
    story: [
      "הקליפ הרשמי של מג'יק קאס, עם מעל מיליון צפיות ביוטיוב.",
      "ההפקה והעיבוד המוזיקלי נעשו אצלנו יחד עם רועי מאנה, וגם המיקס והמאסטרינג של השיר שלנו.",
    ],
    credits: splitCredits(MAGIC_KASS_CLIP_CREDITS),
    cta: getPortfolioPlaylistCta("studio-hub"),
  },
  {
    /* הבעלים 11.10.2026: "קריינות לטלוויזיה ערוץ 14, קריינות פרסומת לבנא משקאות" */
    slug: "bana-tv-ad-channel-14",
    videoId: "kMBtj7hLTHA",
    title: "קריינות לפרסומת טלוויזיה: בנא משקאות, ערוץ 14",
    summary: "פרסומת חג לבנא משקאות ששודרה בערוץ 14. קריינות: יקיר כהן.",
    story: [
      "פרסומת חג לבנא משקאות ששודרה בערוץ 14.",
      "בקריינות מקבלים 3 גרסאות של כל משפט, ועד 2 סבבי תיקונים אחרי בחירת גרסה.",
    ],
    credits: [{ role: "קריינות", name: "יקיר כהן" }],
    cta: getPortfolioPlaylistCta("voiceover-hub"),
  },
  {
    /* video-catalog.supplement.ts, OLgVysdB6fA */
    slug: "vocal-before-after-basic-edit",
    videoId: "OLgVysdB6fA",
    title: "ככה באמת נשמעת שירה באולפן: לפני ואחרי עריכה בסיסית",
    summary:
      "לפני ואחרי עריכה בסיסית, כמו בהקלטת שיר רגילה. מתאים למי שיודע לשיר ולא צריך תיקון זיופים.",
    story: [
      "ככה נשמעת שירה באולפן לפני העריכה ואחריה.",
      "זו עריכה בסיסית, כמו בהקלטת שיר רגילה. היא מתאימה למי שיודע לשיר ולא צריך תיקון זיופים.",
    ],
    cta: getPortfolioPlaylistCta("recording-song-modiin"),
  },
  {
    /* video-catalog.supplement.ts ו-pricing-catalog.ts (old_song_renewal) */
    slug: "renew-old-song",
    videoId: "8NO8nNnzXwI",
    title: "חידוש שיר ישן בלי להקליט מחדש",
    summary:
      "שיר ישן שחודש מרחוק: מבודדים ומנקים את השירה מההקלטה הקיימת, ובונים סביבה עיבוד מוזיקלי חדש. בלי להקליט מחדש.",
    story: [
      "שיר ישן שחודש מרחוק, בלי להקליט מחדש.",
      "מבודדים ומנקים את השירה מההקלטה הקיימת, ובונים סביב הקול המקורי עיבוד מוזיקלי חדש. תיקון זיופים לא כלול.",
    ],
    cta: cta({
      prompt: "יש לכם שיר ישן שרוצים לחדש?",
      serviceHref: "/studio/renew-old-song",
      serviceLabel: "לעמוד חידוש שיר ישן",
      bookCategory: "studio",
      catalog: "old_song_renewal",
      bookLabel: "שליחת השיר לבדיקה",
      priceFrom: false,
      utmCampaign: "portfolio_work_renew_old_song",
    }),
  },
  {
    /* video-catalog.supplement.ts, 8lfWwn0uJMg */
    slug: "green-screen-kids-clip-edit",
    videoId: "8lfWwn0uJMg",
    title: "עריכת קליפ ילדים ממסך ירוק: לפני ואחרי",
    summary: "כמה עולה לערוך קליפ ילדים ממסך ירוק, והתוצאה לפני ואחרי.",
    story: [
      "קליפ ילדים שצולם על מסך ירוק, לפני העריכה ואחריה.",
      "בסרטון מוסבר גם כמה עולה עריכה כזו.",
    ],
    cta: null,
    serviceLink: { href: "/business/content-studio", label: "לחבילות רילז לעסקים" },
  },
];

const BY_SLUG = new Map(PORTFOLIO_WORKS.map((w) => [w.slug, w] as const));
const BY_VIDEO = new Map(PORTFOLIO_WORKS.map((w) => [w.videoId, w] as const));

export function getPortfolioWork(slug: string): PortfolioWork | undefined {
  return BY_SLUG.get(slug);
}

export function getPortfolioWorkByVideoId(videoId: string): PortfolioWork | undefined {
  return BY_VIDEO.get(videoId);
}

export function getPortfolioWorkHref(work: PortfolioWork): string {
  return `/portfolio/${work.slug}`;
}
