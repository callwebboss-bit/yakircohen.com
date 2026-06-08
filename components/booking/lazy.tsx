import dynamic from "next/dynamic";
import BlockSkeleton from "@/components/ui/BlockSkeleton";

export const FilterGateLazy = dynamic(
  () => import("@/components/marketing/FilterGate"),
  { loading: () => <BlockSkeleton className="min-h-[24rem]" /> },
);
