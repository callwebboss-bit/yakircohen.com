import BlockSkeleton from "@/components/ui/BlockSkeleton";

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10" dir="rtl">
      <BlockSkeleton className="h-10 w-2/3 rounded-lg" />
      <BlockSkeleton className="h-5 w-1/3 rounded-md" />
      <BlockSkeleton className="h-64 rounded-2xl" />
      <div className="space-y-3">
        <BlockSkeleton className="h-4 rounded" />
        <BlockSkeleton className="h-4 w-11/12 rounded" />
        <BlockSkeleton className="h-4 w-9/12 rounded" />
      </div>
      <div className="space-y-3">
        <BlockSkeleton className="h-4 rounded" />
        <BlockSkeleton className="h-4 w-10/12 rounded" />
      </div>
    </div>
  );
}
