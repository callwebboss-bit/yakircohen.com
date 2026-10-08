import type { Metadata } from "next";
import GiftVoucherBuilder from "@/components/gift-voucher/GiftVoucherBuilder";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { constructMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo/page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

const TITLE = "שובר מתנה להקלטה באולפן: עיצוב והורדה";
const DESCRIPTION =
  "בוחרים חבילה, כותבים למי ומאת מי והודעה אישית, ורואים את השובר מיד. אפשר להוריד אותו כתמונה ולהגיש למקבל/ת.";

export const metadata: Metadata = constructMetadata({
  title: TITLE,
  description: DESCRIPTION,
  slug: "matanot/gift-voucher",
  keywords: ["שובר מתנה", "שובר הקלטה באולפן", "מתנה מוקלטת", "שובר דיגיטלי"],
});

const PAGE_SCHEMA = buildWebPageSchema({
  slug: "/matanot/gift-voucher",
  title: TITLE,
  description: DESCRIPTION,
});

export default function GiftVoucherPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(PAGE_SCHEMA) }}
      />
      <Section
        className="bg-background"
        ariaLabelledby="gift-voucher-title"
        padding="sm"
      >
        <Container>
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מתנות מהאולפן
            </p>
            <h1
              id="gift-voucher-title"
              className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
            >
              שובר מתנה להקלטה באולפן
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              בוחרים חבילה, כותבים כמה מילים אישיות, ורואים את השובר
              בזמן אמת. את התמונה אפשר להוריד ולהעביר למקבל/ת.
            </p>
          </header>
          <div className="mt-12">
            <GiftVoucherBuilder />
          </div>
        </Container>
      </Section>
    </>
  );
}
