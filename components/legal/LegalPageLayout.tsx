import type { ReactNode } from "react";
import Link from "next/link";
import { FOOTER_LEGAL_LINKS, SITE_KICKER } from "@/lib/constants";
import LegalRelatedLinks from "@/components/legal/LegalRelatedLinks";
import LegalTrustBlock from "@/components/legal/LegalTrustBlock";
import { type LegalPageHref } from "@/lib/constants";

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
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            {SITE_KICKER}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
          <p className="mt-6 text-xs text-muted-foreground">{updatedLabel}</p>
          <nav className="mt-8" aria-label="תוכן העמוד">
            <ul className="flex flex-wrap gap-2 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
              {FOOTER_LEGAL_LINKS.filter((item) => item.href !== currentHref).map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              <li>
                <Link
                  href="/contact"
                  className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
                >
                  צור קשר
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 border-b border-border pb-12 last:border-0"
              aria-labelledby={`${section.id}-heading`}
            >
              <h2
                id={`${section.id}-heading`}
                className="text-xl font-semibold text-foreground sm:text-2xl"
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
      </div>
    </div>
  );
}
