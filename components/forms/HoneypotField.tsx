"use client";

import { useEffect } from "react";
import { HONEYPOT_FIELD_NAME } from "@/lib/form-validation";

type HoneypotFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

/** Hidden field - bots often fill it; humans never see it. */
export default function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  useEffect(() => {
    const clearAutofill = () => {
      const el = document.getElementById("yc-honeypot-input");
      if (el instanceof HTMLInputElement && el.value.trim()) {
        onChange("");
      } else if (value.trim()) {
        onChange("");
      }
    };
    clearAutofill();
    const t1 = window.setTimeout(clearAutofill, 150);
    const t2 = window.setTimeout(clearAutofill, 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onChange, value]);

  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor="yc-honeypot-input">Website</label>
      <input
        id="yc-honeypot-input"
        type="text"
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        autoComplete="nope"
        data-lpignore="true"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
