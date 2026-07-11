"use client";

import { trackConversion } from "@/lib/analytics/conversion-events";
import { cn } from "@/lib/utils";

type TrackedShopCtaProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  campaign: string;
  section: "vouchers" | "bundles" | "used-gear";
};

export default function TrackedShopCta({
  href,
  children,
  className,
  campaign,
  section,
}: TrackedShopCtaProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackConversion("shop_cta_click", { campaign, section })
      }
    >
      {children}
    </a>
  );
}
