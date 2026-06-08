"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackConversion } from "@/lib/analytics/conversion-events";
import type { BookCategoryId } from "@/lib/book-url";
import { BOOK_THANK_YOU_SERVICE } from "@/lib/data/book-closer-map";
import { BOOKING_POST_SUBMIT } from "@/lib/data/booking-shared";
import { cn } from "@/lib/utils";

type BookingSuccessPanelProps = {
  intent?: "continue_chat" | "start_now";
  whatsappHref: string;
  onNewBooking: () => void;
  bookCategory?: BookCategoryId;
  className?: string;
};

export default function BookingSuccessPanel({
  intent = "continue_chat",
  whatsappHref,
  onNewBooking,
  bookCategory,
  className,
}: BookingSuccessPanelProps) {
  const copy = BOOKING_POST_SUBMIT[intent];
  const thankYouHref = bookCategory
    ? `/thank-you?service=${BOOK_THANK_YOU_SERVICE[bookCategory]}`
    : null;

  useEffect(() => {
    trackConversion("book_success_panel", bookCategory ? { category: bookCategory } : undefined);
  }, [bookCategory]);

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
      <h2 className="mt-4 text-xl font-semibold text-foreground">{copy.title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {copy.body}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1fba59]"
        >
          {copy.reopenLabel}
        </a>
        {thankYouHref ? (
          <Link
            href={thankYouHref}
            className="inline-flex rounded-xl border border-brand-red/30 bg-brand-red/5 px-6 py-3 text-sm font-semibold text-brand-red hover:border-brand-red/50"
          >
            מה להכין לפני שנחזור
          </Link>
        ) : null}
        <button
          type="button"
          onClick={onNewBooking}
          className="inline-flex rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
        >
          {copy.newBookingLabel}
        </button>
      </div>
    </div>
  );
}
