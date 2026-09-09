import Link from "next/link";
import { metadataFromService } from "@/lib/data/service-metadata";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import BusinessCrossLink from "@/components/marketing/BusinessCrossLink";
import HowToSchema from "@/components/seo/HowToSchema";
import Container from "@/components/ui/Container";
import { SKEPTICISM_CTA } from "@/lib/data/conversion-copy";
import {
  CORPORATE_VIDEO_DELIVERABLES,
  CORPORATE_VIDEO_FIT,
  CORPORATE_VIDEO_PROCESS,
  CORPORATE_VIDEO_PROOF,
  CORPORATE_VIDEO_RELATED,
} from "@/lib/data/corporate-video-page";
import { getVideoService } from "@/lib/data/services";

const service = getVideoService("video-corporate");

export const metadata = metadataFromService(service);

export default function VideoCorporatePage() {
  return (
    <>
      <HowToSchema
        name="איך מפיקים סרט תדמית לעסק"
        description="תהליך הפקת סרט תדמית - מאפיון מסר עד מסירה לרשתות."
        steps={CORPORATE_VIDEO_PROCESS.map((item) => ({
          name: item.title,
          text: item.body,
        }))}
      />
      <Container className="py-8">
        <BusinessCrossLink
          title="כל הפתרונות לעסקים"
          text="רילז, אולפן בחברה, מיתוג קולי, פודקאסט. הכל במקום אחד."
          href="/business"
          linkLabel="מרכז לעסקים"
        />
      </Container>
      <ServicePageFromRegistry
        service={service}
        portfolioLabel="סרטי תדמית לעסקים"
      >
        <section className="max-w-3xl" aria-labelledby="corp-proof-heading">
          <h2
            id="corp-proof-heading"
            className="text-xl font-semibold text-foreground"
          >
            מה מקבלים בפועל
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {CORPORATE_VIDEO_PROOF}
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {CORPORATE_VIDEO_DELIVERABLES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--service-accent,#d42b2b)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="corp-fit-heading">
          <h2
            id="corp-fit-heading"
            className="text-xl font-semibold text-foreground"
          >
            התאמה ומחיר
          </h2>
          <ul className="mt-6 space-y-3">
            {CORPORATE_VIDEO_FIT.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
              >
                <h3 className="font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="corp-process-heading">
          <h2
            id="corp-process-heading"
            className="text-xl font-semibold text-foreground"
          >
            איך זה עובד
          </h2>
          <ol className="mt-6 space-y-3">
            {CORPORATE_VIDEO_PROCESS.map((item) => (
              <li
                key={item.step}
                className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:gap-5 sm:p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--service-accent,#d42b2b)]/10 text-base font-bold text-[var(--service-accent-ink,#8a1c1c)] sm:h-12 sm:w-12 sm:text-lg">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">{SKEPTICISM_CTA}</p>
        </section>

        <section aria-labelledby="corp-related-heading">
          <h2
            id="corp-related-heading"
            className="text-xl font-semibold text-foreground"
          >
            שירותים קשורים
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {CORPORATE_VIDEO_RELATED.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-12 items-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </ServicePageFromRegistry>
    </>
  );
}
