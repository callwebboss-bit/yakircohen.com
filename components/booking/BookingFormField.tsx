"use client";

import { bookFieldClass } from "@/lib/book-form-ui";
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
}: BookingFormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold">
        {label}
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
          aria-describedby={error ? errorId : undefined}
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
          aria-describedby={error ? errorId : undefined}
          className={cn(bookFieldClass, error && "border-red-400")}
        />
      )}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-red-500" data-field-error="">
          {error}
        </p>
      ) : null}
    </div>
  );
}
