import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import NeedsDiscoveryLeadFlowLazy from "@/components/lead-flow/NeedsDiscoveryLeadFlowLazy";
import type { LeadFlowServiceId } from "@/lib/data/lead-flow/services";

type NeedsDiscoveryLeadFlowSectionProps = {
  defaultServiceId?: LeadFlowServiceId;
  heading?: string;
  className?: string;
};

export default function NeedsDiscoveryLeadFlowSection({
  defaultServiceId,
  heading = "התאמת הצעה לפי הצורך שלכם",
  className,
}: NeedsDiscoveryLeadFlowSectionProps) {
  return (
    <Section
      id="needs-lead-flow"
      padding="sm"
      className={`scroll-mt-24 border-t border-border ${className ?? ""}`}
      ariaLabelledby="needs-lead-flow-heading"
    >
      <Container className="max-w-3xl">
        <h2
          id="needs-lead-flow-heading"
          className="font-serif text-section font-semibold text-foreground"
        >
          {heading}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          שאלות קצרות, מה כלול ומה לא, מחיר מאחורי כפתור, תוספות ומדיניות Hold.
        </p>
        <div className="mt-8">
          <NeedsDiscoveryLeadFlowLazy defaultServiceId={defaultServiceId} />
        </div>
      </Container>
    </Section>
  );
}
