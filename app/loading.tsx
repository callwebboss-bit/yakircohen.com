import Container from "@/components/ui/Container";
import BlockSkeleton from "@/components/ui/BlockSkeleton";

export default function Loading() {
  return (
    <Container className="section-py">
      <div className="space-y-4">
        <BlockSkeleton className="h-10 w-2/3" />
        <BlockSkeleton className="h-4 w-1/2" />
        <BlockSkeleton className="mt-6 min-h-[20rem]" />
      </div>
    </Container>
  );
}
