import Link from "next/link";
import ProductionCalculator from "@/components/marketing/ProductionCalculator";
import StudioGearRoom from "@/components/marketing/StudioGearRoom";
import StudioHubValueSection from "@/components/seo/StudioHubValueSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import ShareButton from "@/components/ui/ShareButton";
import SmartMap from "@/components/ui/SmartMap";
import {
  getStudioHubLinks,
  getStudioService,
  metadataFromService,
} from "@/lib/data/services";

const service = getStudioService("studio-hub");

export const metadata = metadataFromService(service);

const STUDIO_PRICING_LINK = {
  href: "/studio/pricing",
  title: "מחירון חבילות",
  description: "שקיפות מלאה - שעת אולפן, חבילת שיר והפקת סינגל.",
} as const;

export default function StudioHubPage() {
  const hubLinks = getStudioHubLinks();

  return (
    <ServicePageFromRegistry service={service} portfolioLabel="סביבת האולפן">
      <div className="space-y-16">
        <StudioHubValueSection />

        <section aria-labelledby="studio-tracks-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="studio-tracks-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שירותי האולפן
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              בחרו מסלול ממוקד או שלבו מספר שירותים לחבילה מותאמת אישית.
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[STUDIO_PRICING_LINK, ...hubLinks].map((track) => (
              <li key={track.href}>
                <Link
                  href={track.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-brand-red">
                    {track.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {track.description}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-brand-red">
                    לפרטים ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ProductionCalculator className="py-0" />

        <StudioGearRoom />

        <section
          className="rounded-2xl border border-border bg-surface px-6 py-8 text-center sm:px-10"
          aria-labelledby="studio-geo-note"
        >
          <h2
            id="studio-geo-note"
            className="text-lg font-semibold text-foreground"
          >
            ממודיעין לירושלים והמרכז
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            האולפן ממוקם במודיעין עם נגישות מהירה מירושלים, השפלה והמרכז. חנייה
            נוחה, תיאום גמיש ושירות מקצועי לכל פרויקט.
          </p>
          <SmartMap
            address="עמק איילון 34, מודיעין-מכבים-רעות"
            googleMapsUrl="https://maps.google.com/maps?q=עמק+איילון+34+מודיעין&output=embed"
            className="mt-6 text-start"
          />
          <div className="mt-5 flex justify-center">
            <ShareButton title="אולפן הקלטות מקצועי | יקיר כהן הפקות" />
          </div>
        </section>
      </div>
    </ServicePageFromRegistry>
  );
}
