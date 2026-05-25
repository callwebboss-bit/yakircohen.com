import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const LEGAL_PHONE_DISPLAY = CONTACT_PHONE_DISPLAY;
export const LEGAL_PHONE_TEL = CONTACT_PHONE_E164;

export const legalWhatsAppHref = buildWhatsAppHref({
  text: "שלום, פנייה בנושא מדיניות / נגישות / תנאי שירות",
  utm_campaign: "legal_contact",
});

export const accessibilityWhatsAppHref = buildWhatsAppHref({
  text: "שלום, בקשת נגישות",
  utm_campaign: "accessibility_request",
});
