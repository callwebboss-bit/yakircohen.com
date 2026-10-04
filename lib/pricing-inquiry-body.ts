/**
 * גוף הפנייה מטופס המחירון (/pricing). הוצא מ-PricingInquiryForm כדי שבדיקת
 * השרת (lib/leads/payload-check.test.ts) תריץ את אותו גוף בדיוק שהדפדפן שולח.
 */
export type PricingInquiryBodyInput = {
  sectionId: string;
  sectionTitle?: string;
  row?: { label: string; exVat: number } | null;
  qualify: { eventDate?: string; budgetHint?: string; recordingType?: string };
  message: string;
  name: string;
  phone: string;
  email: string;
};

export function buildPricingInquiryBody(input: PricingInquiryBodyInput): string {
  const priceLine = input.row
    ? `${input.row.label} - ${input.row.exVat.toLocaleString("he-IL")} ₪ לפני מע״מ`
    : input.sectionTitle || "";

  return [
    `שירות: ${input.sectionTitle || input.sectionId}`,
    priceLine ? `מחירון: ${priceLine}` : null,
    `קישור: https://yakircohen.com/pricing?ask=${input.sectionId}`,
    input.qualify.eventDate ? `תאריך: ${input.qualify.eventDate}` : null,
    input.qualify.budgetHint ? `תקציב משוער: ${input.qualify.budgetHint}` : null,
    input.qualify.recordingType ? `סוג הקלטה: ${input.qualify.recordingType}` : null,
    input.message ? `הודעה: ${input.message}` : null,
    `שם: ${input.name}`,
    `טלפון: ${input.phone}`,
    input.email ? `אימייל: ${input.email}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
