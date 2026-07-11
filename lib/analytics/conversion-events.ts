"use client";

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: GtagFn };
  w.gtag?.(...args);
}

export type ConversionEventName =
  | "book_router_select"
  | "book_fast_whatsapp"
  | "book_wizard_start"
  | "book_wizard_step"
  | "book_lead_submit"
  | "book_success_panel"
  | "book_success_wa_click"
  | "whatsapp_popup_blocked"
  | "whatsapp_fab_click"
  | "portfolio_demo_play"
  | "pricing_calculator_interact"
  | "thank_you_upsell_click"
  | "shop_cta_click"
  | "chatbot_open"
  | "chatbot_question_click"
  | "chatbot_wa_cta_click"
  | "chatbot_read_more_click"
  | "chatbot_share_click"
  | "chatbot_copy_click"
  | "coupon_popup_show"
  | "coupon_popup_close"
  | "coupon_popup_cta_click"
  | "session_rescuer_shown"
  | "session_rescuer_resume"
  | "session_rescuer_dismiss"
  | "book_wizard_step_celebrate";

export function trackConversion(
  name: ConversionEventName,
  params?: Record<string, string | number | boolean>,
): void {
  gtag("event", name, params ?? {});
}
