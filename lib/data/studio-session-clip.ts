import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";
import { getExVat, getPriceById, type PriceItemId } from "@/lib/data/pricing-catalog";

/** הצילום הגולמי (450) - תוספת לברכה ולאולפן הנייד */
export const STUDIO_SESSION_CLIP_CATALOG_ID = "studio_session_clip" satisfies PriceItemId;
/** הקליפ הערוך (750) - תוספת להקלטת שיר. פריט נפרד בקטלוג מ-2.10.2026, במקום withEditing. */
export const STUDIO_SESSION_CLIP_EDITED_CATALOG_ID =
  "studio_session_clip_edited" satisfies PriceItemId;

export const STUDIO_SESSION_CLIP_YOUTUBE_ID =
  YOUTUBE_SERVICE_EMBED_IDS["studio-session-clip"];

export const STUDIO_SESSION_CLIP_VIDEO_TITLE = "הקלטה אמיתית באולפן - דוגמת קליפ מהסשן";

export const STUDIO_SESSION_CLIP_HEADING = "איך נראית הקלטה אמיתית באולפן";

export const STUDIO_SESSION_CLIP_INTRO =
  "מי שרוצה לראות סשן אמיתי - הדוגמה למטה. מי שרוצה קליפ כזה מההקלטה: צילום בלי עריכה, או אותו צילום עם עריכה.";

export function getStudioSessionClipPrices() {
  const edited = getPriceById(STUDIO_SESSION_CLIP_EDITED_CATALOG_ID);
  return {
    rawExVat: getExVat(STUDIO_SESSION_CLIP_CATALOG_ID),
    editedExVat: edited.exVat,
    editedLabel: edited.label,
  };
}
