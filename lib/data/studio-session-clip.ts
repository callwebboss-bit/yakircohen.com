import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";
import {
  getExVat,
  getWithEditingById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";

export const STUDIO_SESSION_CLIP_CATALOG_ID = "studio_session_clip" satisfies PriceItemId;

export const STUDIO_SESSION_CLIP_YOUTUBE_ID =
  YOUTUBE_SERVICE_EMBED_IDS["studio-session-clip"];

export const STUDIO_SESSION_CLIP_VIDEO_TITLE = "הקלטה אמיתית באולפן - דוגמת קליפ מהסשן";

export const STUDIO_SESSION_CLIP_HEADING = "איך נראית הקלטה אמיתית באולפן";

export const STUDIO_SESSION_CLIP_INTRO =
  "מי שרוצה לראות סשן אמיתי - הדוגמה למטה. מי שרוצה קליפ כזה מההקלטה: צילום בלי עריכה, או אותו צילום עם עריכה.";

export function getStudioSessionClipPrices() {
  const rawExVat = getExVat(STUDIO_SESSION_CLIP_CATALOG_ID);
  const edited = getWithEditingById(STUDIO_SESSION_CLIP_CATALOG_ID);
  if (!edited) {
    throw new Error("studio_session_clip is missing withEditing in the catalog");
  }
  return {
    rawExVat,
    editedExVat: edited.exVat,
    editedLabel: edited.label,
  };
}
