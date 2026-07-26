import { Send } from "lucide-react";
import ShopCardImage from "@/components/seo/ShopCardImage";
import TrackedShopCta from "@/components/seo/TrackedShopCta";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import {
  getDjShopGearItems,
  SHOP_GEAR_ITEMS,
  SHOP_GEAR_TRANSPARENCY,
  type ShopGearItem,
} from "@/lib/data/shop-page";
import { buildShopWhatsAppHref } from "@/lib/data/shop-vouchers";

const USED_GEAR_RELATED = [
  {
    href: "/studio",
    title: "אולפן הקלטות",
    description: "הקלטת שיר, ברכות ופודקאסט במודיעין.",
  },
  {
    href: "/events/dj-events",
    title: "DJ לאירועים",
    description: "תקליטן עם ציוד מהמלאי שאנחנו מוכרים כאן.",
  },
  {
    href: "/events/equipment",
    title: "השכרת הגברה",
    description: "מערכות הגברה לאירועים קטנים ובינוניים.",
  },
  {
    href: "/events/attractions",
    title: "אטרקציות לאירוע",
    description: "עשן כבד, זיקוקים קרים ובועות עם מפעיל.",
  },
] as const;

function GearCard({ item }: { item: ShopGearItem }) {
  const waHref = buildShopWhatsAppHref({
    text: `שלום, הגעתי מעמוד הציוד בחנות. מעוניין/ת ב${item.title} (${item.model}). מחיר בשיחה.`,
    section: "used-gear",
    tier: item.id,
    campaign: `shop_gear_${item.id}`,
  });

  return (
    <li>
      <TrackedShopCta
        href={waHref}
        campaign={`shop_gear_${item.id}`}
        section="used-gear"
        className="group block text-start"
        aria-label={`${item.title} - שליחה בוואטסאפ`}
      >
        <ShopCardImage
          src={item.imageSrc}
          alt={item.imageAlt}
          className="mb-4 rounded-xl"
          hoverScale
        />
        <h3 className="font-serif text-xl font-semibold text-foreground">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
        <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-foreground">דגם:</dt>
            <dd>{item.model}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-foreground">מצב:</dt>
            <dd>{item.condition}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-foreground">מחיר:</dt>
            <dd>{item.priceLabel}</dd>
          </div>
        </dl>
        <span className="mt-4 inline-flex min-h-12 items-center text-sm font-semibold text-brand-red">
          פנייה בוואטסאפ
        </span>
      </TrackedShopCta>
    </li>
  );
}

export default function UsedGearInventorySection() {
  const whatsappHref = buildShopWhatsAppHref({
    text: "שלום, הגעתי מעמוד הציוד בחנות באתר ואשמח לפרטים על מלאי יד שנייה",
    section: "used-gear",
    tier: "general",
    campaign: "shop_used_gear_cta",
  });
  const djItems = getDjShopGearItems();
  const djWhatsappHref = buildShopWhatsAppHref({
    text: "שלום, מחפש ציוד DJ יד שנייה מהמחסן (עמדות / אביזרים). מחיר בשיחה.",
    section: "dj-used-gear",
    tier: "general",
    campaign: "shop_dj_used_gear_cta",
  });

  return (
    <section
      id="used-gear"
      aria-labelledby="used-gear-heading"
      className="scroll-mt-24"
    >
      <div className="mb-12">
        <h2
          id="used-gear-heading"
          className="font-serif text-section font-semibold text-foreground"
        >
          ציוד יד שנייה
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          כל פריט יצא מהפקות שלנו ועבר בדיקת תקינות. המחיר בשיחה.
        </p>
      </div>

      <ul className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {SHOP_GEAR_ITEMS.map((item) => (
          <GearCard key={item.id} item={item} />
        ))}
      </ul>

      <section
        id="dj-used-gear"
        aria-labelledby="dj-used-gear-heading"
        className="mb-16 scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <h2
          id="dj-used-gear-heading"
          className="font-serif text-2xl font-semibold text-foreground sm:text-3xl"
        >
          ציוד יד-2 לתקליטנים
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          עמדות ואביזרים לתקליטנים. דגם, מצב הציוד ומחיר בשיחה - פנייה ישירה בוואטסאפ.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {djItems.map((item) => (
            <GearCard key={`dj-${item.id}`} item={item} />
          ))}
        </ul>
        <div className="mt-8 text-center">
          <TrackedShopCta
            href={djWhatsappHref}
            campaign="shop_dj_used_gear_cta"
            section="dj-used-gear"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-brand-red px-8 py-4 text-base font-semibold text-white"
            aria-label="פנייה בוואטסאפ לציוד DJ יד שנייה"
          >
            <span>פנייה לציוד DJ</span>
            <Send className="h-5 w-5" aria-hidden />
          </TrackedShopCta>
        </div>
      </section>

      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-surface p-8 text-center md:p-12">
        <p className="font-serif text-lg leading-relaxed text-foreground">
          {SHOP_GEAR_TRANSPARENCY}
        </p>
      </div>

      <div className="relative mt-16 overflow-hidden rounded-2xl border-2 border-brand-red bg-surface p-12 text-center">
        <div className="relative z-10">
          <h3 className="font-serif text-section font-semibold text-foreground">
            לפרטים על ציוד
          </h3>
          <p className="mx-auto mt-4 mb-10 max-w-xl text-base leading-relaxed text-muted-foreground">
            לבדיקת מלאי עדכני ותיאום פגישה להדגמה אצלנו בסטודיו, שלחו לנו הודעה
            ונענה במהירות.
          </p>
          <TrackedShopCta
            href={whatsappHref}
            campaign="shop_used_gear_cta"
            section="used-gear"
            className="mx-auto inline-flex min-h-12 items-center justify-center gap-4 rounded-xl bg-brand-red px-12 py-5 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105"
            aria-label="שלחו הודעה בוואטסאפ לקבלת פרטים על ציוד למכירה"
          >
            <span>שלחו הודעה בוואטסאפ</span>
            <Send className="h-6 w-6" aria-hidden />
          </TrackedShopCta>
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-brand-red/5 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      <div className="mt-16">
        <ServiceHubLinks
          headingId="used-gear-related-heading"
          heading="שירותים קשורים לציוד"
          subheading="ציוד שמשלים את מה שאנחנו מפעילים באירועים ובאולפן."
          links={USED_GEAR_RELATED}
          columns={2}
        />
      </div>
    </section>
  );
}
