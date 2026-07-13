"use client";

import { BOOK_WIZARD_COPY } from "@/lib/data/book-wizard-copy";
import { mirrorWhatsAppLeadToEmail } from "@/lib/mirror-whatsapp-lead";

type WizardWhatsAppEscapeLinkProps = {
  href: string;
  /** Optional precomposed WA body for email mirror */
  messageText?: string;
  formId?: string;
};

export default function WizardWhatsAppEscapeLink({
  href,
  messageText,
  formId = "wizard_wa_escape",
}: WizardWhatsAppEscapeLinkProps) {
  return (
    <button
      type="button"
      onClick={() => {
        let body = messageText?.trim() || "";
        if (!body) {
          try {
            body = new URL(href).searchParams.get("text") || BOOK_WIZARD_COPY.waEscape;
          } catch {
            body = BOOK_WIZARD_COPY.waEscape;
          }
        }
        mirrorWhatsAppLeadToEmail({
          href,
          formId,
          subject: "יציאה מוקדמת מוויזרד - וואטסאפ",
          body,
        });
      }}
      className="mx-auto block min-h-11 w-full max-w-md text-center text-xs font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-[var(--service-accent,#d42b2b)] hover:underline"
    >
      {BOOK_WIZARD_COPY.waEscape}
    </button>
  );
}
