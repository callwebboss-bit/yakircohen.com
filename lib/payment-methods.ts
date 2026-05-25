/** Footer payment & trust badges - labels only; icons are generic trust marks */
export const PAYMENT_METHODS = [
  { id: "credit", label: "אשראי", accent: "from-slate-700 to-slate-900" },
  { id: "bit", label: "Bit", accent: "from-[#003DA5] to-[#0052CC]" },
  { id: "paybox", label: "PayBox", accent: "from-[#E85D04] to-[#F48C06]" },
  { id: "apple-pay", label: "Apple Pay", accent: "from-neutral-900 to-black" },
  { id: "paypal", label: "PayPal", accent: "from-[#003087] to-[#009CDE]" },
] as const;

export const PAYMENT_INVOICING = [
  { id: "green-invoice-grow", label: "חשבונית ירוקה · GROW" },
] as const;
