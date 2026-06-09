import brandCopy from "./closer-brand-copy.json";

export const STUDIO_EXPERIENCE_COPY = brandCopy.studioExperience;

export function formatStudioExperienceBlock(): string {
  const { blockTitle, recordingFlow } = STUDIO_EXPERIENCE_COPY;
  return [blockTitle + ":", ...recordingFlow.map((line) => line)].join("\n");
}
