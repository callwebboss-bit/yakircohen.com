import Link from "@/components/ui/IntentLink";
import YouTube from "@/components/YouTube";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";
import PortfolioPlaylistCta from "@/components/marketing/PortfolioPlaylistCta";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  PORTFOLIO_WORKS,
  getPortfolioWorkHref,
  type PortfolioWork,
} from "@/lib/data/portfolio-works";

/**
 * עמוד עבודה: הווידאו הוא התוכן הראשי, ואחריו מה עשינו, קרדיטים, השירות ועבודות נוספות.
 * VideoObject אחד עם תיאור אמיתי. ה-BreadcrumbList מגיע מה-layout.
 */
export default function PortfolioWorkPageContent({ work }: { work: PortfolioWork }) {
  const related = PORTFOLIO_WORKS.filter((w) => w.slug !== work.slug);

  return (
    <>
      <VideoObjectSchema
        videos={[{ videoId: work.videoId, name: work.title, description: work.summary }]}
      />
      <article className="bg-background">
        <Section padding="sm" className="border-b border-border">
          <Container className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מתיק העבודות
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {work.title}
            </h1>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-200">
              <YouTube videoId={work.videoId} title={work.title} fillParent withSchema={false} />
            </div>
          </Container>
        </Section>

        <Section padding="sm">
          <Container className="max-w-3xl space-y-10">
            <section aria-labelledby="work-story-heading">
              <h2 id="work-story-heading" className="font-serif text-2xl font-semibold text-foreground">
                מה עשינו
              </h2>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-foreground">
                {work.story.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </section>

            {work.credits?.length ? (
              <section aria-labelledby="work-credits-heading">
                <h2 id="work-credits-heading" className="font-serif text-2xl font-semibold text-foreground">
                  קרדיטים
                </h2>
                <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                  {work.credits.map((c) => (
                    <div key={c.role + c.name} className="contents">
                      <dt className="font-semibold text-foreground">{c.role}</dt>
                      <dd className="text-muted-foreground">{c.name}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {work.cta ? (
              <PortfolioPlaylistCta cta={work.cta} />
            ) : work.serviceLink ? (
              <p>
                <Link
                  href={work.serviceLink.href}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  {work.serviceLink.label}
                </Link>
              </p>
            ) : null}

            <section aria-labelledby="work-related-heading" className="border-t border-border pt-8">
              <h2 id="work-related-heading" className="font-serif text-xl font-semibold text-foreground">
                עבודות נוספות
              </h2>
              <ul className="mt-4 space-y-1">
                {related.map((w) => (
                  <li key={w.slug}>
                    <Link
                      href={getPortfolioWorkHref(w)}
                      className="inline-flex min-h-11 items-center text-sm text-foreground hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                    >
                      {w.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  לכל תיק העבודות
                </Link>
              </p>
            </section>
          </Container>
        </Section>
      </article>
    </>
  );
}
