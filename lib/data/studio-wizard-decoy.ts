/** חבילת פיתיון VIP - להשוואה בלבד, לא ניתנת להזמנה אונליין */
import { STUDIO_CRO_CONFIG } from "@/lib/data/cro/studio";

const d = STUDIO_CRO_CONFIG.decoy!;

export const STUDIO_WIZARD_DECOY_VIP = {
  emoji: d.emoji,
  name: d.name,
  description: d.description,
  highlights: d.highlights,
  priceExVat: d.priceExVat,
  badge: d.badge,
  footnote: d.footnote,
};
