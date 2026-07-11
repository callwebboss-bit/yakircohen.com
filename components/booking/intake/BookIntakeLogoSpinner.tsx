"use client";

import Image from "next/image";
import { SITE_LOGO_SRC } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BookIntakeLogoSpinnerProps = {
  className?: string;
};

export default function BookIntakeLogoSpinner({ className }: BookIntakeLogoSpinnerProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3 py-8", className)}
      role="status"
      aria-label="שולח פנייה"
    >
      <Image
        src={SITE_LOGO_SRC}
        alt=""
        width={48}
        height={48}
        className="animate-spin duration-1000 motion-reduce:animate-none"
        aria-hidden="true"
      />
      <p className="text-sm text-muted-foreground">שולח את הפנייה...</p>
    </div>
  );
}
