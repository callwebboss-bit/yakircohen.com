import Link from "next/link";

export type HubLinkItem = {
  href: string;
  title: string;
  description: string;
  badge?: string;
};

export type ServiceHubLinksProps = {
  heading: string;
  subheading: string;
  links: readonly HubLinkItem[];
  headingId: string;
};

export default function ServiceHubLinks({
  heading,
  subheading,
  links,
  headingId,
}: ServiceHubLinksProps) {
  return (
    <section aria-labelledby={headingId}>
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id={headingId}
          className="font-serif text-section-title font-semibold text-foreground"
        >
          {heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {subheading}
        </p>
      </header>
      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((track) => (
          <li key={track.href}>
            <Link
              href={track.href}
              className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 hover-lift focus-within:border-[var(--service-accent,#d42b2b)]/40 focus-within:shadow-md"
            >
              {track.badge ? (
                <span className="mb-3 w-fit rounded-full border border-[var(--service-accent,#d42b2b)]/40 bg-[var(--service-accent,#d42b2b)]/10 px-3 py-1 text-[0.65rem] font-semibold text-[var(--service-accent,#d42b2b)]">
                  {track.badge}
                </span>
              ) : null}
              <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-[var(--service-accent,#d42b2b)]">
                {track.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {track.description}
              </p>
              <span className="mt-4 text-xs font-semibold text-[var(--service-accent,#d42b2b)]">לפרטים ←</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
