import { AttractionsCalculatorLazy } from "@/components/calculators/lazy";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getAttractionsHubLinks,
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("events-attractions-hub");

export const metadata = metadataFromService(service);

export default function EventsAttractionsHubPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="אטרקציות לאירועים"
    >
      <section aria-labelledby="attractions-calculator-heading" className="py-4">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="attractions-calculator-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            בנו חבילת אטרקציות
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            בחרו אטרקציות, אזור האירוע וקבלו מחיר משוער - עם קליפ מתנה מ-4 אטרקציות.
          </p>
        </header>
        <AttractionsCalculatorLazy className="mt-8" />
      </section>

      <ServiceHubLinks
        heading="אטרקציות יוקרתיות"
        subheading="עשן כבד, בועות וקונפטי - אפקט מדויק לרגעי השיא."
        links={getAttractionsHubLinks()}
        headingId="attractions-tracks-heading"
      />
    </ServicePageFromRegistry>
  );
}
