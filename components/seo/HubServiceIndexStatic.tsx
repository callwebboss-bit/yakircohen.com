import Link from "next/link";
import { cn } from "@/lib/utils";

export type HubServiceIndexLink = {
  href: string;
  title: string;
  description: string;
  startingPrice?: string;
};

type HubServiceIndexStaticProps = {
  links: readonly HubServiceIndexLink[];
  heading?: string;
  className?: string;
  /** Crawlable compact index without changing visible hub layout */
  srOnly?: boolean;
};

/** Server-rendered service index for hub SEO (title, description, starting price). */
export default function HubServiceIndexStatic({
  links,
  heading = "שירותים בקטגוריה",
  className,
  srOnly = true,
}: HubServiceIndexStaticProps) {
  if (!links.length) return null;

  return (
    <section
      className={cn(srOnly ? "sr-only" : undefined, className)}
      aria-label={heading}
    >
      <h2>{heading}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <article>
              <h3>
                <Link href={link.href}>{link.title}</Link>
              </h3>
              <p>{link.description}</p>
              {link.startingPrice ? (
                <p>החל מ-{link.startingPrice}</p>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
