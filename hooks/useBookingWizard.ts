"use client";

import { useCallback, useMemo, useReducer } from "react";
import { useBookingDraft } from "@/hooks/useBookingDraft";
import { isRecord } from "@/lib/wizard-draft-parse";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import type { LeadSubmitIntent, LeadSubmitState } from "@/hooks/useLeadSubmit";
import type { LeadEmailPayload } from "@/lib/lead-email-notify";
import type { ValidationResult } from "@/lib/form-validation";
import { notifyLeadByEmailAsync } from "@/lib/lead-email-notify";
import type { BookCategoryId } from "@/lib/book-url";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { clearBookCoreContact } from "@/lib/book-wizard-cro/shared-contact";

export type BookingWizardState<TForm> = {
  step: number;
  form: TForm;
  errors: Record<string, string>;
  submit: LeadSubmitState;
  koalendarOpen: boolean;
  draftDismissed: boolean;
};

export type BookingWizardAction<TForm> =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_FORM"; form: TForm }
  | { type: "PATCH_FORM"; patch: Partial<TForm> }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "SET_SUBMIT"; submit: LeadSubmitState }
  | { type: "RESTORE_DRAFT"; form: TForm }
  | { type: "DISMISS_DRAFT" }
  | { type: "OPEN_KOALENDAR"; open: boolean }
  | { type: "TOGGLE_UPSELL"; id: string }
  | { type: "TOGGLE_UPGRADE"; id: string };

export function createBookingWizardReducer<
  TForm extends { selectedUpsells?: string[]; selectedUpgrades?: string[] },
>(
  initialForm: TForm,
) {
  return function bookingWizardReducer(
    state: BookingWizardState<TForm>,
    action: BookingWizardAction<TForm>,
  ): BookingWizardState<TForm> {
    switch (action.type) {
      case "SET_STEP":
        return { ...state, step: action.step };
      case "SET_FORM":
        return { ...state, form: action.form };
      case "PATCH_FORM":
        return { ...state, form: { ...state.form, ...action.patch } };
      case "SET_ERRORS":
        return { ...state, errors: action.errors };
      case "SET_SUBMIT":
        return { ...state, submit: action.submit };
      case "RESTORE_DRAFT":
        return { ...state, form: action.form };
      case "DISMISS_DRAFT":
        return { ...state, draftDismissed: true };
      case "OPEN_KOALENDAR":
        return { ...state, koalendarOpen: action.open };
      case "TOGGLE_UPSELL": {
        const upsells = state.form.selectedUpsells ?? [];
        const has = upsells.includes(action.id);
        return {
          ...state,
          form: {
            ...state.form,
            selectedUpsells: has
              ? upsells.filter((x) => x !== action.id)
              : [...upsells, action.id],
          },
        };
      }
      case "TOGGLE_UPGRADE": {
        const upgrades = state.form.selectedUpgrades ?? [];
        const has = upgrades.includes(action.id);
        return {
          ...state,
          form: {
            ...state.form,
            selectedUpgrades: has
              ? upgrades.filter((x) => x !== action.id)
              : [...upgrades, action.id],
          },
        };
      }
      default:
        return state;
    }
  };
}

export type WizardConfig<TForm> = {
  storageKey: string;
  formId: string;
  initialForm: TForm;
  parseDraft: (raw: unknown) => TForm | null;
  serializeDraft?: (form: TForm) => unknown;
  /** Persist wizard step in localStorage draft envelope */
  persistStepInDraft?: boolean;
  maxStep?: number;
};

export function useBookingWizard<
  TForm extends { selectedUpsells?: string[]; selectedUpgrades?: string[] },
>(config: WizardConfig<TForm>) {
  const reducer = useMemo(
    () => createBookingWizardReducer(config.initialForm),
    [config.initialForm],
  );

  const [state, dispatch] = useReducer(reducer, {
    step: 0,
    form: config.initialForm,
    errors: {},
    submit: { status: "idle" },
    koalendarOpen: false,
    draftDismissed: false,
  });

  const replaceForm = useCallback(
    (form: TForm) => dispatch({ type: "SET_FORM", form }),
    [],
  );

  const serializeDraft = config.serializeDraft ?? ((f: TForm) => f);

  const draftWatchState = config.persistStepInDraft
    ? ({ ...state.form, step: state.step } as TForm & { step: number })
    : state.form;

  const deserializeForDraft = useCallback(
    (raw: unknown): TForm | null => {
      const form = config.parseDraft(raw);
      if (form == null) return null;
      if (!config.persistStepInDraft) return form;
      const step =
        isRecord(raw) && typeof raw.step === "number" ? raw.step : 0;
      return { ...form, step } as TForm;
    },
    [config.parseDraft, config.persistStepInDraft],
  );

  const applyDraftFromStorage = useCallback(
    (value: TForm) => {
      const envelope = value as TForm & { step?: number };
      if (
        config.persistStepInDraft &&
        isRecord(envelope) &&
        typeof envelope.step === "number"
      ) {
        const { step, ...formFields } = envelope as TForm & { step: number };
        const form =
          config.parseDraft(value) ?? (formFields as unknown as TForm);
        dispatch({ type: "SET_FORM", form });
        dispatch({
          type: "SET_STEP",
          step: Math.min(Math.max(0, step), config.maxStep ?? 99),
        });
      } else {
        dispatch({ type: "SET_FORM", form: value });
      }
    },
    [config.parseDraft, config.persistStepInDraft, config.maxStep],
  );

  const draft = useBookingDraft(
    config.storageKey,
    draftWatchState as TForm,
    applyDraftFromStorage,
    config.persistStepInDraft ? (s) => s : serializeDraft,
    deserializeForDraft,
  );

  const guard = useLeadFormGuard({ formId: config.formId });

  const setStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const patchForm = useCallback((patch: Partial<TForm>) => {
    dispatch({ type: "PATCH_FORM", patch });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: "SET_ERRORS", errors });
  }, []);

  const mergeErrors = useCallback(
    (patch: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => {
      dispatch({
        type: "SET_ERRORS",
        errors:
          typeof patch === "function"
            ? patch(state.errors)
            : { ...state.errors, ...patch },
      });
    },
    [state.errors],
  );

  const toggleUpsell = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_UPSELL", id });
  }, []);

  const toggleUpgrade = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_UPGRADE", id });
  }, []);

  const dismissDraft = useCallback(() => {
    dispatch({ type: "DISMISS_DRAFT" });
    draft.dismissRestored();
  }, [draft]);

  const selectedUpsellSet = useMemo(
    () => new Set(state.form.selectedUpsells ?? []),
    [state.form.selectedUpsells],
  );

  const runSubmit = useCallback(
    (
      validateFields: () => ValidationResult,
      buildResult: (result: Extract<ValidationResult, { ok: true }>) => {
        waHref: string;
        email: LeadEmailPayload;
        intent?: LeadSubmitIntent;
      },
      options?: { leadCategory?: BookCategoryId },
    ): Record<string, string> | null => {
      const fieldErrs = guard.attemptSubmit(validateFields, (result) => {
        const { waHref, email, intent = "continue_chat" } = buildResult(result);
        dispatch({
          type: "SET_SUBMIT",
          submit: { status: "success", waHref, intent },
        });
        draft.clear();
        clearBookCoreContact();
        openWhatsAppLead(
          waHref,
          options?.leadCategory ? { leadCategory: options.leadCategory } : undefined,
        );
        void notifyLeadByEmailAsync({
          ...email,
          website_verification: guard.honeypot,
        }).catch((err) => {
          if (process.env.NODE_ENV !== "production") {
            console.warn("[useBookingWizard] email notify failed", err);
          }
        });
      });

      if (fieldErrs) {
        dispatch({ type: "SET_ERRORS", errors: fieldErrs });
        return fieldErrs;
      }
      return null;
    },
    [guard, draft],
  );

  const isSubmitted = state.submit.status === "success";
  const lastWaHref =
    state.submit.status === "success" ? state.submit.waHref : "";
  const lastIntent =
    state.submit.status === "success" ? state.submit.intent : "continue_chat";
  const isSubmitting = state.submit.status === "submitting";

  const setKoalendarOpen = useCallback((open: boolean) => {
    dispatch({ type: "OPEN_KOALENDAR", open });
  }, []);

  const resetWizard = useCallback(() => {
    draft.clear();
    guard.setHoneypot("");
    guard.resetGuardClock();
    guard.setGlobalError(null);
    dispatch({ type: "SET_FORM", form: config.initialForm });
    dispatch({ type: "SET_STEP", step: 0 });
    dispatch({ type: "SET_ERRORS", errors: {} });
    dispatch({ type: "SET_SUBMIT", submit: { status: "idle" } });
    dispatch({ type: "DISMISS_DRAFT" });
  }, [config.initialForm, draft, guard]);

  const selectedUpgradeSet = useMemo(
    () => new Set(state.form.selectedUpgrades ?? []),
    [state.form.selectedUpgrades],
  );

  return {
    ...state,
    dispatch,
    setStep,
    patchForm,
    replaceForm,
    setErrors,
    mergeErrors,
    toggleUpsell,
    toggleUpgrade,
    selectedUpsellSet,
    selectedUpgradeSet,
    setKoalendarOpen,
    draft,
    guard,
    dismissDraft,
    runSubmit,
    resetWizard,
    isSubmitted,
    lastWaHref,
    lastIntent,
    isSubmitting,
  };
}
