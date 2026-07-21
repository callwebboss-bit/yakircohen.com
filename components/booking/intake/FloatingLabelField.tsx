"use client";

import { useId, type Ref } from "react";
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
}: FloatingLabelFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const filled = value.trim().length > 0;

  return (
    <div className={cn("relative", className)}>
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
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(
          "peer w-full min-h-12 rounded-xl border bg-background px-4 pt-5 pb-2 text-sm text-foreground",
          "border-border focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
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
        {label}
      </label>
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs text-brand-red"
          role="alert"
          data-field-error=""
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
