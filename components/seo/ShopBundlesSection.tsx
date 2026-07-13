import { ArrowLeft } from "lucide-react";
import TrackedShopCta from "@/components/seo/TrackedShopCta";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { SHOP_BUNDLE_OFFERS } from "@/lib/data/shop-vouchers";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export default function ShopBundlesSection() {
  return (
    <Section
      id="bundles"
      ariaLabelledby="shop-bundles-heading"
      padding="sm"
      className="scroll-mt-24 bg-[#f4f4f2]"
    >
      <Container className="max-w-5xl">
        <div className="mb-12">
          <h2
            id="shop-bundles-heading"
            className="font-serif text-section font-semibold text-foreground"
          >
            חבילות משולבות
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-foreground/70">
            שירות אחד, ספק אחד, תיאום אחד.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SHOP_BUNDLE_OFFERS.map((bundle) => {
            const waHref = buildWhatsAppHref({
              text: `שלום, מעוניין/ת בחבילה: ${bundle.title}`,
              utm_source: "website",
              utm_campaign: bundle.utmCampaign,
            });
            return (
              <li
                key={bundle.id}
                className="hover-lift flex flex-col rounded-xl border-r-4 border-brand-red bg-surface p-8"
              >
                <div className="mb-4">
                  <span className="rounded bg-brand-red px-2 py-1 text-xs font-semibold text-white">
                    {bundle.savingLabel}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {bundle.title}
                </h3>
                <p className="mt-4 mb-8 grow text-sm leading-relaxed text-muted-foreground">
                  {bundle.desc}
                </p>
                <TrackedShopCta
                  href={waHref}
                  campaign={bundle.utmCampaign}
                  section="bundles"
                  className="inline-flex min-h-12 items-center gap-2 font-bold text-brand-red transition-all hover:gap-4"
                >
                  בקשו הצעה
                  <ArrowLeft className="h-5 w-5" aria-hidden />
                </TrackedShopCta>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
