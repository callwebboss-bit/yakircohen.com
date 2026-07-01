"use client";

import { useCallback, useMemo, useState } from "react";
import {
  buildReplyText,
  getReplyStudioLabels,
  suggestReplyPaths,
  type ReplyContext,
  type ReplyLength,
  type ReplyStudioLabels,
  type ReplyTone,
} from "@/lib/reply-copy-builders";
import { cn } from "@/lib/utils";

type BookReplyStudioProps = {
  context: ReplyContext;
  forCloser?: boolean;
  compact?: boolean;
  className?: string;
  labelsOverride?: Partial<ReplyStudioLabels>;
  onCopy?: (text: string) => void;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1.5">
      {children}
    </p>
  );
}

export default function BookReplyStudio({
  context,
  forCloser = false,
  compact = false,
  className,
  labelsOverride,
  onCopy,
}: BookReplyStudioProps) {
  const labels = { ...getReplyStudioLabels(), ...labelsOverride };
  const paths = useMemo(
    () => suggestReplyPaths({ ...context, forCloser }),
    [context, forCloser],
  );

  const recommended = paths.find((p) => p.recommended) || paths[0];
  const [pathId, setPathId] = useState(recommended?.id || "soft_continue");
  const [length, setLength] = useState<ReplyLength>("short");
  const [tone, setTone] = useState<ReplyTone>("direct");
  const [userDraft, setUserDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const effectivePathId = useMemo(() => {
    if (paths.some((p) => p.id === pathId)) return pathId;
    return recommended?.id || "soft_continue";
  }, [paths, pathId, recommended?.id]);

  const templateDraft = useMemo(
    () => buildReplyText(effectivePathId, { ...context, forCloser }, { length, tone }),
    [effectivePathId, context, forCloser, length, tone],
  );

  const draft = userDraft ?? templateDraft;

  const rebuild = useCallback(() => {
    setUserDraft(null);
  }, []);

  const handleCopy = async () => {
    const text = draft.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      onCopy?.(text);
    } catch {
      window.prompt("העתק:", text);
    }
  };

  if (!paths.length) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-red/20 bg-gradient-to-b from-brand-red/[0.07] to-surface p-4 sm:p-5 space-y-4 shadow-sm",
        className,
      )}
    >
      <div className="space-y-1">
        <p className="text-base font-serif font-bold text-brand-red">
          {labels.title || "הודעות מוכנות"}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {labels.subtitle || "בחר מסלול, ערוך בנוחות, והעתק לוואטסאפ"}
        </p>
      </div>

      <div>
        <SectionLabel>{labels.pathLabel || "סוג מענה"}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {paths.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPathId(p.id);
                setUserDraft(null);
              }}
              className={cn(
                "rounded-full border px-3.5 py-2 text-xs font-medium transition-all min-h-9",
                effectivePathId === p.id
                  ? "border-brand-red bg-brand-red text-white shadow-md shadow-brand-red/20"
                  : "border-border bg-white text-muted-foreground hover:border-brand-red/40 hover:bg-brand-red/[0.04]",
                p.recommended && effectivePathId !== p.id && "ring-1 ring-brand-red/25",
              )}
            >
              {p.recommended ? "★ " : ""}
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <SectionLabel>{labels.lengthLabel || "אורך"}</SectionLabel>
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-white p-0.5">
            {(["short", "standard", "full"] as ReplyLength[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLength(l);
                  setUserDraft(null);
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  length === l ? "bg-brand-red text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {labels.length?.[l] || l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel>{labels.toneLabel || "טון"}</SectionLabel>
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-white p-0.5">
            {(["direct", "warm", "caring"] as ReplyTone[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTone(t);
                  setUserDraft(null);
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  tone === t ? "bg-foreground/90 text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {labels.tone?.[t] || t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>{labels.editLabel || "עריכה"}</SectionLabel>
        <textarea
          className={cn(
            "w-full resize-y rounded-xl border-2 border-border bg-white px-4 py-3 leading-relaxed text-foreground shadow-inner focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
            compact ? "min-h-[160px] text-sm" : "min-h-[240px] text-base",
          )}
          dir="rtl"
          value={draft}
          onChange={(e) => {
            setUserDraft(e.target.value);
          }}
          placeholder="ערוך כאן את המענה..."
          aria-label="עריכת הודעה מוכנה"
        />
      </div>

      <div className={cn("flex flex-wrap gap-2", compact ? "" : "sm:grid sm:grid-cols-[1fr_auto_auto]")}>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className={cn(
            "rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red/90 transition-colors",
            compact ? "" : "sm:order-first",
          )}
        >
          {copied ? "הועתק ✓" : labels.actions?.copy || "העתק"}
        </button>
        <button
          type="button"
          onClick={rebuild}
          className="rounded-lg border border-border bg-white px-4 py-2.5 text-xs font-medium hover:border-brand-red/40"
        >
          {labels.actions?.refresh || "רענן מהתבנית"}
        </button>
      </div>
    </div>
  );
}
