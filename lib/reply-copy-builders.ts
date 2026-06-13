/**
 * Reply Studio - shared copy builders for /book and yakir-closer (via export).
 * SSOT: lib/data/closer-brand-copy.json
 */
import brandCopy from "@/lib/data/closer-brand-copy.json";
import {
  createReplyBuilders,
  type BrandCopySlice,
  type BuildReplyOpts,
  type PlaybackScenario,
  type ReplyContext,
  type ReplyLength,
  type ReplyPath,
  type ReplyTone,
} from "@/lib/reply-copy-builders-core";

export type {
  BuildReplyOpts,
  PlaybackScenario,
  ReplyContext,
  ReplyLength,
  ReplyPath,
  ReplyTone,
};

const brandSlice: BrandCopySlice = {
  playbackCopy: brandCopy.playbackCopy,
  continueChatPaths: brandCopy.continueChatPaths as Record<string, string>,
  groupPlaybackReadyPitch: brandCopy.groupPlaybackReadyPitch as Record<string, string>,
  groupMessaging: brandCopy.groupMessaging as BrandCopySlice["groupMessaging"],
  replyStudioLabels: brandCopy.replyStudioLabels,
};

const builders = createReplyBuilders(brandSlice);

export const detectPlaybackScenario = builders.detectPlaybackScenario;
export const buildContinueChatReply = builders.buildContinueChatReply;
export const buildHotCloseReply = builders.buildHotCloseReply;
export const buildPlaybackReply = builders.buildPlaybackReply;
export const getRecommendedPathId = builders.getRecommendedPathId;
export const suggestReplyPaths = builders.suggestReplyPaths;
export const buildReplyText = builders.buildReplyText;
export const getReplyStudioLabels = builders.getReplyStudioLabels;
export const getPrepTipsShort = builders.getPrepTipsShort;
