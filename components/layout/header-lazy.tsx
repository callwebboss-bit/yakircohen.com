import dynamic from "next/dynamic";

function SearchSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`h-10 w-full animate-pulse rounded-xl bg-surface ${className ?? ""}`}
      aria-hidden
    />
  );
}

// OPTIMIZED: code-split Pagefind search - loads only when chunk is requested
export const SiteSearchLazy = dynamic(
  () => import("@/components/ui/SiteSearch"),
  {
    ssr: false,
    loading: () => <SearchSkeleton />,
  },
);

// OPTIMIZED: mobile drawer + nav tree in separate chunk, mounted only when menu opens
export const SiteNavMobileDrawerLazy = dynamic(
  () =>
    import("@/components/layout/SiteNav").then((m) => ({
      default: m.SiteNavMobileDrawer,
    })),
  { ssr: false },
);
