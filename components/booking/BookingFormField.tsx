"use client";

import FieldError from "@/components/forms/FieldError";
import { bookFieldClass } from "@/lib/book-form-ui";
import { describedBy, fieldErrorId, splitRequiredLabel } from "@/lib/field-error";
import { cn } from "@/lib/utils";

type BookingFormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  min?: string;
  multiline?: boolean;
  autoComplete?: string;
  placeholder?: string;
  /**
   * שדה חובה: aria-required וכוכבית aria-hidden. לא `required` מקורי, הוא עוקף
   * את הולידטורים המותאמים (F-45). בלי הפרמטר, " *" בסוף התווית מזוהה כחובה.
   */
  required?: boolean;
};

export default function BookingFormField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  min,
  multiline,
  autoComplete,
  placeholder,
  required,
}: BookingFormFieldProps) {
  const errorId = fieldErrorId(id);
  /* הקוראים הקיימים מוסיפים " *" לטקסט התווית. כאן הכוכבית יוצאת מהשם הנגיש */
  const { text: labelText, required: labelRequired } = splitRequiredLabel(label);
  const isRequired = required ?? labelRequired;
  const describedByError = describedBy(error && errorId);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold">
        {labelText}
        {isRequired ? <span aria-hidden="true"> *</span> : null}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete ?? "off"}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-required={isRequired ? "true" : undefined}
          aria-describedby={describedByError}
          className={cn(bookFieldClass, "resize-none", error && "border-red-400")}
        />
      ) : (
        <input
          id={id}
          type={type}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-required={isRequired ? "true" : undefined}
          aria-describedby={describedByError}
          className={cn(bookFieldClass, error && "border-red-400")}
        />
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
