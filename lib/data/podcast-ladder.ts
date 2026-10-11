import {
  PODCAST_EXTRA_EDIT_TIME,
  PODCAST_FULL_PRODUCTION_REELS_NOTE,
  PODCAST_VIDEO_CAMERAS_SHORT,
  getExVat,
  getPriceById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { PODCAST_PRODUCTION_QUALITY, PODCAST_RECORDING_PACKAGES } from "@/lib/data/podcast-recording-page";
import { REVISION_POLICIES } from "@/lib/data/revision-policy";

/**
 * סולם חבילות הפודקאסט ב-/podcast (תוכנית הבהירות, שלב 4, D103, 11.10.2026).
 *
 * אותן 3 חבילות כמו בעמוד הקלטת הפודקאסט (PODCAST_RECORDING_PACKAGES), בטבלת
 * השוואה אחת. עד עכשיו /podcast הציג 3 חבילות אחרות, פעמיים, ו"פרימיום" היה
 * בו חבילה אחרת מאשר בעמוד ההקלטה.
 *
 * כל תא נשען על מקור:
 * - צילום, תאורה והפרק בסוף ההקלטה: PODCAST_VIDEO_INCLUDES_NOTE (D63, הבעלים 8.10).
 * - 4K: אישור הבעלים 11.10.2026 (D104).
 * - עריכה נוספת: בתוספת באודיו (PRICING_ADDON_LINKS.podcast_audio) ובווידאו
 *   (PODCAST_RECORDING_PACKAGES), כלולה בהפקה המלאה (PODCAST_FULL_PRODUCTION_NOTE).
 * - רילס: בתוספת בווידאו, 2 כלולים בהפקה המלאה (הבעלים 11.10).
 * - ייעוץ ומעברי תמונה: הנקודות של הבעלים בהפקה המלאה (8.10).
 * - בכל החבילות: שיפורי הסאונד (PODCAST_PRODUCTION_QUALITY), סבב התיקונים
 *   (REVISION_POLICIES) ומאגר המוזיקה (אישור הבעלים 11.10, D104).
 * "גיבוי חומרי גלם למשך שנה" ירד (D104): הוא סתר את /whats-included.
 */

export type LadderCell =
  | { kind: "yes"; text?: string }
  | { kind: "no" }
  | { kind: "addon" }
  | { kind: "text"; text: string };

export type LadderRow = {
  id: string;
  label: string;
  cells: readonly LadderCell[];
};

export type LadderPackage = {
  id: string;
  catalogId: PriceItemId;
  title: string;
  exVat: number;
  /** שם מלא לסכמה ולקורא מסך */
  name: string;
  whatsappText: string;
};

export type PackageLadder = {
  packages: readonly LadderPackage[];
  rows: readonly LadderRow[];
  /** מה שזהה בכל החבילות. מוצג מתחת לטבלה ולא כשורות זהות */
  inAll: readonly string[];
};

const CATALOG_BY_PACKAGE = {
  audio: "podcast_audio",
  video: "podcast_video",
  full: "full_podcast_production",
} as const satisfies Record<(typeof PODCAST_RECORDING_PACKAGES)[number]["id"], PriceItemId>;

/* נוסח D94: "שלום, אשמח ל..." */
const WHATSAPP_TEXT: Record<keyof typeof CATALOG_BY_PACKAGE, string> = {
  audio: "שלום, אשמח להקליט פודקאסט אודיו.",
  video: "שלום, אשמח להקליט פודקאסט וידאו.",
  full: "שלום, אשמח להפקת פודקאסט מלאה.",
};

function podcastRevisionsLine(): string {
  const policy = REVISION_POLICIES.find((p) => p.id === "podcast");
  if (!policy) throw new Error("revision policy for podcast is missing (lib/data/revision-policy.ts)");
  return policy.rounds === 1 ? "סבב תיקונים אחד" : `${policy.rounds} סבבי תיקונים`;
}

export function getPodcastLadder(): PackageLadder {
  const packages: LadderPackage[] = PODCAST_RECORDING_PACKAGES.map((pkg) => {
    const catalogId = CATALOG_BY_PACKAGE[pkg.id];
    return {
      id: pkg.id,
      catalogId,
      title: pkg.title,
      exVat: getExVat(catalogId),
      name: getPriceById(catalogId).label,
      whatsappText: WHATSAPP_TEXT[pkg.id],
    };
  });

  const no = { kind: "no" } as const;
  const addon = { kind: "addon" } as const;
  const yes = { kind: "yes" } as const;

  const VIDEO_CELL = `${PODCAST_VIDEO_CAMERAS_SHORT} ב-4K`;
  const soundSteps = PODCAST_PRODUCTION_QUALITY.filter((q) => q.id !== "soften").map((q) => q.title);

  return {
    packages,
    rows: [
      {
        id: "video",
        label: "צילום וידאו",
        /* 4K בסוף: "4K, 3 עד 4" מתהפך בתצוגה מימין לשמאל */
        cells: [no, { kind: "text", text: VIDEO_CELL }, { kind: "text", text: VIDEO_CELL }],
      },
      { id: "lighting", label: "תאורה באולפן", cells: [no, yes, yes] },
      {
        id: "extra-edit",
        label: "עריכה נוספת: ניקוי גמגומים, שיעולים ושתיקות",
        cells: [addon, addon, { kind: "yes", text: PODCAST_EXTRA_EDIT_TIME }],
      },
      {
        id: "reels",
        label: "רילס",
        cells: [no, addon, { kind: "text", text: PODCAST_FULL_PRODUCTION_REELS_NOTE }],
      },
      { id: "consulting", label: "ייעוץ ועריכה מהודקת וקפדנית יותר", cells: [no, no, yes] },
      { id: "transitions", label: "מעברי תמונה, וכל מה שמעלה את הפרק לרמה פרימיום", cells: [no, no, yes] },
    ],
    inAll: [
      "הפרק אצלכם באותה שנייה שמסיימים להקליט",
      `שיפורי סאונד: ${soundSteps.join(", ")}`,
      "מאגר מוזיקה מורשה לשימוש חופשי",
      podcastRevisionsLine(),
    ],
  };
}
