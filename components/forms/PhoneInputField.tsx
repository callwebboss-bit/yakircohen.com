"use client";

import { normalizeIsraeliMobile } from "@/lib/form-validation";
import { cn } from "@/lib/utils";

export type PhoneInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  label?: string;
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
  label = "טלפון נייד",
  className,
}: PhoneInputFieldProps) {
  const isValid = Boolean(value.trim() && normalizeIsraeliMobile(value.trim()));

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
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
          placeholder="05X-XXXXXXX"
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-[border-color,box-shadow] duration-fast ease-luxury",
            "focus:outline-none focus:ring-2 focus:ring-brand-red/20",
            isValid
              ? "border-green-500 pe-10 focus:border-green-500"
              : error
                ? "border-red-400 focus:border-red-400"
                : "border-border focus:border-brand-red",
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
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
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
