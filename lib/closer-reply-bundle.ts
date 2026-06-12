/**
 * Browser bundle entry — npm run export:closer → local-tools/closer-reply-builders.js
 */
import { createReplyBuilders, type BrandCopySlice } from "./reply-copy-builders-core";

type CloserConfig = BrandCopySlice & Record<string, unknown>;

function sliceBrand(raw: CloserConfig | null | undefined): BrandCopySlice {
  const c = raw || ({} as CloserConfig);
  return {
    playbackCopy: (c.playbackCopy || {}) as BrandCopySlice["playbackCopy"],
    continueChatPaths: (c.continueChatPaths || {}) as Record<string, string>,
    groupPlaybackReadyPitch: c.groupPlaybackReadyPitch as BrandCopySlice["groupPlaybackReadyPitch"],
    groupMessaging: c.groupMessaging as BrandCopySlice["groupMessaging"],
    replyStudioLabels: c.replyStudioLabels as BrandCopySlice["replyStudioLabels"],
  };
}

function getBuilders() {
  const cfg =
    typeof window !== "undefined"
      ? (window as Window & { CLOSER_CONFIG?: CloserConfig }).CLOSER_CONFIG
      : undefined;
  return createReplyBuilders(sliceBrand(cfg));
}

const METHODS = [
  "detectPlaybackScenario",
  "buildContinueChatReply",
  "buildHotCloseReply",
  "buildPlaybackReply",
  "getRecommendedPathId",
  "suggestReplyPaths",
  "buildReplyText",
  "getReplyStudioLabels",
  "getPrepTipsShort",
] as const;

type MethodName = (typeof METHODS)[number];

const CloserReplyBuilders = {} as Record<MethodName, (...args: never[]) => unknown>;

for (const name of METHODS) {
  CloserReplyBuilders[name] = ((...args: unknown[]) => {
    const b = getBuilders();
    return (b[name] as (...a: unknown[]) => unknown)(...args);
  }) as (...args: never[]) => unknown;
}

if (typeof window !== "undefined") {
  (window as Window & { CloserReplyBuilders?: typeof CloserReplyBuilders }).CloserReplyBuilders =
    CloserReplyBuilders;
}

export default CloserReplyBuilders;
