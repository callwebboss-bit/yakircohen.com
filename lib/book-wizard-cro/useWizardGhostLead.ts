"use client";

import { useEffect, useRef } from "react";
import { notifyLeadByEmailAsync } from "@/lib/lead-email-notify";
import { validateBookingLead } from "@/lib/form-validation";
import type { TierACategoryId } from "@/lib/book-wizard-cro/types";

function sessionKey(category: TierACategoryId): string {
  return `yc_${category}_ghost_lead_sent`;
}

export function useWizardGhostLead(opts: {
  category: TierACategoryId;
  formId: string;
  step: number;
  closingStepIndex: number;
  name: string;
  phone: string;
  subject: string;
  body: string;
  enabled?: boolean;
  onFired?: () => void;
}) {
  const sentRef = useRef(false);
  const onFiredRef = useRef(opts.onFired);

  useEffect(() => {
    onFiredRef.current = opts.onFired;
  }, [opts.onFired]);

  useEffect(() => {
    if (opts.enabled === false) return;
    if (opts.step < opts.closingStepIndex || sentRef.current) return;

    const validation = validateBookingLead({
      name: opts.name,
      phone: opts.phone,
      date: "",
      time: "",
      location: "",
      notes: "",
      requireLocation: false,
      requireDate: false,
      requireTime: false,
    });
    if (!validation.ok) return;

    const storageKey = sessionKey(opts.category);
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(storageKey)) {
      sentRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      if (sentRef.current) return;
      const phone = validation.normalizedPhone ?? opts.phone;
      void notifyLeadByEmailAsync({
        formId: opts.formId,
        subject: opts.subject,
        body: `${opts.body}\n\n[partial: שלב סגירה - לא נשלח לוואטסאפ]`,
        name: opts.name,
        phone,
      })
        .then(() => {
          sentRef.current = true;
          try {
            sessionStorage.setItem(storageKey, "1");
          } catch {
            /* ignore */
          }
          onFiredRef.current?.();
        })
        .catch(() => {
          /* silent */
        });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [
    opts.category,
    opts.formId,
    opts.step,
    opts.closingStepIndex,
    opts.name,
    opts.phone,
    opts.subject,
    opts.body,
    opts.enabled,
  ]);
}
