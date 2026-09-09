"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONTACT_PHONE_E164 } from "@/lib/constants";
import { isLikelyAvailableForWhatsApp } from "@/lib/business-hours";
import { isShabbatOrAfterFriday, isStudioOpen } from "@/lib/studio-hours";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const headerWhatsAppHref = buildWhatsAppHref({
  text: "שלום, אשמח לשמוע על השירותים שלכם.",
  utm_source: "website",
  utm_campaign: "header_wa_badge",
});

const headerResponseTimeWhatsAppHref = buildWhatsAppHref({
  text: "שלום, אשמח לשמוע על השירותים שלכם.",
  utm_source: "website",
  utm_campaign: "header_response_time",
});

function getResponseTimeLabel(now = new Date()): { text: string; fast: boolean } {
  if (isShabbatOrAfterFriday(now)) return { text: 'נחזור במוצ"ש', fast: false };
  if (!isStudioOpen(now)) return { text: "בבוקר חוזרים תוך דקות", fast: false };
  /* כאן חושב מספר דקות מהשעון (8 + ((שעה*7 + דקות) % 8)) והוצג כמדידה
     של זמן תגובה, בכל עמוד באתר. זה היה מספר פסאודו-אקראי. */
  if (isStudioOpen(now)) return { text: "מענה אנושי עכשיו", fast: true };
  return { text: "מקבלים פניות, עונים בשעות הפעילות", fast: false };
}

export function HeaderResponseTimeBadge() {
  const [label, setLabel] = useState<{ text: string; fast: boolean } | null>(null);

  useEffect(() => {
    const update = () => setLabel(getResponseTimeLabel());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!label) return null;

  return (
    <a
      href={headerResponseTimeWhatsAppHref}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-none border-0 bg-transparent px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground lg:flex"
      aria-label={label.text}
    >
      <span aria-hidden>{label.fast ? "⚡" : "⏳"}</span>
      {label.text}
    </a>
  );
}

export function WhatsAppAvailabilityBadge() {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setAvailable(isLikelyAvailableForWhatsApp());
    update();
    const id = window.setInterval(update, 60_000);
    const onVisibility = () => update();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (available === null) {
    return <span className="h-[34px] min-w-[10rem]" aria-hidden />;
  }

  return (
    <a
      href={headerWhatsAppHref}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-none border-0 bg-transparent px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
      aria-label={available ? "זמין עכשיו בוואטסאפ" : "חוזרים תוך כמה דק' בוואטסאפ"}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${available ? "bg-green-500" : "bg-yellow-500"}`}
        aria-hidden
      />
      {available ? "זמין עכשיו בוואטסאפ" : "חוזרים תוך כמה דק'"}
    </a>
  );
}

/** Reserved slot so header layout does not shift when badges hydrate. */
export function HeaderDynamicBadgesGroup() {
  return (
    <div
      role="group"
      aria-label="זמינות ותגובה"
      className="hidden overflow-hidden rounded-lg border border-border bg-background lg:flex"
    >
      <WhatsAppAvailabilityBadge />
      <HeaderResponseTimeBadge />
    </div>
  );
}

/** Phone link island - isolated from scroll/state in main Header shell. */
export function HeaderPhoneLink({ className }: { className?: string }) {
  return (
    <a
      href={`tel:${CONTACT_PHONE_E164}`}
      className={className}
      aria-label="חיוג מהיר"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6.5 4h3l1.5 5-2 1.2a11 11 0 005.8 5.8L18 14l5 1.5v3a2 2 0 01-2.1 2 17.5 17.5 0 01-14.4-14.4A2 2 0 016.5 4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
