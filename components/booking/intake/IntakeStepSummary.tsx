"use client";

import BookingApprovals from "@/components/booking/BookingApprovals";
import Button from "@/components/ui/Button";
import { getPresetByTag, type ServiceTypeTag } from "@/lib/book-intake/presets";
import { formatFileSizeMb } from "@/lib/book-intake/file-validation";
import type { IntakeFileMeta } from "@/lib/book-intake/file-validation";
import {
  FORCE_MAJEURE_REASSURANCE,
  HESITATION_CTA,
  OUTCOME_CTA,
} from "@/lib/data/conversion-copy";
import CtaOutcomeSubline from "@/components/marketing/CtaOutcomeSubline";
import { cn } from "@/lib/utils";

type IntakeStepSummaryProps = {
  name: string;
  phone: string;
  email: string;
  serviceTypeTag: ServiceTypeTag;
  freeTextDescription: string;
  fileMeta: IntakeFileMeta | null;
  termsAccepted: boolean;
  termsError?: string;
  isSubmitting: boolean;
  onTermsChange: (accepted: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  className?: string;
};

export default function IntakeStepSummary({
  name,
  phone,
  email,
  serviceTypeTag,
  freeTextDescription,
  fileMeta,
  termsAccepted,
  termsError,
  isSubmitting,
  onTermsChange,
  onSubmit,
  onBack,
  className,
}: IntakeStepSummaryProps) {
  const preset = getPresetByTag(serviceTypeTag);

  return (
    <div className={cn("space-y-6", className)}>
      <dl className="space-y-3 rounded-xl border border-border bg-surface p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">שם</dt>
          <dd className="font-medium text-foreground text-end">{name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">טלפון</dt>
          <dd className="font-medium text-foreground" dir="ltr">
            {phone}
          </dd>
        </div>
        {email.trim() ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">אימייל</dt>
            <dd className="font-medium text-foreground" dir="ltr">
              {email}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">שירות</dt>
          <dd className="font-medium text-foreground text-end">{preset.label}</dd>
        </div>
        {freeTextDescription.trim() ? (
          <div>
            <dt className="text-muted-foreground">פרטים</dt>
            <dd className="mt-1 text-foreground">{freeTextDescription}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">קובץ</dt>
          <dd className="font-medium text-foreground text-end">
            {fileMeta
              ? `${fileMeta.name} (${formatFileSizeMb(fileMeta.size_bytes)})`
              : "ללא קובץ"}
          </dd>
        </div>
      </dl>

      <BookingApprovals
        variant="light"
        termsAccepted={termsAccepted}
        onTermsChange={onTermsChange}
        termsError={termsError}
      />

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {FORCE_MAJEURE_REASSURANCE}
      </p>

      <p className="text-center text-sm font-medium text-foreground">
        {HESITATION_CTA}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button
          type="button"
          variant="primary"
          className="min-h-12 w-full flex-1 text-base"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          📩 {OUTCOME_CTA.quote24h}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="min-h-12 w-full sm:w-auto"
          disabled={isSubmitting}
          onClick={onBack}
        >
          חזרה
        </Button>
      </div>

      <CtaOutcomeSubline />

      <div className="space-y-1 text-center text-xs leading-relaxed text-muted-foreground">
        <p>✅ אין עלויות מוסתרות - המחיר הסופי ייקבע רק אחרי שאבחן ואאשר איתך.</p>
        <p>🔒 הקובץ שלך מאובטח ולא יועלה לאתרים חיצוניים.</p>
      </div>
    </div>
  );
}
