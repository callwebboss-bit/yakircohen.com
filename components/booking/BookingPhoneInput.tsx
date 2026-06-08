"use client";

import { useId } from "react";
import { bookFieldClass } from "@/lib/book-form-ui";
import {
  maskIsraeliPhoneInput,
  validateIsraeliMobile,
} from "@/lib/form-validation";
import { cn } from "@/lib/utils";

type BookingPhoneInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlurValidate?: (error: string | null) => void;
  error?: string;
  label?: string;
  required?: boolean;
};

export default function BookingPhoneInput({
  id: idProp,
  value,
  onChange,
  onBlurValidate,
  error,
  label = "טלפון",
  required = false,
}: BookingPhoneInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const errorId = `${id}-error`;

  const handleChange = (raw: string) => {
    const masked = maskIsraeliPhoneInput(raw);
    onChange(masked);
    const digits = masked.replace(/\D/g, "");
    if (digits.length >= 10) {
      const result = validateIsraeliMobile(masked);
      onBlurValidate?.(result.ok ? null : (result.errors.phone ?? "מספר טלפון לא תקין"));
    } else if (digits.length === 0) {
      onBlurValidate?.(null);
    }
  };

  const handleBlur = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      onBlurValidate?.(required ? "נא למלא טלפון" : null);
      return;
    }
    const result = validateIsraeliMobile(trimmed);
    onBlurValidate?.(result.ok ? null : (result.errors.phone ?? "מספר טלפון לא תקין"));
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        dir="ltr"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(bookFieldClass, error && "border-red-400")}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-red-500" data-field-error="">
          {error}
        </p>
      ) : null}
    </div>
  );
}
