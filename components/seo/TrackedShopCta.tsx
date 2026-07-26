"use client";

import { trackConversion } from "@/lib/analytics/conversion-events";
import type { ShopLeadSection } from "@/lib/data/shop-vouchers";

type TrackedShopCtaProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  campaign: string;
  section: ShopLeadSection;
  "aria-label"?: string;
};

export default function TrackedShopCta({
  href,
  children,
  className,
  campaign,
  section,
  "aria-label": ariaLabel,
}: TrackedShopCtaProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={() =>
        trackConversion("shop_cta_click", { campaign, section })
      }
    >
      {children}
    </a>
  );
}
