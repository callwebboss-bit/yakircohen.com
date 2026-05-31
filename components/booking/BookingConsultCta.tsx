import { BOOKING_CONSULT_15_MIN } from "@/lib/data/booking-shared";
import { buildConsultWhatsAppHref } from "@/lib/booking-messages";
import { cn } from "@/lib/utils";

type BookingConsultCtaProps = {
  className?: string;
};

export default function BookingConsultCta({ className }: BookingConsultCtaProps) {
  const href = buildConsultWhatsAppHref([], { name: "", phone: "" });

  return (
    <aside
      className={cn(
        "rounded-2xl border border-dashed border-brand-red/35 bg-brand-red/5 p-5",
        className,
      )}
    >
      <p className="text-sm font-semibold text-foreground">
        {BOOKING_CONSULT_15_MIN.title}
      </p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        {BOOKING_CONSULT_15_MIN.subtitle}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex rounded-xl border border-brand-red/40 bg-background px-4 py-2.5 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red/10"
      >
        תאמו ייעוץ בוואטסאפ
      </a>
    </aside>
  );
}
