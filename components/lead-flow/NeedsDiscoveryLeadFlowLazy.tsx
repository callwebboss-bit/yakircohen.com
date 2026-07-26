"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { LeadFlowServiceId } from "@/lib/data/lead-flow/services";

const NeedsDiscoveryLeadFlow = dynamic(
  () => import("@/components/lead-flow/NeedsDiscoveryLeadFlow"),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-muted-foreground" role="status">
        טוען שאלון התאמה…
      </p>
    ),
  },
);

type Props = {
  defaultServiceId?: LeadFlowServiceId;
};

function Fallback() {
  return (
    <p className="text-sm text-muted-foreground" role="status">
      טוען שאלון התאמה…
    </p>
  );
}

export default function NeedsDiscoveryLeadFlowLazy({ defaultServiceId }: Props) {
  return (
    <Suspense fallback={<Fallback />}>
      <NeedsDiscoveryLeadFlow defaultServiceId={defaultServiceId} />
    </Suspense>
  );
}
