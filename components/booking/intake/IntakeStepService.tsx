"use client";

import IntakeFilePicker from "@/components/booking/intake/IntakeFilePicker";
import FieldError from "@/components/forms/FieldError";
import {
  INTAKE_PRESETS,
  type ServiceTypeTag,
} from "@/lib/book-intake/presets";
import type { IntakeFileMeta } from "@/lib/book-intake/file-validation";
import { describedBy, fieldErrorId } from "@/lib/field-error";
import { cn } from "@/lib/utils";

type IntakeStepServiceProps = {
  serviceTypeTag: ServiceTypeTag | null;
  freeTextDescription: string;
  file: File | null;
  fileMeta: IntakeFileMeta | null;
  fileError: string | null;
  errors: Record<string, string>;
  descriptionPlaceholder: string;
  onPresetChange: (tag: ServiceTypeTag) => void;
  onFreeTextChange: (v: string) => void;
  onFileChange: (file: File | null, meta: IntakeFileMeta | null, error: string | null) => void;
  className?: string;
};

export default function IntakeStepService({
  serviceTypeTag,
  freeTextDescription,
  file,
  fileMeta,
  fileError,
  errors,
  descriptionPlaceholder,
  onPresetChange,
  onFreeTextChange,
  onFileChange,
  className,
}: IntakeStepServiceProps) {
  const showOptionalFields = Boolean(serviceTypeTag);
  const serviceErrorId = fieldErrorId("intake-service");
  const freeTextErrorId = fieldErrorId("intake-free-text");

  return (
    <div className={cn("space-y-6", className)}>
      <fieldset
        className="space-y-3"
        aria-describedby={describedBy(errors.serviceTypeTag && serviceErrorId)}
      >
        <legend className="text-sm font-semibold text-foreground">מה אתם צריכים?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {INTAKE_PRESETS.map((preset) => {
            const selected = serviceTypeTag === preset.tag;
            return (
              <label
                key={preset.tag}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center rounded-xl border px-4 py-3 text-sm font-medium transition-colors duration-200",
                  selected
                    ? "border-brand-red bg-brand-red/10 text-brand-red"
                    : "border-border bg-surface text-foreground hover:border-brand-red/40",
                )}
              >
                <input
                  type="radio"
                  name="intake-preset"
                  value={preset.tag}
                  checked={selected}
                  onChange={() => onPresetChange(preset.tag)}
                  className="sr-only"
                />
                {preset.label}
              </label>
            );
          })}
        </div>
        {/* שגיאת קבוצה: אין פקד אחד שמקבל פוקוס, לכן role="alert" נשאר והפוקוס
            לא זז (scrollAndHighlightFirstError מדלג על הודעה כזו) */}
        <FieldError
          id={serviceErrorId}
          message={errors.serviceTypeTag}
          className="mt-0"
          announce
        />
      </fieldset>

      {showOptionalFields ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <label htmlFor="intake-free-text" className="text-sm font-semibold text-foreground">
              פרטים נוספים (אופציונלי)
            </label>
            <textarea
              id="intake-free-text"
              value={freeTextDescription}
              onChange={(e) => onFreeTextChange(e.target.value)}
              maxLength={1500}
              rows={3}
              placeholder={descriptionPlaceholder}
              aria-invalid={errors.freeTextDescription ? true : undefined}
              aria-describedby={describedBy(errors.freeTextDescription && freeTextErrorId)}
              className="w-full min-h-12 resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            />
            <p className="text-xs text-muted-foreground text-start">
              {freeTextDescription.length}/1500
            </p>
            <FieldError
              id={freeTextErrorId}
              message={errors.freeTextDescription}
              className="mt-0"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">קובץ לדוגמה (אופציונלי)</p>
            <IntakeFilePicker
              file={file}
              fileMeta={fileMeta}
              fileError={fileError}
              onFileChange={onFileChange}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          בחרו סוג שירות כדי להוסיף פרטים או קובץ לדוגמה.
        </p>
      )}
    </div>
  );
}
