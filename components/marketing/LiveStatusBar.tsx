import Container from "@/components/ui/Container";
import { CalendarIcon } from "@/components/ui/Icons";
import LiveVisitorCount from "@/components/marketing/LiveVisitorCount";
import LiveStatusProjectTicker from "@/components/marketing/LiveStatusProjectTicker";
import { LIVE_STATUS_REAL_WORKS } from "@/lib/data/live-status";

export default function LiveStatusBar() {
  return (
    <section
      className="border-b border-border bg-surface py-3 text-sm"
      aria-label="סטטוס חי"
      data-testid="live-status-bar"
    >
      <Container variant="wide">
        <div className="flex min-h-[2.5rem] flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
          <LiveVisitorCount />

          <div className="hidden items-center gap-2 md:flex">
            <CalendarIcon size={16} className="shrink-0 text-emerald-600" />
            <LiveStatusProjectTicker works={LIVE_STATUS_REAL_WORKS} />
          </div>
        </div>
      </Container>
    </section>
  );
}
