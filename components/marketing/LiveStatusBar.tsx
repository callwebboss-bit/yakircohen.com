import Link from "next/link";
import Container from "@/components/ui/Container";
import { CalendarIcon, ClockIcon } from "@/components/ui/Icons";
import LiveVisitorCount from "@/components/marketing/LiveVisitorCount";
import LiveStatusProjectTicker from "@/components/marketing/LiveStatusProjectTicker";
import {
  AVAILABILITY_TONE_CLASS,
  getLiveStatusConfig,
  resolveAvailabilityLabel,
} from "@/lib/data/live-status";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const quote60sHref = buildWhatsAppHref({
  text: "שלום, אשמח להצעת מחיר מהירה.",
  utm_source: "website",
  utm_campaign: "status_bar_60s_quote",
});

export default function LiveStatusBar() {
  const config = getLiveStatusConfig();
  const availability = resolveAvailabilityLabel(config);

  return (
    <section
      className="border-b border-border bg-surface py-3 text-sm"
      aria-label="סטטוס חי"
      data-testid="live-status-bar"
    >
      <Container variant="wide">
        <div className="flex min-h-[2.5rem] flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
          <LiveVisitorCount />

          <div className="flex flex-wrap items-center gap-2">
            <ClockIcon size={16} className="shrink-0 text-muted-foreground" />
            <span
              className={cn("font-medium", AVAILABILITY_TONE_CLASS[availability.tone])}
              data-testid="live-status-availability"
            >
              {availability.label}
            </span>
            <Link
              href="/book"
              className="inline-flex min-h-8 items-center rounded-full border border-brand-red/30 bg-brand-red/5 px-2.5 text-xs font-semibold text-brand-red transition-colors hover:bg-brand-red/10"
            >
              בדקו תאריך פנוי
            </Link>
            <a
              href={quote60sHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-8 items-center rounded-full border border-amber-500/30 bg-amber-500/5 px-2.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/10 md:inline-flex"
            >
              ⏱️ הצעת מחיר ב-60 שניות
            </a>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <CalendarIcon size={16} className="shrink-0 text-emerald-600" />
            <LiveStatusProjectTicker />
          </div>
        </div>
      </Container>
    </section>
  );
}
