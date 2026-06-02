"use client";

import AudioShowcase, {
  type AudioShowcaseContext,
  type AudioShowcaseVariant,
} from "@/components/seo/AudioShowcase";
import {
  getAudioDemo,
  type AudioDemoId,
} from "@/lib/data/audio-demos";

type Props = {
  demoId: AudioDemoId;
  /** Override variant; defaults to restoration for weber, vocal otherwise */
  variant?: AudioShowcaseVariant;
  context?: AudioShowcaseContext;
  showDisclaimer?: boolean;
  className?: string;
};

export default function SoundImprovementShowcase({
  demoId,
  variant,
  context = "page",
  showDisclaimer = false,
  className,
}: Props) {
  const demo = getAudioDemo(demoId);

  const resolvedVariant: AudioShowcaseVariant =
    variant ??
    (demo.difficulty === "severe" ? "restoration" : "vocal");

  const showDisc =
    showDisclaimer && Boolean(demo.disclaimerHe);

  return (
    <div className={className}>
      {showDisc && demo.disclaimerHe ? (
        <div
          className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-foreground dark:border-amber-900/50 dark:bg-amber-950/30"
          role="note"
        >
          <p className="font-medium text-amber-900 dark:text-amber-100">
            חשוב לדעת לפני שמאזינים
          </p>
          <p className="mt-1 text-muted-foreground">{demo.disclaimerHe}</p>
        </div>
      ) : null}

      <AudioShowcase
        variant={resolvedVariant}
        context={context}
        beforeSrc={demo.beforeSrc}
        afterSrc={demo.afterSrc}
        beforeLabel={demo.beforeLabel}
        afterLabel={demo.afterLabel}
        storageKey={demo.storageKey}
        beforeNote={demo.beforeNote}
        afterNote={demo.afterNote}
      />
    </div>
  );
}
