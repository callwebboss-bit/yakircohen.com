/**
 * Opens WhatsApp (primary) and mirrors the same message to Resend (silent backup).
 */
import type { BookCategoryId } from "@/lib/book-url";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";

export type MirrorWhatsAppLeadInput = {
  href: string;
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
  leadCategory?: BookCategoryId;
  website_verification?: string;
};

export function mirrorWhatsAppLeadToEmail(input: MirrorWhatsAppLeadInput): boolean {
  const opened = openWhatsAppLead(input.href, {
    leadCategory: input.leadCategory,
  });

  notifyLeadByEmail({
    formId: input.formId,
    subject: input.subject,
    body: input.body,
    name: input.name,
    phone: input.phone,
    website_verification: input.website_verification,
  });

  return opened;
}
