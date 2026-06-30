"use client";

import type { CroReassurance } from "@/lib/book-wizard-cro/types";

export function WizardReassuranceBadge({ reassurance }: { reassurance: CroReassurance }) {
  return (
    <div
      className="min-h-[72px] rounded-xl border border-sky-300/80 bg-sky-50 px-4 py-3 transition-all duration-300"
      role="status"
    >
      <p className="text-sm font-semibold text-sky-950">{reassurance.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-sky-900">{reassurance.body}</p>
    </div>
  );
}
