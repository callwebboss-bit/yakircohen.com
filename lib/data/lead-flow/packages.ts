import type { PriceItemId } from "@/lib/data/pricing-catalog";
import type { LeadFlowServiceId } from "./services";

export const PACKAGE_TIER_IDS = ["full", "adapted", "economy"] as const;
export type PackageTierId = (typeof PACKAGE_TIER_IDS)[number];

export const ECONOMY_WARNING =
  "חבילה זו כוללת ציוד בסיסי בלבד. אינה כוללת גיבוי טכני במקום, תפעול מורכב או גמישות בלוח הזמנים.";

export type PackageTierDef = {
  id: PackageTierId;
  title: string;
  summary: string;
  /** מקור מחיר בקטלוג; null = מחיר בשיחה */
  catalogId: PriceItemId | null;
};

type PackageMap = Record<PackageTierId, PackageTierDef>;

const ATTRACTION_PACKAGES: PackageMap = {
  full: {
    id: "full",
    title: "חבילה מלאה",
    summary: "מענה היקפי, מפעיל וגיבוי לפי מה שסוכם להצעה.",
    catalogId: "event_attraction_3",
  },
  adapted: {
    id: "adapted",
    title: "חבילה מותאמת",
    summary: "נבנית לפי תשובות השאלון - היקף וציוד לפי הצורך.",
    catalogId: "event_attraction_2",
  },
  economy: {
    id: "economy",
    title: "חבילה חסכונית",
    summary: "אפקט בסיסי בהיקף מצומצם.",
    catalogId: "event_attraction_1",
  },
};

export const PACKAGE_TIERS: Record<LeadFlowServiceId, PackageMap> = {
  confetti: ATTRACTION_PACKAGES,
  bubbles: ATTRACTION_PACKAGES,
  "heavy-smoke": ATTRACTION_PACKAGES,
  song: {
    full: {
      id: "full",
      title: "חבילה מלאה",
      summary: "הפקת סינגל מלא לפי היקף הקטלוג.",
      catalogId: "single_production",
    },
    adapted: {
      id: "adapted",
      title: "חבילה מותאמת",
      summary: "חבילת הקלטת שיר לפי תשובות השאלון.",
      catalogId: "song_package",
    },
    economy: {
      id: "economy",
      title: "חבילה חסכונית",
      summary: "הקלטת קאבר בהיקף בסיסי.",
      catalogId: "cover_song",
    },
  },
  podcast: {
    full: {
      id: "full",
      title: "חבילה מלאה",
      summary: "חבילת תוכן מלאה לפי הקטלוג.",
      catalogId: "content_package",
    },
    adapted: {
      id: "adapted",
      title: "חבילה מותאמת",
      summary: "פודקאסט וידאו או אודיו לפי הפורמט שנבחר.",
      catalogId: "podcast_video",
    },
    economy: {
      id: "economy",
      title: "חבילה חסכונית",
      summary: "פודקאסט אודיו בהיקף בסיסי.",
      catalogId: "podcast_audio",
    },
  },
  "mobile-studio": {
    full: {
      id: "full",
      title: "חבילה מלאה",
      summary: "אולפן זמני בחברה - חצי יום לפי הקטלוג.",
      catalogId: "on_site_half_day",
    },
    adapted: {
      id: "adapted",
      title: "חבילה מותאמת",
      summary: "אולפן הקלטות נייד לפי היקף האירוע.",
      catalogId: "mobile_studio",
    },
    economy: {
      id: "economy",
      title: "חבילה חסכונית",
      summary: "פודקאסט נייד בבית / משרד - מחיר התחלה.",
      catalogId: "mobile_podcast_at_home",
    },
  },
  "used-gear": {
    full: {
      id: "full",
      title: "חבילה מלאה",
      summary: "מספר פריטים מהמלאי + בדיקה במקום.",
      catalogId: null,
    },
    adapted: {
      id: "adapted",
      title: "חבילה מותאמת",
      summary: "פריט לפי מה שביקשתם במלאי.",
      catalogId: null,
    },
    economy: {
      id: "economy",
      title: "חבילה חסכונית",
      summary: "פריט בודד מהמלאי הקיים, בלי תוספות.",
      catalogId: null,
    },
  },
};

/** התאמת catalogId לשכבת adapted לפי תשובות */
export function resolveAdaptedCatalogId(
  serviceId: LeadFlowServiceId,
  answers: Record<string, string>,
): PriceItemId | null {
  const base = PACKAGE_TIERS[serviceId].adapted.catalogId;
  if (serviceId === "confetti" || serviceId === "bubbles" || serviceId === "heavy-smoke") {
    if (answers.guestCount === "500plus" || answers.techNeed === "backup") {
      return "event_attraction_3";
    }
    if (answers.techNeed === "basic") {
      return "event_attraction_1";
    }
    return base;
  }
  if (serviceId === "podcast") {
    if (answers.podcastFormat === "audio") return "podcast_audio";
    if (answers.podcastSeries === "brand") return "content_package";
    if (answers.podcastPlace === "mobile") return "mobile_podcast_at_home";
    return base;
  }
  if (serviceId === "song") {
    if (answers.songGoal === "release") return "single_production";
    if (answers.songGoal === "cover" || answers.songGoal === "gift") return "cover_song";
    return base;
  }
  if (serviceId === "mobile-studio") {
    if (answers.mobileDuration === "full") return "on_site_full_day";
    if (answers.mobileDuration === "2h") return "mobile_podcast_at_home";
    return base;
  }
  return base;
}

export function resolveTierCatalogId(
  serviceId: LeadFlowServiceId,
  tierId: PackageTierId,
  answers: Record<string, string>,
): PriceItemId | null {
  if (tierId === "adapted") {
    return resolveAdaptedCatalogId(serviceId, answers);
  }
  return PACKAGE_TIERS[serviceId][tierId].catalogId;
}
