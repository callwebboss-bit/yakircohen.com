/**
 * Pure reply builders - brand copy injected at runtime (site JSON or CLOSER_CONFIG).
 */
export type ReplyLength = "short" | "standard" | "full";
export type ReplyTone = "direct" | "warm" | "caring";
export type PlaybackScenario = "solo" | "parent_child" | "group" | "to_recorder";

export type ReplyContext = {
  leadName?: string;
  recorderName?: string;
  song?: string;
  occasion?: string;
  leadDate?: string;
  leadTime?: string;
  scheduleWindow?: string | null;
  recorderCount?: number;
  childrenCount?: number;
  adultsCount?: number;
  intent?: "continue_chat" | "start_now";
  recordingType?: string;
  recorderVariant?: "boy" | "girl" | "child" | "neutral";
  forCloser?: boolean;
};

export type ReplyPath = {
  id: string;
  label: string;
  recommended?: boolean;
  scenario?: PlaybackScenario;
};

export type BuildReplyOpts = {
  length?: ReplyLength;
  tone?: ReplyTone;
  includeChampionIntro?: boolean;
  includeCare?: boolean;
  includeTips?: boolean;
  scenario?: PlaybackScenario;
  recorderVariant?: ReplyContext["recorderVariant"];
};

export type ReplyStudioLabels = {
  title?: string;
  subtitle?: string;
  pathLabel?: string;
  lengthLabel?: string;
  editLabel?: string;
  toneLabel?: string;
  length?: Partial<Record<ReplyLength, string>>;
  tone?: Partial<Record<ReplyTone, string>>;
  actions?: { copy?: string; refresh?: string; insert?: string };
};

export type BrandCopySlice = {
  playbackCopy: Record<string, unknown>;
  continueChatPaths: Record<string, string>;
  groupPlaybackReadyPitch?: Record<string, string>;
  groupMessaging?: { scheduleLabels?: Record<string, string> };
  replyStudioLabels?: ReplyStudioLabels;
};

function tpl(text: string, vars: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(v);
  }
  return out;
}

export function createReplyBuilders(brandCopy: BrandCopySlice) {
  const gm = brandCopy.groupMessaging || {};

  function scheduleLabel(scheduleWindow?: string | null): string {
    const labels = gm.scheduleLabels || {};
    if (scheduleWindow === "motzash") return labels.motzash || 'מוצ"ש';
    if (scheduleWindow === "weekdays") return labels.weekdays || "יום חול";
    return labels.default || 'מוצ"ש או שני הבא';
  }

  function formatScheduleDetail(ctx: ReplyContext): string {
    const parts: string[] = [];
    if (ctx.leadDate) {
      const d = ctx.leadDate;
      const [y, m, day] = d.split("-");
      if (y && m && day) parts.push(`${day}.${m}`);
      else parts.push(d);
    } else {
      parts.push(scheduleLabel(ctx.scheduleWindow));
    }
    if (ctx.leadTime) parts.push(` בשעה ${ctx.leadTime}`);
    return parts.join("");
  }

  function songRef(song?: string): string {
    const s = (song || "").trim();
    if (!s) return "";
    return ` ל${s}`;
  }

  function formatGuideLink(entry?: { label?: string; url?: string }): string {
    if (!entry?.url) return "";
    return `${entry.label || entry.url}: ${entry.url}`;
  }

  function replyTplVars(ctx: ReplyContext): Record<string, string> {
    const copy = brandCopy.playbackCopy as {
      guideLinks?: Record<string, { label?: string; url?: string }>;
    };
    const links = copy.guideLinks || {};
    const name = (ctx.leadName || "").trim() || "שם";
    const recorderName = (ctx.recorderName || ctx.leadName || "").trim() || "שם";
    const song = (ctx.song || "").trim();
    return {
      name,
      recorderName,
      celebrantName: recorderName,
      song,
      songRef: songRef(song),
      songLine: song ? ` השיר: ${song}.` : "",
      occasion: (ctx.occasion || "").trim() || "האירוע",
      scheduleLabel: scheduleLabel(ctx.scheduleWindow),
      scheduleDetail: formatScheduleDetail(ctx),
      dateLine: ctx.leadDate
        ? ` לגבי ${formatScheduleDetail(ctx)} - נשמח לאשר שהתאריך עדיין מתאים.`
        : "",
      dateDetail: formatScheduleDetail(ctx),
      studioGuide: formatGuideLink(links.studioGuide),
      barMitzvahGuide: formatGuideLink(links.barMitzvahSong),
      chuppahGuide: formatGuideLink(links.chuppahSong),
      pitchGuide: formatGuideLink(links.pitchGuide),
    };
  }

  function detectPlaybackScenario(ctx: ReplyContext): PlaybackScenario {
    const rc = ctx.recorderCount ?? 0;
    const children = ctx.childrenCount ?? 0;
    if (rc >= 2) return "group";
    if (children >= 1) return "parent_child";
    return "solo";
  }

  function getPitchBlock(scenario: PlaybackScenario) {
    const copy = brandCopy.playbackCopy as Record<string, unknown>;
    if (scenario === "group") {
      return (copy.group as object) || brandCopy.groupPlaybackReadyPitch;
    }
    if (scenario === "parent_child") return copy.parentChild;
    return copy.solo;
  }

  function pickBodyTemplate(
    pitch: { short?: string; bodyTemplate?: string },
    length: ReplyLength,
  ): string {
    if (length === "short" && pitch.short) return pitch.short;
    return pitch.bodyTemplate || pitch.short || "";
  }

  function buildContinueChatReply(ctx: ReplyContext, length: ReplyLength = "short"): string {
    const paths = brandCopy.continueChatPaths;
    const vars = replyTplVars(ctx);
    const hasSong = !!(ctx.song || "").trim();
    const key =
      length === "short" && hasSong && ctx.leadDate
        ? "withSongQuestion"
        : length === "short"
          ? "short"
          : "standard";
    const raw = paths[key] || paths.short || "";
    return tpl(raw, vars).replace(/\.\./g, ".").trim();
  }

  function buildHotCloseReply(ctx: ReplyContext): string {
    const name = (ctx.leadName || "").trim() || "שלום";
    const parts = [`שלום ${name}, תודה. ראינו שאתם מוכנים להתחיל.`];
    if (ctx.leadDate) {
      parts.push(`לגבי ${formatScheduleDetail(ctx)}, נשמח לאשר שעה מדויקת.`);
    }
    parts.push("מה נוח לכם - מקדמה עכשיו או שיחה קצרה של 3 דקות?");
    return parts.join("\n");
  }

  function buildPlaybackReply(ctx: ReplyContext, opts: BuildReplyOpts = {}): string {
    const length = opts.length ?? "short";
    const scenario = opts.scenario ?? detectPlaybackScenario(ctx);
    const copy = brandCopy.playbackCopy as Record<string, unknown>;
    const vars = replyTplVars(ctx);

    if (scenario === "to_recorder") {
      const variant = opts.recorderVariant || ctx.recorderVariant || "neutral";
      const toRecorder = copy.toRecorder as Record<string, string> | undefined;
      const raw = toRecorder?.[variant] || toRecorder?.neutral || "";
      return tpl(String(raw), vars);
    }

    if (scenario === "parent_child") {
      const variant = opts.recorderVariant || ctx.recorderVariant || "neutral";
      if (variant !== "neutral") {
        const toRecorder = copy.toRecorder as Record<string, string> | undefined;
        const genderRaw = toRecorder?.[variant] || toRecorder?.child || "";
        if (genderRaw) {
          const body = tpl(String(genderRaw), vars);
          const pitch = copy.parentChild as { championIntro?: string };
          const showIntro =
            opts.includeChampionIntro ?? (ctx.forCloser === true && length !== "short");
          if (showIntro && pitch?.championIntro) {
            const intro = tpl(String(pitch.championIntro), vars);
            const prefix = (ctx.leadName || "").trim()
              ? `${ctx.leadName!.trim()}, ${intro}`
              : intro;
            return `${prefix}\n\n"${body}"`;
          }
          return body;
        }
      }
    }

    const parts: string[] = [];

    if (length === "full") {
      if (opts.includeCare !== false && copy.careBlock) {
        const care = (ctx.leadName || "").trim()
          ? `${ctx.leadName!.trim()}, ${String(copy.careBlock)}`
          : String(copy.careBlock);
        parts.push(care);
      }
      if (copy.attachNote) parts.push(String(copy.attachNote));
    }

    const pitch = getPitchBlock(scenario) as { short?: string; bodyTemplate?: string; championIntro?: string };
    const bodyRaw = pickBodyTemplate(pitch, length);
    const body = tpl(bodyRaw, vars);

    const showIntro =
      opts.includeChampionIntro ?? (ctx.forCloser === true && length !== "short");

    if (showIntro && pitch?.championIntro) {
      const intro = tpl(String(pitch.championIntro), vars);
      const prefix = (ctx.leadName || "").trim() ? `${ctx.leadName!.trim()}, ${intro}` : intro;
      parts.push(`${prefix}\n\n"${body}"`);
    } else {
      parts.push(body);
    }

    if (length === "full" && opts.includeTips !== false && copy.prepTipsBlock) {
      parts.push(tpl(String(copy.prepTipsBlock), vars));
    }

    return parts.filter(Boolean).join("\n\n");
  }

  function getRecommendedPathId(ctx: ReplyContext): string {
    if (ctx.intent === "start_now") return "hot_close";
    if (ctx.intent === "continue_chat" && (ctx.recorderCount ?? 0) >= 8) return "soft_continue";
    const scenario = detectPlaybackScenario(ctx);
    if (scenario === "parent_child" || scenario === "solo") {
      return `playback_${scenario}`;
    }
    if (scenario === "group") return "playback_group";
    if (ctx.intent === "continue_chat") return "soft_continue";
    return "soft_continue";
  }

  function suggestReplyPaths(ctx: ReplyContext): ReplyPath[] {
    const paths: ReplyPath[] = [];
    const recId = getRecommendedPathId(ctx);
    const scenario = detectPlaybackScenario(ctx);

    if (ctx.intent === "start_now") {
      paths.push({ id: "hot_close", label: "🔥 סגירה מהירה", recommended: recId === "hot_close" });
    }

    if (ctx.intent === "continue_chat" || !ctx.intent) {
      paths.push({
        id: "soft_continue",
        label: "💬 המשך שיחה",
        recommended: recId === "soft_continue",
      });
    }

    if (scenario === "parent_child") {
      paths.push({
        id: "playback_parent_child",
        label: "🎵 פלייבק להורים ילד/ה",
        scenario: "parent_child",
        recommended: recId === "playback_parent_child",
      });
      paths.push({
        id: "playback_to_recorder",
        label: "👤 ישירות למקליט/ה",
        scenario: "to_recorder",
      });
    } else if (scenario === "group") {
      paths.push({
        id: "playback_group",
        label: "🎵 פלייבק לקבוצה",
        scenario: "group",
        recommended: recId === "playback_group",
      });
    } else {
      paths.push({
        id: "playback_solo",
        label: "🎵 פלייבק",
        scenario: "solo",
        recommended: recId === "playback_solo",
      });
    }

    paths.forEach((p) => {
      if (p.recommended === undefined) p.recommended = p.id === recId;
    });

    return paths.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
  }

  function buildReplyText(pathId: string, ctx: ReplyContext, opts: BuildReplyOpts = {}): string {
    const length = opts.length ?? "short";
    switch (pathId) {
      case "hot_close":
        return buildHotCloseReply(ctx);
      case "soft_continue":
        return buildContinueChatReply(ctx, length === "full" ? "standard" : length);
      case "playback_parent_child":
        return buildPlaybackReply(ctx, { ...opts, scenario: "parent_child", length });
      case "playback_solo":
        return buildPlaybackReply(ctx, { ...opts, scenario: "solo", length });
      case "playback_group":
        return buildPlaybackReply(ctx, { ...opts, scenario: "group", length });
      case "playback_to_recorder":
        return buildPlaybackReply(ctx, {
          ...opts,
          scenario: "to_recorder",
          length: length === "full" ? "standard" : length,
        });
      default:
        return buildPlaybackReply(ctx, opts);
    }
  }

  function getReplyStudioLabels(): ReplyStudioLabels {
    return brandCopy.replyStudioLabels ?? {};
  }

  function getPrepTipsShort(ctx: ReplyContext): string {
    const copy = brandCopy.playbackCopy as { prepTipsBlock?: string };
    if (!copy.prepTipsBlock) return "";
    const vars = replyTplVars(ctx);
    const full = tpl(copy.prepTipsBlock, vars);
    return full.split("\n\n")[0] || full.slice(0, 280);
  }

  return {
    detectPlaybackScenario,
    buildContinueChatReply,
    buildHotCloseReply,
    buildPlaybackReply,
    getRecommendedPathId,
    suggestReplyPaths,
    buildReplyText,
    getReplyStudioLabels,
    getPrepTipsShort,
  };
}
