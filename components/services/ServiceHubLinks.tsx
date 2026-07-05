import type { ReactNode } from "react";
import ServiceCard from "@/components/marketing/ServiceCard";
import type { BadgeVariant } from "@/components/marketing/ServiceCard";
import {
  CalendarIcon,
  LinkIcon,
  MicIcon,
  MusicIcon,
  RadioIcon,
  SparklesIcon,
  VideoIcon,
  ZapIcon,
} from "@/components/ui/Icons";

export type HubLinkItem = {
  href: string;
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  isAiService?: boolean;
  isFeatured?: boolean;
  icon?: ReactNode;
  /** תווית קהל - "מתאים ל:" */
  suitedFor?: string;
  descriptionFull?: string;
  ctaLabel?: string;
  external?: boolean;
  /** מחיר התחלה, למשל "החל מ-590 ₪ + מע״מ" */
  fromPrice?: string;
};

export type ServiceHubLinksProps = {
  heading: string;
  subheading: ReactNode;
  links: readonly HubLinkItem[];
  headingId: string;
  /** עמודות בגריד - ברירת מחדל 3 לרוב ה-hubs */
  columns?: 2 | 3 | 4;
};

export function resolveHubLinkIcon(href: string): ReactNode {
  if (href.includes("/online")) {
    return <ZapIcon size={22} />;
  }
  if (href.includes("/podcast")) {
    return <RadioIcon size={22} />;
  }
  if (href.includes("/voiceover")) {
    return <MicIcon size={22} />;
  }
  if (href.includes("/dj")) {
    return <MicIcon size={22} />;
  }
  if (href.includes("/video")) {
    return <VideoIcon size={22} />;
  }
  if (href.includes("/photography")) {
    return <VideoIcon size={22} />;
  }
  if (href.includes("/studio")) {
    return <MusicIcon size={22} />;
  }
  if (href.includes("/book")) {
    return <CalendarIcon size={22} />;
  }
  if (href.includes("/events")) {
    return <SparklesIcon size={22} />;
  }
  return <LinkIcon size={22} />;
}

const GRID_COLS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function ServiceHubLinks({
  heading,
  subheading,
  links,
  headingId,
  columns = 3,
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
        <div
          className="mx-auto mt-3 h-1 w-12 rounded-full bg-brand-red"
          aria-hidden="true"
        />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {subheading}
        </p>
      </header>
      <ul
        className={`mt-10 grid grid-cols-1 gap-6 ${GRID_COLS[columns]}`}
      >
        {links.map((track) => (
          <li key={track.href} className="h-full">
            <ServiceCard
              title={track.title}
              description={track.description}
              descriptionFull={track.descriptionFull}
              href={track.href}
              icon={track.icon ?? resolveHubLinkIcon(track.href)}
              badge={track.badge}
              badgeVariant={track.badgeVariant ?? (track.badge ? "red" : undefined)}
              isAiService={track.isAiService}
              isFeatured={track.isFeatured}
              suitedFor={track.suitedFor}
              fromPrice={track.fromPrice}
              ctaLabel={track.ctaLabel}
              external={track.external}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
