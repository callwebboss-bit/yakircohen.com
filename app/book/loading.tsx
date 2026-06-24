import BlockSkeleton from "@/components/ui/BlockSkeleton";

export default function BookLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-10" dir="rtl">
      <BlockSkeleton className="h-8 w-1/2 rounded-lg" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <BlockSkeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <BlockSkeleton className="h-64 rounded-2xl" />
    </div>
  );
}
