"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BookDemoVideoModal from "@/components/booking/BookDemoVideoModal";
import { getAudioDemo, type AudioDemoId } from "@/lib/data/audio-demos";
import { cn } from "@/lib/utils";

const CLIP_SECONDS = 8;

type BookingPackageMediaStripProps = {
  audioDemoId?: AudioDemoId;
  youtubeVideoId?: string;
  title: string;
  className?: string;
};

export default function BookingPackageMediaStrip({
  audioDemoId,
  youtubeVideoId,
  title,
  className,
}: BookingPackageMediaStripProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [playing, setPlaying] = useState<"before" | "after" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const demo = audioDemoId ? getAudioDemo(audioDemoId) : null;
  const hasAudio = demo?.status === "ready";
  const hasVideo = Boolean(youtubeVideoId);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(null);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const playClip = (e: React.MouseEvent, mode: "before" | "after") => {
    e.stopPropagation();
    e.preventDefault();
    if (!demo || demo.status !== "ready") return;

    if (playing === mode) {
      stop();
      return;
    }

    stop();
    const src = mode === "before" ? demo.beforeSrc : demo.afterSrc;
    const audio = new Audio(src);
    audio.preload = "none";
    audioRef.current = audio;
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime >= CLIP_SECONDS) stop();
    });
    audio.addEventListener("ended", () => setPlaying(null));
    audio.addEventListener("error", () => setPlaying(null));
    void audio.play().then(() => setPlaying(mode)).catch(() => setPlaying(null));
  };

  const openVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setVideoOpen(true);
  };

  if (!hasAudio && !hasVideo) return null;

  return (
    <>
      <div
        className={cn(
          "mt-1 w-full rounded-xl border border-border/70 bg-background/80 p-2.5",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {hasAudio ? (
          <div className="space-y-2">
            <p className="text-[0.65rem] font-semibold text-muted-foreground">
              שמעו את ההבדל
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={(e) => playClip(e, "before")}
                aria-pressed={playing === "before"}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition-colors",
                  playing === "before"
                    ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_8%,transparent)] text-[var(--service-accent,#d42b2b)]"
                    : "border-border text-foreground hover:border-[var(--service-accent,#d42b2b)]/35",
                )}
              >
                <span aria-hidden="true">{playing === "before" ? "■" : "▶"}</span>
                לפני
              </button>
              <button
                type="button"
                onClick={(e) => playClip(e, "after")}
                aria-pressed={playing === "after"}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition-colors",
                  playing === "after"
                    ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_8%,transparent)] text-[var(--service-accent,#d42b2b)]"
                    : "border-border text-foreground hover:border-[var(--service-accent,#d42b2b)]/35",
                )}
              >
                <span aria-hidden="true">{playing === "after" ? "■" : "▶"}</span>
                אחרי
              </button>
            </div>
          </div>
        ) : null}

        {hasVideo ? (
          <button
            type="button"
            onClick={openVideo}
            className={cn(
              "flex w-full min-h-11 items-center gap-3 overflow-hidden rounded-lg border border-border text-start transition-colors hover:border-[var(--service-accent,#d42b2b)]/40",
              hasAudio && "mt-2",
            )}
          >
            <span className="relative block h-14 w-24 shrink-0 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
                ▶
              </span>
            </span>
            <span className="min-w-0 pe-2">
              <span className="block text-xs font-semibold text-foreground">צפו בדוגמה</span>
              <span className="block text-[0.65rem] text-muted-foreground">קליפ מהאולפן</span>
            </span>
          </button>
        ) : null}
      </div>

      {hasVideo && youtubeVideoId ? (
        <BookDemoVideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoId={youtubeVideoId}
          title={title}
        />
      ) : null}
    </>
  );
}
