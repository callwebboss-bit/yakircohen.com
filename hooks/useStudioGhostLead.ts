"use client";

import { useWizardGhostLead as useWizardGhostLeadBase } from "@/lib/book-wizard-cro/useWizardGhostLead";

export function useStudioGhostLead(opts: {
  step: number;
  name: string;
  phone: string;
  subject: string;
  body: string;
  enabled?: boolean;
  onFired?: () => void;
}) {
  useWizardGhostLeadBase({
    category: "studio",
    formId: "studio_recording_booking",
    closingStepIndex: 2,
    ...opts,
  });
}
