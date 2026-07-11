import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  getCaseStudiesForHub,
  type SiteCaseStudyHub,
} from "@/lib/data/site-case-studies";

type CaseStudySectionProps = {
  hub?: SiteCaseStudyHub;
  limit?: number;
  className?: string;
};

export default function CaseStudySection({
  hub = "home",
  limit = 3,
  className,
}: CaseStudySectionProps) {
  const studies = getCaseStudiesForHub(hub, limit);
  if (!studies.length) return null;

  return (
    <Section
      padding="sm"
      className={className ?? "border-y border-border bg-surface/50"}
    >
      <Container className="max-w-5xl">
        <h2 className="font-serif text-section-title font-semibold text-foreground">
          דוגמאות מהשטח
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          מספרים ותוצאות מפרויקטים אמיתיים, בלי הבטחות כלליות.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {studies.map((study) => (
            <li
              key={study.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                {study.service} · {study.year}
              </p>
              <p className="mt-2 font-semibold text-foreground">{study.metric}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {study.detail}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
