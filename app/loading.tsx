import BlockSkeleton from "@/components/ui/BlockSkeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10" dir="rtl">
      <BlockSkeleton className="h-40 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <BlockSkeleton className="h-28" />
        <BlockSkeleton className="h-28" />
      </div>
      <BlockSkeleton className="h-32" />
    </div>
  );
}
