"use client";

import { useCallback, useRef, useState } from "react";
import {
  attachLeadCode,
  createSubmissionId,
  submitLeadToServer,
  type LeadEmailPayload,
  type LeadSubmitFailReason,
} from "@/lib/lead-email-notify";
import type { BookCategoryId } from "@/lib/book-url";
import { contactChannelForWhatsAppMode } from "@/lib/leads/contact-channel";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";

export type LeadSubmitIntent = "continue_chat" | "start_now";

/**
 * "auto": וואטסאפ נפתח מיד בלחיצה (לפני ה-await, כדי שחוסם חלונות לא יעצור).
 * "button": לא נפתח אוטומטית; מסך ההצלחה מציג קישור שהגולש לוחץ עליו.
 * "none": בלי וואטסאפ בכלל (למשל "נחזור אליכם").
 */
export type LeadWhatsAppMode = "auto" | "button" | "none";

/**
 * success רק אחרי 200 מהשרת, כלומר אחרי שהבעלים קיבל את הליד. failed מציג
 * את LeadSubmitFallback עם וואטסאפ, טלפון וניסיון חוזר (LF-02).
 */
export type LeadSubmitState =
  | { status: "idle" }
  | {
      status: "submitting";
      /** ניסיון חוזר אחרי כשל: מסך הגיבוי נשאר מוצג עם הקישור עד שיש תשובה */
      retry?: { waHref: string; intent: LeadSubmitIntent };
    }
  | {
      status: "success";
      waHref: string;
      intent: LeadSubmitIntent;
    }
  | {
      status: "failed";
      waHref: string;
      intent: LeadSubmitIntent;
      reason: LeadSubmitFailReason;
    };

type LastSubmit = {
  payload: LeadEmailPayload;
  waHref: string;
  intent: LeadSubmitIntent;
};

export function useLeadSubmit() {
  const [submit, setSubmit] = useState<LeadSubmitState>({ status: "idle" });
  const lastRef = useRef<LastSubmit | null>(null);
  const inFlightRef = useRef(false);

  const post = useCallback(async (last: LastSubmit): Promise<boolean> => {
    inFlightRef.current = true;
    setSubmit({ status: "submitting" });
    const result = await submitLeadToServer(last.payload);
    inFlightRef.current = false;
    if (result.ok) {
      setSubmit({ status: "success", waHref: last.waHref, intent: last.intent });
      return true;
    }
    setSubmit({
      status: "failed",
      waHref: last.waHref,
      intent: last.intent,
      reason: result.reason,
    });
    return false;
  }, []);

  const submitLead = useCallback(
    async (
      emailPayload: LeadEmailPayload,
      waHref: string,
      intent: LeadSubmitIntent = "continue_chat",
      options?: { leadCategory?: BookCategoryId; whatsapp?: LeadWhatsAppMode },
    ): Promise<boolean> => {
      if (inFlightRef.current) return false;
      const mode = options?.whatsapp ?? "auto";
      /* אותו קוד פנייה במייל לבעלים ובהודעה שהלקוח שולח (D67). ניסיון חוזר
         משתמש ב-lastRef, ולכן הקוד לא משתנה בו */
      const coded = attachLeadCode(emailPayload, waHref);
      if (mode === "auto") {
        openWhatsAppLead(
          coded.waHref,
          options?.leadCategory ? { leadCategory: options.leadCategory } : undefined,
        );
      }
      const last: LastSubmit = {
        payload: {
          ...coded.payload,
          submissionId: emailPayload.submissionId ?? createSubmissionId(),
          /* הטופס יכול להצהיר בעצמו. אחרת לפי מצב הוואטסאפ, לא לפי formId */
          contactChannel:
            emailPayload.contactChannel ?? contactChannelForWhatsAppMode(mode),
        },
        waHref: coded.waHref,
        intent,
      };
      lastRef.current = last;
      return post(last);
    },
    [post],
  );

  /** אותו מזהה שליחה, בלי runLeadGuard: ניסיון חוזר לא נספר במגבלת 4 בשעה. */
  const retry = useCallback(async (): Promise<boolean> => {
    const last = lastRef.current;
    if (!last || inFlightRef.current) return false;
    return post(last);
  }, [post]);

  const resetSubmit = useCallback(() => {
    lastRef.current = null;
    setSubmit({ status: "idle" });
  }, []);

  const isSubmitting = submit.status === "submitting";
  const isSuccess = submit.status === "success";
  const isFailed = submit.status === "failed";

  return {
    submit,
    submitLead,
    retry,
    resetSubmit,
    isSubmitting,
    isSuccess,
    isFailed,
    failedWaHref: submit.status === "failed" ? submit.waHref : "",
    successWaHref: submit.status === "success" ? submit.waHref : "",
    successIntent:
      submit.status === "success" ? submit.intent : ("continue_chat" as const),
  };
}
