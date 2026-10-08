"use client";

import FieldError from "@/components/forms/FieldError";
import { describedBy, fieldErrorId } from "@/lib/field-error";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { normalizeIsraeliMobile } from "@/lib/form-validation";
import { cn } from "@/lib/utils";

export type PhoneInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  /** aria-required וכוכבית aria-hidden. לא `required` מקורי: הוא עוקף את הולידטורים המותאמים. */
  required?: boolean;
  className?: string;
};

/**
 * Phone input with real-time Israeli mobile validation.
 * Shows a green ✅ icon as soon as a valid 05X-XXXXXXX number is detected.
 */
export default function PhoneInputField({
  value,
  onChange,
  error,
  id = "phone",
  label = FORM_MICROCOPY.phoneLabel,
  placeholder = FORM_MICROCOPY.phonePlaceholder,
  hint = FORM_MICROCOPY.phoneHint,
  required = false,
  className,
}: PhoneInputFieldProps) {
  const isValid = Boolean(value.trim() && normalizeIsraeliMobile(value.trim()));
  const hintId = `${id}-hint`;
  const errorId = fieldErrorId(id);

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-[border-color,box-shadow] duration-fast ease-luxury",
            "focus:outline-none focus:ring-2 focus:ring-brand-red/20",
            isValid
              ? "border-green-500 pe-10 focus:border-green-500"
              : error
                ? "border-red-400 focus:border-red-400"
                : "border-input focus:border-brand-red",
          )}
          aria-invalid={!!error}
          aria-required={required ? "true" : undefined}
          aria-describedby={describedBy(hint && hintId, error && errorId)}
        />
        {isValid ? (
          <span
            className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-base leading-none"
            aria-hidden="true"
          >
            ✅
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {/* בלי role="alert": scrollAndHighlightFirstError מעביר פוקוס לשדה והשגיאה
          מוקראת דרך aria-describedby, ו-alert נוסף היה מקריא אותה פעמיים (F-11) */}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
