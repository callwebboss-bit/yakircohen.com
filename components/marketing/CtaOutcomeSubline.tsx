import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { cn } from "@/lib/utils";

export type CtaOutcomeSublineProps = {
  className?: string;
  text?: string;
};

export default function CtaOutcomeSubline({
  className,
  text = TIME_CLAIMS.humanResponseSubline,
}: CtaOutcomeSublineProps) {
  return (
    <p className={cn("text-center text-xs text-muted-foreground", className)}>
      {text}
    </p>
  );
}
