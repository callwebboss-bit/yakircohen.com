import Image from "next/image";
import TrackedShopCta from "@/components/seo/TrackedShopCta";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import { SHOP_VOUCHER_FAQ_UI } from "@/lib/data/shop-page";
import {
  buildShopWhatsAppHref,
  SHOP_VOUCHER_FAQ_SCHEMA,
  SHOP_VOUCHER_TIERS,
} from "@/lib/data/shop-vouchers";
import { BLUR_DATA_URL } from "@/lib/blur";
import { cn } from "@/lib/utils";

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
          {SHOP_VOUCHER_TIERS.map((tier) => {
            const waHref = buildShopWhatsAppHref({
              text: `שלום, אשמח לשמוע על ${tier.title} מהחנות באתר`,
              section: "vouchers",
              tier: tier.id,
              campaign: tier.utmCampaign,
              priceExVat: tier.priceExVat,
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
                {/* אותה מסגרת כמו ShopCardImage, אבל unoptimized. בדיקת הלוגו
                    7.10.2026 החליפה את תמונות השוברים (לוגו, ושובר פרימיום בלי
                    ALMOG COHEN) באותם שמות קבצים. מכסת Image Optimization של
                    Hobby מלאה (next.config.ts), וכל גרסה חדשה דרך /_next/image
                    מחזירה 402 ותמונה שבורה. unoptimized מגיש את הקובץ עצמו
                    (webp ‏1200x900, עד כ-100KB), בלי לגעת במכסה. */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={tier.imageSrc}
                    alt={tier.imageAlt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
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
