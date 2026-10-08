"use client";

import { MicIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type Props = {
  isListening: boolean;
  onClick: () => void;
  className?: string;
  size?: "sm" | "md";
};

export default function VoiceSearchMicButton({
  isListening,
  onClick,
  className,
  size = "sm",
}: Props) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isListening ? "עצירת הקלטה" : "חיפוש קולי"}
      aria-pressed={isListening}
      className={cn(
        "flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-brand-red",
        /* F-42 (7.10.2026): ring-brand-red/30 נמדד 1.6:1 על הרקע, מתחת ל-3:1 של 1.4.11.
           צבע מלא (4.81:1) בכל 332 העמודים שבהם יש שדה חיפוש. */
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red",
        dim,
        isListening &&
          "border border-brand-red/30 bg-brand-red/5 text-brand-red motion-safe:animate-pulse",
        className,
      )}
    >
      <MicIcon size={iconSize} />
    </button>
  );
}
