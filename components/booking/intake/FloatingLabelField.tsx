"use client";

import { useId, type Ref } from "react";
import FieldError from "@/components/forms/FieldError";
import {
  describedBy,
  fieldErrorId,
  splitRequiredLabel,
} from "@/lib/field-error";
import { cn } from "@/lib/utils";

type FloatingLabelFieldProps = {
  id?: string;
  label: string;
  type?: "text" | "email" | "tel";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** משפט קצר מתחת לשדה - למה צריך אותו */
  hint?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  dir?: "rtl" | "ltr";
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
  /**
   * שדה חובה: aria-required וכוכבית aria-hidden. לא `required` מקורי, הוא עוקף
   * את הולידטורים המותאמים (F-45). בלי הפרמטר, " *" בסוף התווית מזוהה כחובה.
   */
  required?: boolean;
};

export default function FloatingLabelField({
  id: idProp,
  label,
  type = "text",
  value,
  onChange,
  error,
  hint,
  autoComplete,
  inputMode,
  dir = "rtl",
  className,
  inputRef,
  required,
}: FloatingLabelFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const errorId = fieldErrorId(id);
  const hintId = `${id}-hint`;
  const filled = value.trim().length > 0;
  const { text: labelText, required: labelRequired } =
    splitRequiredLabel(label);
  const isRequired = required ?? labelRequired;

  return (
    <div className={className}>
      {/* F-11 (7.10.2026): התווית absolute ביחס לשדה בלבד. הרמז והשגיאה יושבים מחוץ
          למעטפת ה-relative, אחרת הגובה שלהם דחף את התווית אל מחוץ לשדה כשהשגיאה והרמז
          מוצגים יחד. */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          dir={dir}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-required={isRequired ? "true" : undefined}
          aria-describedby={describedBy(hint && hintId, error && errorId)}
          className={cn(
            "peer w-full min-h-12 rounded-xl border bg-background px-4 pt-5 pb-2 text-sm text-foreground",
            "border-input focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
            error && "border-brand-red/60",
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute start-4 text-muted-foreground transition-all duration-200",
            "peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-red",
            filled ? "top-1.5 text-xs" : "top-1/2 -translate-y-1/2 text-sm",
          )}
        >
          {labelText}
          {isRequired ? <span aria-hidden="true"> *</span> : null}
        </label>
      </div>
      {/* הרמז נשאר ב-DOM גם כשיש שגיאה, כדי שלא ייעלם מה-aria-describedby. בלי
          role="alert": scrollAndHighlightFirstError מעביר פוקוס לשדה, והשגיאה
          מוקראת משם, אחרת היא הייתה מוקראת פעמיים (F-11) */}
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} className="mt-1.5" />
    </div>
  );
}
