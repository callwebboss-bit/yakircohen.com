import Link from "next/link";
import Container from "@/components/ui/Container";
import { CalendarIcon, ClockIcon, StarIcon } from "@/components/ui/Icons";
import LiveVisitorCount from "@/components/marketing/LiveVisitorCount";
import {
  AVAILABILITY_TONE_CLASS,
  formatLastProjectDate,
  getLiveStatusConfig,
  resolveAvailabilityLabel,
} from "@/lib/data/live-status";
import {
  GOOGLE_RATING_LABEL,
  GOOGLE_REVIEW_COUNT,
  SITE_TRUST_STATS,
  STUDIO_GOOGLE_MAPS_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function LiveStatusBar() {
  const config = getLiveStatusConfig();
  const availability = resolveAvailabilityLabel(config);
  const { lastProject } = config;

  const yearsStat = SITE_TRUST_STATS.find((s) => s.label === "שנות ניסיון");
  const clientsStat = SITE_TRUST_STATS.find((s) => s.label === "לקוחות מרוצים");
  const googleStat = SITE_TRUST_STATS.find((s) => s.label === GOOGLE_RATING_LABEL);

  return (
    <section
      className="border-b border-border bg-surface py-3 text-sm"
      aria-label="סטטוס חי ונתוני אמון"
      data-testid="live-status-bar"
    >
      <Container variant="wide">
        <div className="flex min-h-[2.5rem] flex-wrap items-center justify-between gap-x-4 gap-y-2 text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <LiveVisitorCount />

            <div className="flex items-center gap-2">
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
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <CalendarIcon size={16} className="shrink-0 text-emerald-600" />
              <Link
                href={lastProject.url}
                title={`${lastProject.title} - הזמינו גם אתם`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="font-semibold text-emerald-700">✅ הושלם לאחרונה:</span>{" "}
                <span className="font-medium text-foreground">{lastProject.title}</span>
                {" • "}
                <span className="text-muted-foreground">
                  {formatLastProjectDate(lastProject.date)}
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {yearsStat ? (
              <span>
                <span className="font-semibold text-foreground">{yearsStat.value}</span>{" "}
                {yearsStat.label}
              </span>
            ) : null}
            {clientsStat ? (
              <span>
                <span className="font-semibold text-foreground">{clientsStat.value}</span>{" "}
                {clientsStat.label}
              </span>
            ) : null}
            {googleStat ? (
              <Link
                href={STUDIO_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-brand-red"
              >
                <StarIcon size={14} className="text-amber-500" />
                <span className="font-semibold text-foreground">{googleStat.value}</span>
                <span>{googleStat.label}</span>
                {GOOGLE_REVIEW_COUNT ? (
                  <span className="text-muted-foreground/80">({GOOGLE_REVIEW_COUNT}+)</span>
                ) : null}
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
