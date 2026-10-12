import Link from "@/components/ui/IntentLink";
import HubPageSchema from "@/components/seo/HubPageSchema";
import PortfolioCategoryNav from "@/components/seo/PortfolioCategoryNav";
import PortfolioSectionBlock from "@/components/seo/PortfolioSectionBlock";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import FAQAccordion from "@/components/ui/FAQAccordion";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import {
  PORTFOLIO_FAQS,
  PORTFOLIO_GROUPS,
  getPortfolioGroupElementId,
  getPortfolioSectionElementId,
  getPortfolioSectionVideos,
} from "@/lib/data/portfolio-structure";
import { PORTFOLIO_CATALOG_COUNT } from "@/lib/data/video-catalog.generated";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  PORTFOLIO_HUB_SEO,
} from "@/lib/seo/hub-pages";

export const portfolioMetadata = metadataForHubSeo(PORTFOLIO_HUB_SEO);

/* שלב ב (12.10.2026): ניווט לפי ארבע הקבוצות, ובתוך כל קבוצה קישורים לתתי-הקטגוריות */
const NAV_ITEMS = PORTFOLIO_GROUPS.map((group) => ({
  id: getPortfolioGroupElementId(group),
  label: group.label,
}));

export default function PortfolioPageContent() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(PORTFOLIO_HUB_SEO)} />
      <FaqPageSchema items={PORTFOLIO_FAQS.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="bg-background">
        <Section padding="sm" className="relative overflow-hidden border-b border-border">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
            aria-hidden
          />
          <Container className="relative max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              תיק וידאו
            </p>
            <h1 className="text-hero mt-4 font-serif font-semibold text-foreground">
              תיק עבודות וידאו
            </h1>
            <p className="text-lead mt-4 text-muted-foreground">
              {PORTFOLIO_CATALOG_COUNT} סרטונים מהאולפן, מהאירועים ומהפודקאסטים, מסודרים לפי
              מה שמחפשים: אירוע ומתנה, מוזיקאים, עסקים ופודקאסט. בכל נושא 3 דוגמאות
              נבחרות, ושאר הסרטונים ברשימה מתחתיהן.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button as="link" href="/studio">
                לאולפן ההקלטות
              </Button>
              <Button as="link" href="/book" variant="secondary">
                הזמנה מקוונת
              </Button>
              <Button as="link" href="/gallery" variant="secondary">
                גלריית תמונות
              </Button>
            </div>
          </Container>
        </Section>

        <PortfolioCategoryNav items={NAV_ITEMS} />

        <Section padding="sm">
          <Container className="space-y-24">
            {PORTFOLIO_GROUPS.map((group) => {
              const groupId = getPortfolioGroupElementId(group);
              const sections = group.sections.filter(
                (section) => getPortfolioSectionVideos(section).length > 0,
              );
              return (
                <section
                  key={group.id}
                  id={groupId}
                  className="scroll-mt-24"
                  aria-labelledby={`${groupId}-heading`}
                >
                  <header className="border-b border-border pb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                      {group.label}
                    </p>
                    <h2
                      id={`${groupId}-heading`}
                      className="mt-2 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                    >
                      {group.heading}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {group.intro}
                    </p>
                    {sections.length > 1 ? (
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`נושאים ב${group.label}`}>
                        {sections.map((section) => (
                          <li key={section.id}>
                            <a
                              href={`#${getPortfolioSectionElementId(section)}`}
                              className="inline-flex min-h-11 items-center rounded-full border border-border px-3 text-xs font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                            >
                              {section.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </header>
                  <div className="mt-10 space-y-16">
                    {sections.map((section) => (
                      <PortfolioSectionBlock key={section.id} section={section} />
                    ))}
                  </div>
                </section>
              );
            })}

            <p className="text-center text-sm text-muted-foreground">
              טיפים מהאולפן על הקלטה, מיקס וציוד נמצאים ב
              <Link
                href="/academy#studio-tips"
                className="font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                אקדמיה
              </Link>
              .
            </p>
          </Container>
        </Section>

        <FAQAccordion
          className="border-t border-border"
          title="שאלות על תיק העבודות"
          items={PORTFOLIO_FAQS.map((f) => ({ ...f }))}
        />
      </div>
    </>
  );
}
