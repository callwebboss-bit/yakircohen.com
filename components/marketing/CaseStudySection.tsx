import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { SITE_CASE_STUDIES } from "@/lib/data/site-case-studies";

export default function CaseStudySection() {
  return (
    <Section padding="sm" className="border-y border-border bg-surface/50">
      <Container className="max-w-5xl">
        <h2 className="font-serif text-section-title font-semibold text-foreground">
          דוגמאות מהשטח
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          מספרים ותוצאות מפרויקטים אמיתיים, בלי הבטחות כלליות.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {SITE_CASE_STUDIES.map((study) => (
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
