"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import { BOOK_INTAKE_FOCUS_EVENT } from "@/components/booking/BookIntakeCustomCard";
import BookIntakeLogoSpinner from "@/components/booking/intake/BookIntakeLogoSpinner";
import IntakeStepContact from "@/components/booking/intake/IntakeStepContact";
import IntakeStepService from "@/components/booking/intake/IntakeStepService";
import IntakeStepSummary from "@/components/booking/intake/IntakeStepSummary";
import IntakeStepper from "@/components/booking/intake/IntakeStepper";
import WizardProgressBar from "@/components/booking/WizardProgressBar";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import Button from "@/components/ui/Button";
import { useBookIntakeStepMeta } from "@/hooks/useBookIntakeStepMeta";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  buildIntakeWhatsAppHref,
  buildPayload,
} from "@/lib/book-intake/build-payload";
import type { IntakeFileMeta } from "@/lib/book-intake/file-validation";
import {
  clearIntakeDraft,
  readIntakeDraft,
  readIntakeKnownContact,
  saveIntakeDraft,
  saveIntakeKnownContact,
} from "@/lib/book-intake/local-storage";
import {
  readIntakeRouteHint,
  resolveIntakePlaceholder,
} from "@/lib/book-intake/placeholders";
import type { ServiceTypeTag } from "@/lib/book-intake/presets";
import {
  validateEmailOptional,
  validateIsraeliMobile,
  validatePersonName,
} from "@/lib/form-validation";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { scrollAndHighlightFirstError } from "@/lib/scroll-to-error";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 3;
const DRAFT_DEBOUNCE_MS = 800;

export default function BookUniversalIntakeWizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceTypeTag, setServiceTypeTag] = useState<ServiceTypeTag | null>(null);
  const [freeTextDescription, setFreeTextDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileMeta, setFileMeta] = useState<IntakeFileMeta | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successWaHref, setSuccessWaHref] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [returningName, setReturningName] = useState<string | null>(null);
  const [draftSavedVisible, setDraftSavedVisible] = useState(false);
  const [routeHint, setRouteHint] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useBookIntakeStepMeta(step);

  const guard = useLeadFormGuard({ formId: "book_intake_wizard" });
  const { honeypot, setHoneypot, globalError, attemptSubmit } = guard;

  const descriptionPlaceholder = resolveIntakePlaceholder(serviceTypeTag, routeHint);

  useEffect(() => {
    const known = readIntakeKnownContact();
    const draft = readIntakeDraft();
    const hint = readIntakeRouteHint();
    setRouteHint(hint);

    if (known) {
      setName(known.name);
      setPhone(known.phone);
      setEmail(known.email);
      setReturningName(known.name);
    } else if (draft) {
      setName(draft.name);
      setPhone(draft.phone);
      setEmail(draft.email);
    }

    if (draft) {
      if (draft.serviceTypeTag) {
        setServiceTypeTag(draft.serviceTypeTag as ServiceTypeTag);
      }
      setFreeTextDescription(draft.freeTextDescription);
      if (draft.step > 0 && draft.step < TOTAL_STEPS) {
        setStep(draft.step);
      }
    }
  }, []);

  useEffect(() => {
    const focusFirstField = () => {
      nameInputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener(BOOK_INTAKE_FOCUS_EVENT, focusFirstField);
    return () => window.removeEventListener(BOOK_INTAKE_FOCUS_EVENT, focusFirstField);
  }, []);

  useEffect(() => {
    if (isSuccess) return;

    if (draftTimerRef.current) {
      clearTimeout(draftTimerRef.current);
    }

    draftTimerRef.current = setTimeout(() => {
      const hasContent =
        name.trim() ||
        phone.trim() ||
        email.trim() ||
        serviceTypeTag ||
        freeTextDescription.trim();

      if (!hasContent) return;

      saveIntakeDraft({
        name,
        phone,
        email,
        serviceTypeTag,
        freeTextDescription,
        step,
      });

      setDraftSavedVisible(true);
      if (draftHideTimerRef.current) {
        clearTimeout(draftHideTimerRef.current);
      }
      draftHideTimerRef.current = setTimeout(() => {
        setDraftSavedVisible(false);
      }, 3000);
    }, DRAFT_DEBOUNCE_MS);

    return () => {
      if (draftTimerRef.current) {
        clearTimeout(draftTimerRef.current);
      }
    };
  }, [name, phone, email, serviceTypeTag, freeTextDescription, step, isSuccess]);

  const goToStep = useCallback((next: number) => {
    startTransition(() => {
      setStep(next);
      setErrors({});
    });
  }, []);

  const validateStep1 = useCallback((): Record<string, string> | null => {
    const nextErrors: Record<string, string> = {};
    const nameR = validatePersonName(name);
    const phoneR = validateIsraeliMobile(phone);
    const emailR = validateEmailOptional(email);

    if (!nameR.ok) Object.assign(nextErrors, nameR.errors);
    if (!phoneR.ok) Object.assign(nextErrors, phoneR.errors);
    if (!emailR.ok) Object.assign(nextErrors, emailR.errors);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      scrollAndHighlightFirstError();
      return nextErrors;
    }
    return null;
  }, [name, phone, email]);

  const validateStep2 = useCallback((): Record<string, string> | null => {
    const nextErrors: Record<string, string> = {};
    if (!serviceTypeTag) {
      nextErrors.serviceTypeTag = "נא לבחור סוג שירות";
    }
    if (freeTextDescription.length > 1500) {
      nextErrors.freeTextDescription = "הטקסט ארוך מדי (מקסימום 1500 תווים)";
    }
    if (fileError) {
      nextErrors.file = fileError;
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      scrollAndHighlightFirstError();
      return nextErrors;
    }
    return null;
  }, [serviceTypeTag, freeTextDescription, fileError]);

  const handleNextFromStep1 = () => {
    if (validateStep1()) return;
    goToStep(1);
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) return;
    goToStep(2);
  };

  const resetWizard = useCallback(() => {
    setStep(0);
    setServiceTypeTag(null);
    setFreeTextDescription("");
    setFile(null);
    setFileMeta(null);
    setFileError(null);
    setTermsAccepted(false);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setSuccessWaHref("");
    setDraftSavedVisible(false);
    guard.resetGuardClock();
  }, [guard]);

  const handleSubmit = () => {
    if (!serviceTypeTag) return;

    const fieldErrors = attemptSubmit(
      () => {
        const step1 = validateStep1();
        if (step1) return { ok: false as const, errors: step1 };
        const step2 = validateStep2();
        if (step2) return { ok: false as const, errors: step2 };
        if (!termsAccepted) {
          return {
            ok: false as const,
            errors: { termsAccepted: "נא לאשר את תנאי השימוש" },
          };
        }
        return { ok: true as const };
      },
      async () => {
        setIsSubmitting(true);
        const payload = buildPayload({
          name,
          phone,
          email,
          serviceTypeTag,
          freeTextDescription,
          fileMeta: fileMeta ?? undefined,
        });
        const waHref = buildIntakeWhatsAppHref(payload);

        try {
          await fetch("/api/lead-intake", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              website_verification: honeypot,
            }),
          });
        } catch {
          /* WA still opens */
        }

        openWhatsAppLead(waHref);
        saveIntakeKnownContact({ name, phone, email });
        clearIntakeDraft();
        setSuccessWaHref(waHref);
        setIsSuccess(true);
        setIsSubmitting(false);
      },
    );

    if (fieldErrors) {
      setErrors(fieldErrors);
      scrollAndHighlightFirstError();
    }
  };

  const handleFileChange = (
    nextFile: File | null,
    meta: IntakeFileMeta | null,
    error: string | null,
  ) => {
    setFile(nextFile);
    setFileMeta(meta);
    setFileError(error);
    if (error) {
      setErrors((prev) => ({ ...prev, file: error }));
    } else {
      setErrors((prev) => {
        const { file: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  if (isSuccess && successWaHref) {
    return (
      <BookingSuccessPanel
        whatsappHref={successWaHref}
        onNewBooking={resetWizard}
        intent="continue_chat"
      />
    );
  }

  const stepLabels = ["פרטי קשר", "צורך וקובץ", "סיכום ושליחה"];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8",
        isPending && "opacity-90",
      )}
    >
      <HoneypotField value={honeypot} onChange={setHoneypot} />

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground lg:hidden">שלב {step + 1} מתוך {TOTAL_STEPS}</p>
        {draftSavedVisible ? (
          <p
            className="text-xs text-muted-foreground/60"
            role="status"
            aria-live="polite"
          >
            הטקסט נשמר אוטומטית
          </p>
        ) : (
          <span className="hidden lg:block" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="hidden shrink-0 lg:block lg:w-44 xl:w-52">
          <IntakeStepper currentStep={step} orientation="vertical" />
        </aside>

        <div className="min-w-0 flex-1">
          <IntakeStepper currentStep={step} className="mb-4 lg:hidden" />
          <WizardProgressBar currentStep={step} totalSteps={TOTAL_STEPS} className="mb-6" />

          <LeadFormAlert message={globalError} className="mb-4" />

          {isSubmitting ? (
            <BookIntakeLogoSpinner />
          ) : (
            <BookingStepPanel
              stepKey={step}
              stepLabel={stepLabels[step]}
              className="duration-200"
            >
              {step === 0 ? (
                <>
                  <IntakeStepContact
                    name={name}
                    phone={phone}
                    email={email}
                    errors={errors}
                    returningName={returningName}
                    onNameChange={setName}
                    onPhoneChange={setPhone}
                    onEmailChange={setEmail}
                    nameInputRef={nameInputRef}
                  />
                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      className="min-h-12 w-full sm:w-auto"
                      onClick={handleNextFromStep1}
                    >
                      המשך
                    </Button>
                  </div>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <IntakeStepService
                    serviceTypeTag={serviceTypeTag}
                    freeTextDescription={freeTextDescription}
                    file={file}
                    fileMeta={fileMeta}
                    fileError={fileError}
                    errors={errors}
                    descriptionPlaceholder={descriptionPlaceholder}
                    onPresetChange={setServiceTypeTag}
                    onFreeTextChange={setFreeTextDescription}
                    onFileChange={handleFileChange}
                  />
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
                    <Button
                      type="button"
                      variant="primary"
                      className="min-h-12 w-full sm:flex-1"
                      onClick={handleNextFromStep2}
                    >
                      המשך לסיכום
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="min-h-12 w-full sm:w-auto"
                      onClick={() => goToStep(0)}
                    >
                      חזרה
                    </Button>
                  </div>
                </>
              ) : null}

              {step === 2 && serviceTypeTag ? (
                <IntakeStepSummary
                  name={name}
                  phone={phone}
                  email={email}
                  serviceTypeTag={serviceTypeTag}
                  freeTextDescription={freeTextDescription}
                  fileMeta={fileMeta}
                  termsAccepted={termsAccepted}
                  termsError={errors.termsAccepted}
                  isSubmitting={isSubmitting}
                  onTermsChange={setTermsAccepted}
                  onSubmit={handleSubmit}
                  onBack={() => goToStep(1)}
                />
              ) : null}
            </BookingStepPanel>
          )}
        </div>
      </div>
    </div>
  );
}
