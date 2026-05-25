"use client";

import { HONEYPOT_FIELD_NAME } from "@/lib/form-validation";

type HoneypotFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

/** Hidden field — bots often fill it; humans never see it. */
export default function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
      aria-hidden="true"
    >
      <label htmlFor="yc-honeypot-input">Website</label>
      <input
        id="yc-honeypot-input"
        type="text"
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
