/**
 * GA4 funnel steps for Explore / Funnel exploration.
 * Wire these exact event names in GA4 Admin → Events / Explorations.
 *
 * Step order (primary lead funnel):
 * 1. page_view (built-in) on `/` or service hub
 * 2. book_wizard_start
 * 3. book_wizard_step (param step ≥ 3)
 * 4. book_lead_submit
 * 5. book_success_wa_click
 *
 * Micro-conversions (parallel, not funnel steps):
 * - portfolio_demo_play
 * - pricing_calculator_interact
 * - whatsapp_fab_click
 * - thank_you_upsell_click
 * - shop_cta_click
 */
export const GA4_LEAD_FUNNEL_STEPS = [
  "book_wizard_start",
  "book_wizard_step",
  "book_lead_submit",
  "book_success_wa_click",
] as const;

export const GA4_MICRO_CONVERSIONS = [
  "portfolio_demo_play",
  "pricing_calculator_interact",
  "whatsapp_fab_click",
  "thank_you_upsell_click",
  "shop_cta_click",
] as const;
