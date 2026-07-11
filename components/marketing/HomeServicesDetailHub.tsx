import ServiceCard from "@/components/marketing/ServiceCard";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { HOME_SERVICE_DETAILS } from "@/lib/data/home";

export default function HomeServicesDetailHub() {
  return (
    <Section
      padding="sm"
      className="bg-surface"
      ariaLabelledby="home-services-detail-heading"
    >
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="home-services-detail-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            כל השירותים - מפרט מלא
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            פרטים טכניים, מחירים ופרמטרים תפעוליים לכל מסלול
          </p>
        </header>

        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {HOME_SERVICE_DETAILS.map((item) => (
            <li key={item.id}>
              <ServiceCard
                title={item.title}
                description={item.summary}
                bullets={item.bullets}
                href={item.ctaHref ?? "/book"}
                icon={
                  <span className="text-2xl" aria-hidden>
                    {item.icon}
                  </span>
                }
                fromPrice={item.priceLabel}
                isAiService={item.id === "ai-video-services"}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
