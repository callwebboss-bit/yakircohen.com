import dynamic from "next/dynamic";

function SocialProofSkeleton() {
  return (
    <div
      className="section-py mx-auto max-w-[var(--width-content)] px-4 sm:px-6 lg:px-8"
      aria-hidden
    >
      <div className="mx-auto h-8 max-w-md animate-pulse rounded-lg bg-border/60" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="min-h-[280px] animate-pulse rounded-2xl bg-border/40" />
        <div className="min-h-[280px] animate-pulse rounded-2xl bg-border/40" />
      </div>
    </div>
  );
}

// IMPROVED: defer Elfsight + YouTube social proof from initial home bundle
export const HomeSocialProofSectionLazy = dynamic(
  () => import("@/components/marketing/HomeSocialProofSection"),
  { loading: () => <SocialProofSkeleton /> },
);
