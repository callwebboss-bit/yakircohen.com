import {
  CONTACT_PHONE_DISPLAY,
  STUDIO_ADDRESS_LINE,
} from "@/lib/constants";

export const COMPANY_LEGAL_NAME = "יקיר כהן הפקות";
export const COMPANY_ID = "301773289";
export const COMPANY_REGISTRY_URL = "https://ica.justice.gov.il/SearchCompany";

/** Plain-text block for procurement / invoice systems (public fields only). */
export function buildInvoiceClipboardText(): string {
  return [
    `שם רשמי: ${COMPANY_LEGAL_NAME}`,
    `ח.פ: ${COMPANY_ID}`,
    `כתובת: ${STUDIO_ADDRESS_LINE}`,
    `טלפון: ${CONTACT_PHONE_DISPLAY}`,
    "חשבונית מס מסודרת",
    "פרטי בנק: נמסרים בחשבונית הראשונה או לפי בקשה",
  ].join("\n");
}
