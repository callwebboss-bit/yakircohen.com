import Link from "next/link";
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className={cn(
              "hover-lift group flex flex-col gap-1 rounded-xl border border-border bg-surface p-4 shadow-sm",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-foreground transition-colors duration-[150ms] group-hover:text-[var(--service-accent,#d42b2b)]">
                {service.title}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-[150ms] group-hover:-translate-x-0.5 rtl:rotate-180"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              {service.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
