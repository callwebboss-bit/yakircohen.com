import ShopCardImage from "@/components/seo/ShopCardImage";
import TrackedShopCta from "@/components/seo/TrackedShopCta";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import { SHOP_VOUCHER_FAQ_UI } from "@/lib/data/shop-page";
import {
  SHOP_VOUCHER_FAQ_SCHEMA,
  SHOP_VOUCHER_TIERS,
} from "@/lib/data/shop-vouchers";
import { cn } from "@/lib/utils";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const FAQ_ITEMS: FAQItem[] = SHOP_VOUCHER_FAQ_UI.map((item) => ({
  id: item.id,
  question: item.question,
  answer: item.answer,
}));

export default function ShopVouchersSection() {
  return (
    <>
      <FaqPageSchema
        items={[...SHOP_VOUCHER_FAQ_UI, ...SHOP_VOUCHER_FAQ_SCHEMA]}
      />
      <section
        id="vouchers"
        aria-labelledby="shop-vouchers-heading"
        className="scroll-mt-24"
      >
        <div className="mb-12">
          <h2
            id="shop-vouchers-heading"
            className="font-serif text-section font-semibold text-foreground"
          >
            שוברי מתנה
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
            שובר דיגיטלי או מודפס. מתאים לאולפן, אטרקציות או מתנה ליום הולדת וחתונה.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SHOP_VOUCHER_TIERS.map((tier, index) => {
            const waHref = buildWhatsAppHref({
              text: `שלום, אשמח לשמוע על ${tier.title} מהחנות באתר`,
              utm_source: "website",
              utm_campaign: tier.utmCampaign,
            });
            return (
              <li
                key={tier.id}
                className={cn(
                  "hover-lift relative flex h-full flex-col overflow-hidden rounded-xl border bg-surface",
                  tier.popular ? "border-brand-red" : "border-border",
                )}
              >
                {tier.popular ? (
                  <span className="absolute top-4 right-4 z-10 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-white">
                    פופולרי
                  </span>
                ) : null}
                <ShopCardImage
                  src={tier.imageSrc}
                  alt={tier.imageAlt}
                  priority={index === 0}
                />
                <div className="flex grow flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {tier.title}
                    </h3>
                    <span className="shrink-0 font-bold text-brand-red">
                      {tier.range}
                    </span>
                  </div>
                  <p className="mb-8 grow text-sm leading-relaxed text-muted-foreground">
                    {tier.desc}
                  </p>
                  <TrackedShopCta
                    href={waHref}
                    campaign={tier.utmCampaign}
                    section="vouchers"
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-brand-red px-4 py-3 text-sm font-medium text-brand-red transition-colors hover:bg-brand-red hover:text-white"
                  >
                    בקשו הצעה
                  </TrackedShopCta>
                </div>
              </li>
            );
          })}
        </ul>

        <FAQAccordion
          className="mx-auto mt-16 max-w-3xl"
          title=""
          subtitle=""
          items={FAQ_ITEMS}
        />
      </section>
    </>
  );
}
