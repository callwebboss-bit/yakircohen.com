import type { BookingWhatsAppBodyOptions } from "@/lib/booking-messages";
export type WizardCroFormSlice = {
  sessionPriority?: string;
  welcomePerk?: string;
  lastMinuteUpsell?: boolean;
};

/** מטא CRO ל-[YC:...] — events / podcast / singer (אולפן דרך studioCro) */
export function wizardCroYcExtras(
  form: WizardCroFormSlice,
): Pick<
  BookingWhatsAppBodyOptions,
  "ycSessionPriority" | "ycWelcomePerk" | "ycLastMinuteUpsell" | "ycStep" | "ycConfigVersion"
> {
  const hasCro =
    !!form.sessionPriority || !!form.welcomePerk || !!form.lastMinuteUpsell;
  return {
    ycSessionPriority: form.sessionPriority || null,
    ycWelcomePerk: form.welcomePerk || null,
    ycLastMinuteUpsell: form.lastMinuteUpsell || null,
    ycStep: 3,
    ycConfigVersion: hasCro ? 3 : null,
  };
}
