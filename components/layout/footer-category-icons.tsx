import type { FooterCategoryId } from "@/lib/footer-category-tree";
import { cn } from "@/lib/utils";
import type { JSX } from "react";

type IconProps = { className?: string };

function Mic2Icon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 003-3V7a3 3 0 10-6 0v5a3 3 0 003 3z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M19 11a7 7 0 01-14 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PodcastIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a3 3 0 013 3v6a3 3 0 11-6 0V6a3 3 0 013-3z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5 11a7 7 0 0014 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparklesIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l1.2 4.2L17 8.5l-3.8 1.3L12 14l-1.2-4.2L7 8.5l3.8-1.3L12 3zM5 14l.8 2.8L8.5 17l-2.7.9L5 20.5l-.8-2.6L1.5 17l2.7-.9L5 14zM19 14l.8 2.8L22.5 17l-2.7.9L19 20.5l-.8-2.6L15.5 17l2.7-.9L19 14z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Music2Icon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="18" r="3" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M11 18V5l10-2v13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideoIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M16 10l5-3v10l-5-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GraduationCapIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 9l9-4 9 4-9 4-9-4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M21 10v5l-9 4-9-4v-5M12 13v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("h-4 w-4 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      width={16}
      height={16}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ChevronUpIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("h-4 w-4 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      width={16}
      height={16}
      aria-hidden
    >
      <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<
  FooterCategoryId,
  (props: IconProps) => JSX.Element
> = {
  studio: Mic2Icon,
  podcast: PodcastIcon,
  ai: SparklesIcon,
  events: Music2Icon,
  video: VideoIcon,
  academy: GraduationCapIcon,
};

export function FooterCategoryIcon({
  id,
  className,
}: {
  id: FooterCategoryId;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[id];
  return <Icon className={cn("h-4 w-4 shrink-0 text-brand-red", className)} />;
}

export { ChevronDownIcon, ChevronUpIcon };
