import { BLESSING_REMOTE_TRADEOFF_NOTE, catalogWithVat, getExVat } from "@/lib/data/pricing-catalog";
import type { RecordingTypeId, StudioPackageId } from "@/lib/data/studio-recording-booking";

export type RecordingTypeFlow = {
  hideLocation: boolean;
  hideAtmosphere: boolean;
  defaultPackageId: StudioPackageId | null;
  stepTitle?: string;
  remoteHint?: string;
};

export function getRecordingTypeFlow(
  recordingType: RecordingTypeId | "",
): RecordingTypeFlow {
  switch (recordingType) {
    case "voiceover":
      return {
        hideLocation: true,
        hideAtmosphere: true,
        defaultPackageId: "remote",
        stepTitle: "קריינות מרחוק",
        remoteHint:
          "שולחים טקסט או הקלטה מהבית - אנחנו מחזירים קובץ מוכן לפרסום. אין צורך להגיע פיזית לאולפן.",
      };
    case "bride_blessing":
      return {
        hideLocation: false,
        hideAtmosphere: false,
        defaultPackageId: "remote",
        remoteHint: `ברירת מחדל: הקלטה מרחוק (${catalogWithVat(getExVat("studio_remote")).toLocaleString("he-IL")} ₪ כולל מע״מ, אותו מחיר כמו באולפן). ${BLESSING_REMOTE_TRADEOFF_NOTE}. אפשר גם להגיע לאולפן במודיעין.`,
      };
    case "general_blessing":
      return {
        hideLocation: false,
        hideAtmosphere: false,
        defaultPackageId: "remote",
      };
    case "event_song":
      return {
        hideLocation: false,
        hideAtmosphere: false,
        defaultPackageId: "song",
      };
    /* דרשה היא ברכה ולא שיר. קודם ברירת המחדל הייתה חבילת השיר ב-990. */
    case "bar_mitzvah_speech":
      return {
        hideLocation: false,
        hideAtmosphere: false,
        defaultPackageId: "remote",
      };
    default:
      return {
        hideLocation: false,
        hideAtmosphere: false,
        defaultPackageId: null,
      };
  }
}
