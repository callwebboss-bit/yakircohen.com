"use client";

import { useEffect, useRef } from "react";
import { notifyLeadByEmailAsync } from "@/lib/lead-email-notify";
import { validateBookingLead } from "@/lib/form-validation";

const SESSION_KEY = "yc_studio_ghost_lead_sent";

export function useStudioGhostLead(opts: {
  step: number;
  name: string;
  phone: string;
  subject: string;
  body: string;
  enabled?: boolean;
}) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (opts.enabled === false) return;
    if (opts.step < 2 || sentRef.current) return;

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

    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      sentRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      void notifyLeadByEmailAsync({
        formId: "studio_recording_booking",
        subject: opts.subject,
        body: `${opts.body}\n\n[partial: שלב 3 — לא נשלח לוואטסאפ]`,
        name: opts.name,
        phone: validation.normalizedPhone ?? opts.phone,
      })
        .then(() => {
          sentRef.current = true;
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* ignore */
          }
        })
        .catch(() => {
          /* silent */
        });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [opts.step, opts.name, opts.phone, opts.subject, opts.body, opts.enabled]);
}
