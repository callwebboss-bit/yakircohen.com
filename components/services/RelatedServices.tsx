import ServiceCard from "@/components/marketing/ServiceCard";
import { resolveHubLinkIcon } from "@/components/services/ServiceHubLinks";
import { cn } from "@/lib/utils";

export type RelatedService = {
  title: string;
  href: string;
  description: string;
};

export type RelatedServicesProps = {
  services: [RelatedService, RelatedService, RelatedService];
  heading?: string;
  className?: string;
};

export default function RelatedServices({
  services,
  heading = "שירותים קשורים",
  className,
}: RelatedServicesProps) {
  return (
    <section
      aria-label={heading}
      className={cn("border-t border-border py-8", className)}
    >
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {heading}
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {services.map((service) => (
          <li key={service.href} className="h-full">
            <ServiceCard
              title={service.title}
              description={service.description}
              href={service.href}
              icon={resolveHubLinkIcon(service.href)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
