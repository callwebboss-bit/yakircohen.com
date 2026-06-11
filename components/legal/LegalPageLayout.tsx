import type { ReactNode } from "react";
import Link from "next/link";
import LegalRelatedLinks from "@/components/legal/LegalRelatedLinks";
import LegalTrustBlock from "@/components/legal/LegalTrustBlock";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { FOOTER_LEGAL_LINKS, SITE_KICKER, type LegalPageHref } from "@/lib/constants";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

export type LegalPageLayoutProps = {
  title: string;
  intro: string;
  updatedLabel: string;
  sections: LegalSection[];
  currentHref?: LegalPageHref;
};

const chipClass =
  "inline-flex min-h-11 items-center rounded-full border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

export default function LegalPageLayout({
  title,
  intro,
  updatedLabel,
  sections,
  currentHref,
}: LegalPageLayoutProps) {
  return (
    <div className="bg-background">
      <header className="border-b border-border bg-surface">
        <Container className="max-w-3xl py-12 sm:py-14">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            {SITE_KICKER}
          </p>
          <h1 className="text-hero mt-4 font-serif font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">{intro}</p>
          <p className="mt-6 text-xs text-muted-foreground">{updatedLabel}</p>
          <nav className="mt-8" aria-label="תוכן העמוד">
            <ul className="flex flex-wrap gap-2 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={chipClass}>
                    {section.title}
                  </a>
                </li>
              ))}
              {FOOTER_LEGAL_LINKS.filter((item) => item.href !== currentHref).map(
                (item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={chipClass}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              <li>
                <Link href="/contact" className={chipClass}>
                  צור קשר
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </header>

      <Section padding="sm">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="border-b border-border pb-12 last:border-0"
                aria-labelledby={`${section.id}-heading`}
              >
                <h2
                  id={`${section.id}-heading`}
                  className="font-serif text-section-title font-semibold text-foreground"
                >
                  {section.title}
                </h2>
                <div className="prose-legal mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pe-6 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pe-6">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <LegalRelatedLinks currentHref={currentHref} />
          <LegalTrustBlock />
        </Container>
      </Section>
    </div>
  );
}
