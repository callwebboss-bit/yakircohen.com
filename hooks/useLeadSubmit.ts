"use client";

import { useCallback, useState } from "react";
import {
  notifyLeadByEmailAsync,
  type LeadEmailPayload,
} from "@/lib/lead-email-notify";
import type { BookCategoryId } from "@/lib/book-url";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";

export type LeadSubmitIntent = "continue_chat" | "start_now";

export type LeadSubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | {
      status: "success";
      waHref: string;
      intent: LeadSubmitIntent;
    }
  | { status: "error"; message: string };

export function useLeadSubmit() {
  const [submit, setSubmit] = useState<LeadSubmitState>({ status: "idle" });

  const submitLead = useCallback(
    async (
      emailPayload: LeadEmailPayload,
      waHref: string,
      intent: LeadSubmitIntent = "continue_chat",
      options?: { leadCategory?: BookCategoryId },
    ) => {
      setSubmit({ status: "submitting" });
      openWhatsAppLead(
        waHref,
        options?.leadCategory ? { leadCategory: options.leadCategory } : undefined,
      );

      try {
        await notifyLeadByEmailAsync(emailPayload);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useLeadSubmit] email notify failed", err);
        }
      }

      setSubmit({ status: "success", waHref, intent });
    },
    [],
  );

  const resetSubmit = useCallback(() => {
    setSubmit({ status: "idle" });
  }, []);

  const isSubmitting = submit.status === "submitting";
  const isSuccess = submit.status === "success";

  return {
    submit,
    submitLead,
    resetSubmit,
    isSubmitting,
    isSuccess,
    successWaHref: submit.status === "success" ? submit.waHref : "",
    successIntent:
      submit.status === "success" ? submit.intent : ("continue_chat" as const),
  };
}
