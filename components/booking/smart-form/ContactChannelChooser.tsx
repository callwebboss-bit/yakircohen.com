"use client";

import { useEffect, useState } from "react";
import {
  CONTACT_PHONE_E164,
  CONTACT_PHONE_DISPLAY,
} from "@/lib/constants";
import { getBusinessOpenStatus, type BusinessOpenStatus } from "@/lib/business-hours";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type ContactChannelChooserProps = {
  name: string;
  contactMethod: string;
  summaryLine: string;
  disabled?: boolean;
};

const TOUCH =
  "inline-flex min-h-[48px] items-center justify-center touch-manipulation select-none";

export default function ContactChannelChooser({
  name,
  contactMethod,
  summaryLine,
  disabled = false,
}: ContactChannelChooserProps) {
  const [status, setStatus] = useState<BusinessOpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getBusinessOpenStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const waText = [
    name ? `שלום, כאן ${name}.` : "שלום,",
    contactMethod ? `יצירת קשר: ${contactMethod}` : "",
    summaryLine,
  ]
    .filter(Boolean)
    .join("\n");

  const waHref = buildWhatsAppHref({
    text: waText,
    utm_campaign: "smart_form_channel",
  });

  const isOpen = status?.isOpen ?? false;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface/30 p-4 touch-manipulation">
      <div className="flex items-center gap-2 text-xs">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`}
          aria-hidden
        />
        <span className={isOpen ? "text-emerald-700" : "text-red-700"}>
          {status?.label ?? "בודקים שעות פעילות..."}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <a
          href={disabled ? undefined : waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled}
          className={`${TOUCH} rounded-lg bg-brand-red px-3 text-center text-sm font-semibold text-white hover:opacity-90 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          וואטסאפ מיידי
        </a>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("yc-smart-form-email-channel", {
                detail: { name, contactMethod, summaryLine },
              }),
            );
          }}
          className={`${TOUCH} rounded-lg border border-border bg-white px-3 text-sm font-semibold text-foreground hover:border-brand-red disabled:cursor-not-allowed disabled:opacity-50`}
        >
          שליחה במייל
        </button>
        <a
          href={disabled ? undefined : `tel:${CONTACT_PHONE_E164}`}
          aria-disabled={disabled}
          className={`${TOUCH} rounded-lg border border-border bg-white px-3 text-sm font-semibold text-foreground hover:border-brand-red ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          התקשרות {CONTACT_PHONE_DISPLAY}
        </a>
      </div>

      <p className="text-xs text-muted-foreground">
        מעדיפים תמיד וואטסאפ. לטלפון כשר - הודעה רגילה (SMS).
      </p>
    </div>
  );
}
