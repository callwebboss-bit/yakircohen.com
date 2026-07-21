"use client";

import FloatingLabelField from "@/components/booking/intake/FloatingLabelField";
import { FORM_DATA_SECURITY } from "@/lib/data/conversion-copy";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { cn } from "@/lib/utils";
import type { Ref } from "react";

type IntakeStepContactProps = {
  name: string;
  phone: string;
  email: string;
  errors: Record<string, string>;
  returningName: string | null;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  nameInputRef?: Ref<HTMLInputElement>;
  className?: string;
};
export default function IntakeStepContact({
  name,
  phone,
  email,
  errors,
  returningName,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  nameInputRef,
  className,
}: IntakeStepContactProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {returningName ? (
        <p
          className="rounded-xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          שמחים לראות אותך שוב, {returningName}! הפרטים הקודמים שלך כבר מולאו כדי לחסוך
          לך זמן.
        </p>
      ) : null}

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {FORM_DATA_SECURITY}
      </p>

      <FloatingLabelField
        label="שם מלא"
        value={name}
        onChange={onNameChange}
        error={errors.name}
        autoComplete="name"
        inputRef={nameInputRef}
      />
      <FloatingLabelField
        label="טלפון נייד"
        type="tel"
        value={phone}
        onChange={onPhoneChange}
        error={errors.phone}
        hint={FORM_MICROCOPY.phoneHint}
        autoComplete="tel"
        inputMode="tel"
        dir="ltr"
      />
      <FloatingLabelField
        label="אימייל (אופציונלי)"
        type="email"
        value={email}
        onChange={onEmailChange}
        error={errors.email}
        hint={FORM_MICROCOPY.emailHint}
        autoComplete="email"
        inputMode="email"
        dir="ltr"
      />
    </div>
  );
}
