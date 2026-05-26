import { BOOKING_POST_SUBMIT_MESSAGE } from "@/lib/data/booking-shared";
import { cn } from "@/lib/utils";

type BookingSuccessPanelProps = {
  whatsappHref: string;
  onNewBooking: () => void;
  className?: string;
};

export default function BookingSuccessPanel({
  whatsappHref,
  onNewBooking,
  className,
}: BookingSuccessPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-green-600/30 bg-green-600/5 p-8 text-center",
        className,
      )}
      role="status"
    >
      <p className="text-4xl" aria-hidden="true">
        ✓
      </p>
      <h2 className="mt-4 text-xl font-semibold text-foreground">
        {BOOKING_POST_SUBMIT_MESSAGE.title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {BOOKING_POST_SUBMIT_MESSAGE.body}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          {BOOKING_POST_SUBMIT_MESSAGE.reopenLabel}
        </a>
        <button
          type="button"
          onClick={onNewBooking}
          className="inline-flex rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
        >
          {BOOKING_POST_SUBMIT_MESSAGE.newBookingLabel}
        </button>
      </div>
    </div>
  );
}
