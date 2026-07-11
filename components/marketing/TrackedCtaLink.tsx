"use client";

import type { AnchorHTMLAttributes } from "react";
import { fireLeadTouch } from "@/lib/lead-touch";

export type TrackedCtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  source: string;
  ctaType?: string;
};

/** Plain, custom-styled `<a>` that fires a Closer lead-touch event on click. */
export default function TrackedCtaLink({
  source,
  ctaType,
  onClick,
  ...anchorProps
}: TrackedCtaLinkProps) {
  return (
    <a
      {...anchorProps}
      onClick={(event) => {
        fireLeadTouch(source, ctaType);
        onClick?.(event);
      }}
    />
  );
}
