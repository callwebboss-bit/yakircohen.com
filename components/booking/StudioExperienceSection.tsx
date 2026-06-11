import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import brandCopy from "@/lib/data/closer-brand-copy.json";

const STUDIO_EXPERIENCE_COPY = brandCopy.studioExperience;
const STUDIO_LOUNGE_COPY = brandCopy.studioLounge;

const WHO_IT_FITS =
  "מתאים למשפחות שרוצות שיר הפתעה, ברכות, הקלטות לבר/בת מצווה, זמרים שמקליטים שיר, וקבוצות שמחפשות חוויה מקצועית בלי לחץ.";

type StudioExperienceSectionProps = {
  heading?: string;
  headingId?: string;
};

export default function StudioExperienceSection({
  heading = "מה מחכה לכם באולפן",
  headingId = "studio-experience-heading",
}: StudioExperienceSectionProps) {
  const { blockTitle, recordingFlow } = STUDIO_EXPERIENCE_COPY;
  const { amenities, clientBlock } = STUDIO_LOUNGE_COPY;

  return (
    <Section
      padding="sm"
      className="border-t border-border bg-background"
      ariaLabelledby={headingId}
    >
      <Container>
        <h2
          id={headingId}
          className="font-serif text-section-title font-semibold text-foreground"
        >
          {heading}
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold text-foreground">{blockTitle}</h3>
            <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground">
              {recordingFlow.map((step: string) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">מה יש במתחם ההמתנה</h3>
              <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                {amenities.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{clientBlock}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">למי זה מתאים</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{WHO_IT_FITS}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
