import { formatExVatWithVat } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

type PriceWithVatProps = {
  amountExVat: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** הצג רק שורה אחת (לפני מע״מ) */
  compact?: boolean;
};

const sizeClasses = {
  sm: { main: "text-sm font-bold", sub: "text-[0.65rem]" },
  md: { main: "text-lg font-bold", sub: "text-xs" },
  lg: { main: "text-2xl font-bold", sub: "text-xs" },
} as const;

export default function PriceWithVat({
  amountExVat,
  size = "md",
  className,
  compact = false,
}: PriceWithVatProps) {
  const { exVat, withVat } = formatExVatWithVat(amountExVat);
  const s = sizeClasses[size];

  if (compact) {
    return (
      <span className={cn(s.main, "text-foreground", className)}>
        {exVat}
        <span className={cn(s.sub, "mr-1 font-normal text-muted-foreground")}>
          לפני מע״מ
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-col gap-0.5", className)}>
      <span className={cn(s.main, "text-foreground")}>{exVat}</span>
      <span className={cn(s.sub, "text-muted-foreground")}>
        כולל מע״מ: {withVat}
      </span>
    </span>
  );
}
