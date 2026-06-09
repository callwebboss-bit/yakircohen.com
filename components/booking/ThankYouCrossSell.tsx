"use client";

import BookingCrossSellSection from "@/components/booking/BookingCrossSellSection";
import type { BookCategoryId } from "@/lib/book-url";
import { THANK_YOU_TO_BOOK_CATEGORY } from "@/lib/data/book-closer-map";

type ThankYouCrossSellProps = {
  service: string;
  route?: string | null;
  recordingType?: string | null;
  atmosphere?: string | null;
};

export default function ThankYouCrossSell({
  service,
  route,
  recordingType,
  atmosphere,
}: ThankYouCrossSellProps) {
  const bookCategory = (THANK_YOU_TO_BOOK_CATEGORY[service] ?? "studio") as BookCategoryId;

  return (
    <BookingCrossSellSection
      bookCategory={bookCategory}
      routeId={route}
      recordingType={recordingType}
      atmosphere={atmosphere}
      className="mt-8 text-right"
    />
  );
}
