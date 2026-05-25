"use client";

import { useCallback, useState } from "react";
import { runLeadGuard, type ValidationResult } from "@/lib/form-validation";

export type UseLeadFormGuardOptions = {
  formId: string;
};

export function useLeadFormGuard({ formId }: UseLeadFormGuardOptions) {
  const [startedAtMs, setStartedAtMs] = useState(() => Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);

  const resetGuardClock = useCallback(() => {
    setStartedAtMs(Date.now());
  }, []);

  const attemptSubmit = useCallback(
    (
      validateFields: () => ValidationResult,
      onSuccess: (result: Extract<ValidationResult, { ok: true }>) => void,
    ): Record<string, string> | null => {
      const result = runLeadGuard({
        formId,
        startedAtMs,
        honeypot,
        validateFields,
      });

      if (!result.ok) {
        setGlobalError(result.global ?? null);
        return { ...result.errors };
      }

      setGlobalError(null);
      onSuccess(result);
      return null;
    },
    [formId, honeypot, startedAtMs],
  );

  return {
    honeypot,
    setHoneypot,
    globalError,
    setGlobalError,
    attemptSubmit,
    resetGuardClock,
  };
}
