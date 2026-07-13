"use client";

import { trackConversion } from "@/lib/analytics/conversion-events";
import { cn } from "@/lib/utils";

type TrackedShopCtaProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  campaign: string;
  section: "vouchers" | "bundles" | "used-gear";
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
