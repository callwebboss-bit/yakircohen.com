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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30",
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
