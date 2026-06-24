import BlockSkeleton from "@/components/ui/BlockSkeleton";

export default function ServicePageLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10" dir="rtl">
      {/* Hero */}
      <BlockSkeleton className="h-56 rounded-2xl" />
      {/* Content sections */}
      <div className="grid gap-4 sm:grid-cols-2">
        <BlockSkeleton className="h-32" />
        <BlockSkeleton className="h-32" />
      </div>
      <BlockSkeleton className="h-48" />
      <BlockSkeleton className="h-24" />
    </div>
  );
}
