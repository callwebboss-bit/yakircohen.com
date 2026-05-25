"use client";

import { cn } from "@/lib/utils";

type LeadFormAlertProps = {
  message: string | null;
  className?: string;
};

export default function LeadFormAlert({ message, className }: LeadFormAlertProps) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={cn(
        "rounded-xl border border-brand-red/30 bg-brand-red/5 px-4 py-3 text-sm font-medium text-brand-red",
        className,
      )}
    >
      {message}
    </p>
  );
}
