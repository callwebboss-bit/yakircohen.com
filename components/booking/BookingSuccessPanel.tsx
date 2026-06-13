"use client";

import Link from "next/link";
import { useCallback, useEffect } from "react";
import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import { trackConversion } from "@/lib/analytics/conversion-events";
import type { BookCategoryId } from "@/lib/book-url";
import BookReplyStudio from "@/components/booking/BookReplyStudio";
import { BOOK_THANK_YOU_SERVICE } from "@/lib/data/book-closer-map";
import {
  BOOKING_POST_SUBMIT,
  resolveBookingBtsVideo,
} from "@/lib/data/booking-shared";
import { buildCloserDeepLink, decodeWhatsAppTextFromHref } from "@/lib/closer-deep-link";
import type { ReplyContext } from "@/lib/reply-copy-builders";
import { cn } from "@/lib/utils";
import BookingCrossSellSection from "@/components/booking/BookingCrossSellSection";

type BookingSuccessPanelProps = {
  intent?: "continue_chat" | "start_now";
  whatsappHref: string;
  onNewBooking: () => void;
  bookCategory?: BookCategoryId;
  routeId?: string | null;
  recordingType?: string | null;
  atmosphere?: string | null;
  replyStudioContext?: ReplyContext;
  className?: string;
};

export default function BookingSuccessPanel({
  intent = "continue_chat",
  whatsappHref,
  onNewBooking,
  bookCategory,
  routeId,
  recordingType,
  atmosphere,
  replyStudioContext,
  className,
}: BookingSuccessPanelProps) {
  const copy = BOOKING_POST_SUBMIT[intent];
  const btsVideo = resolveBookingBtsVideo(bookCategory);
  const thankYouParams = new URLSearchParams();
  if (bookCategory) {
    thankYouParams.set("service", BOOK_THANK_YOU_SERVICE[bookCategory]);
  }
  if (routeId) thankYouParams.set("route", routeId);
  if (recordingType) thankYouParams.set("recordingType", recordingType);
  if (atmosphere) thankYouParams.set("atmosphere", atmosphere);
  const thankYouHref = bookCategory
    ? `/thank-you?${thankYouParams.toString()}`
    : null;

  useEffect(() => {
    trackConversion("book_success_panel", bookCategory ? { category: bookCategory } : undefined);
  }, [bookCategory]);

  const closerLinkAvailable = !!decodeWhatsAppTextFromHref(whatsappHref);

  const copyCloserLink = useCallback(() => {
    const body = decodeWhatsAppTextFromHref(whatsappHref);
    if (!body) return;
    const link = buildCloserDeepLink(body);
    void navigator.clipboard.writeText(link).then(() => {
      window.alert(
        "קישור ל-Closer הועתק.\n\nפתח את yakir-closer.html מתיקיית local-tools והדבק את הקישור בשורת הכתובת - הליד ייטען אוטומטית.",
      );
    });
  }, [whatsappHref]);

  const onWhatsAppClick = useCallback(() => {
    trackConversion(
      "book_success_wa_click",
      bookCategory ? { category: bookCategory } : undefined,
    );
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

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWhatsAppClick}
        className="mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1fba59] sm:w-auto"
      >
        {copy.reopenLabel}
      </a>

      <div className="mx-auto mt-8 max-w-md text-right">
        <p className="mb-3 text-center text-xs font-semibold text-muted-foreground">
          {btsVideo.title}
        </p>
        <LazyYouTubePlayer
          videoId={btsVideo.videoId}
          title={btsVideo.title}
        />
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
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
        {closerLinkAvailable ? (
          <button
            type="button"
            onClick={copyCloserLink}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            העתק קישור ל-Closer
          </button>
        ) : null}
      </div>

      {replyStudioContext ? (
        <div className="mt-6 space-y-3 text-right">
          <p className="text-sm font-semibold text-foreground">
            יש לכם עם מי לדבר - הנה טקסט מוכן למשפחה / לילד אחרי הפלייבק
          </p>
          <BookReplyStudio
            context={{ ...replyStudioContext, intent: intent || replyStudioContext.intent }}
            compact
            onCopy={() => window.alert("הועתק - אפשר לשלוח למשפחה / לילד")}
          />
        </div>
      ) : null}
      <BookingCrossSellSection
        bookCategory={bookCategory}
        routeId={routeId}
        recordingType={recordingType}
        atmosphere={atmosphere}
        className="text-center sm:text-right"
      />
    </div>
  );
}
