import Link from "next/link";
import type { JourneyVariant } from "@/lib/data/client-journey";
import { getJourneyVariant } from "@/lib/data/client-journey";
import { cn } from "@/lib/utils";

export type JourneyStepsLinkProps = {
  variant?: JourneyVariant;
  className?: string;
};

export default function JourneyStepsLink({
  variant = "general",
  className,
}: JourneyStepsLinkProps) {
  const config = getJourneyVariant(variant);

  return (
    <p className={cn("text-center text-sm text-muted-foreground", className)}>
      <Link
        href={`/start#${config.anchor}`}
        className="font-medium text-brand-red underline-offset-4 hover:underline"
      >
        רוצים לראות את כל השלבים? </Link>
    </p>
  );
}
