"use client";

import ShareButton from "@/components/ui/ShareButton";
import { buildCorporateShareText } from "@/lib/corporate-share";
import { cn } from "@/lib/utils";

export type CorporateShareButtonProps = {
  serviceLabel: string;
  title: string;
  className?: string;
};

export default function CorporateShareButton({
  serviceLabel,
  title,
  className,
}: CorporateShareButtonProps) {
  return (
    <ShareButton
      title={title}
      text={buildCorporateShareText(serviceLabel)}
      label="שתף הצעה עם מנהל/שותף"
      copyFullMessage
      className={cn(className)}
    />
  );
}
