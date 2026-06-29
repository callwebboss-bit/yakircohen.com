"use client";

import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { BOOK_WIZARD_COPY } from "@/lib/data/book-wizard-copy";

type WizardWhatsAppEscapeLinkProps = {
  href: string;
};

export default function WizardWhatsAppEscapeLink({ href }: WizardWhatsAppEscapeLinkProps) {
  return (
    <button
      type="button"
      onClick={() => openWhatsAppLead(href)}
      className="mx-auto block min-h-11 w-full max-w-md text-center text-xs font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-[var(--service-accent,#d42b2b)] hover:underline"
    >
      {BOOK_WIZARD_COPY.waEscape}
    </button>
  );
}
