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
        remoteHint: "ברירת מחדל: הקלטה מרחוק (590 ₪). אפשר גם להגיע לאולפן במודיעין.",
      };
    case "general_blessing":
      return {
        hideLocation: false,
        hideAtmosphere: false,
        defaultPackageId: "remote",
      };
    case "event_song":
    case "bar_mitzvah_speech":
      return {
        hideLocation: false,
        hideAtmosphere: false,
        defaultPackageId: "classic",
      };
    default:
      return {
        hideLocation: false,
        hideAtmosphere: false,
        defaultPackageId: null,
      };
  }
}
