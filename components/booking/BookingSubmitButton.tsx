import { cn } from "@/lib/utils";

type BookingSubmitButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
};

export default function BookingSubmitButton({
  children,
  onClick,
  disabled,
  isSubmitting,
  className,
}: BookingSubmitButtonProps) {
  const isDisabled = disabled || isSubmitting;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isSubmitting}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-opacity",
        isDisabled
          ? "cursor-not-allowed bg-border text-muted-foreground"
          : "bg-brand-red text-white hover:opacity-90",
        className,
      )}
    >
      {isSubmitting ? (
        <>
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            aria-hidden="true"
          />
          שולח...
        </>
      ) : (
        children
      )}
    </button>
  );
}
