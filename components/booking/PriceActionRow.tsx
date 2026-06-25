"use client";

import Link from "next/link";
import WhatsAppIcon from "@/components/calculators/WhatsAppIcon";
import { BOOKING_INSTALLMENT_LINE } from "@/lib/data/booking-shared";
import { buildBookHref, type BookCategoryId } from "@/lib/book-url";
import type { EventBookingItemId } from "@/lib/data/events-booking";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { whatsappQuoteCta } from "@/lib/data/conversion-copy";
import { cn } from "@/lib/utils";

const CHAT_FAQ_ATTRACTIONS = "chatbot_attractions";

function LockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      className="shrink-0 text-green-700"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export type PriceActionRowProps = {
  serviceLabel: string;
  priceExVat: number;
  bookCategory?: BookCategoryId;
  eventItemId?: EventBookingItemId | null;
  utmCampaign?: string;
  bookLabel?: string;
  className?: string;
  compact?: boolean;
};

export default function PriceActionRow({
  serviceLabel,
  priceExVat,
  bookCategory = "events",
  eventItemId = null,
  utmCampaign = "attraction_book_pricing",
  bookLabel = "הזמנה מפורטת",
  className,
  compact = false,
}: PriceActionRowProps) {
  const bookHref = buildBookHref(
    bookCategory,
    eventItemId ? { item: eventItemId } : undefined,
  );
  const chatHref = `?faq=${CHAT_FAQ_ATTRACTIONS}`;
  const whatsappHref = buildWhatsAppHref({
    text: `שלום, מעוניין/ת ב${serviceLabel} - ראיתי מחיר של ${priceExVat.toLocaleString("he-IL")} ₪ לפני מע״מ באתר.`,
    utm_source: "website",
    utm_campaign: utmCampaign,
  });

  const primaryClass = cn(
    "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
    compact ? "py-2.5 text-xs" : "py-3.5",
  );

  return (
    <div className={cn("space-y-2.5", className)}>
      <Link
        href={bookHref}
        className={cn(
          primaryClass,
          "bg-brand-red text-white hover:bg-brand-red-light focus-visible:outline-brand-red",
        )}
      >
        {bookLabel}
      </Link>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          primaryClass,
          "bg-[#25D366] text-white hover:bg-[#1fba59] focus-visible:outline-[#25D366]",
        )}
      >
        <WhatsAppIcon />
        {whatsappQuoteCta(serviceLabel, priceExVat)}
      </a>

      <Link
        href={chatHref}
        className={cn(
          primaryClass,
          "border border-border bg-background text-foreground hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-brand-red",
        )}
      >
        שאלה? עזרה בצ׳אט
      </Link>

      <p className="flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-muted-foreground">
        <LockIcon />
        <span>({BOOKING_INSTALLMENT_LINE})</span>
      </p>
    </div>
  );
}
