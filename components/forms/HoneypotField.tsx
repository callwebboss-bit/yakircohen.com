"use client";

import { useEffect, useId, useRef } from "react";
import { HONEYPOT_FIELD_NAME } from "@/lib/form-validation";

type HoneypotFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

/** Hidden field - bots often fill it; humans never see it. */
export default function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  /* F-59 (7.10.2026): מזהה ייחודי לכל מופע (ב-/podcast יש שני טפסים בעמוד), והאיתור
     דרך ref במקום getElementById, שהחזיר תמיד את השדה הראשון בעמוד. */
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const clearAutofill = () => {
      const el = inputRef.current;
      if (el && el.value.trim()) {
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
      <label htmlFor={inputId}>Website</label>
      <input
        ref={inputRef}
        id={inputId}
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
