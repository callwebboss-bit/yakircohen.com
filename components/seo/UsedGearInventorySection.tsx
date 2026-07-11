import { Send } from "lucide-react";
import ShopCardImage from "@/components/seo/ShopCardImage";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import {
  SHOP_GEAR_ITEMS,
  SHOP_GEAR_TRANSPARENCY,
} from "@/lib/data/shop-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const WHATSAPP_TEXT =
  "שלום, הגעתי מעמוד הציוד בחנות באתר ואשמח לפרטים על...";

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

export default function UsedGearInventorySection() {
  const whatsappHref = buildWhatsAppHref({
    text: WHATSAPP_TEXT,
    utm_source: "website",
    utm_campaign: "shop_used_gear_cta",
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
          כל פריט יצא מהפקות שלנו ועבר בדיקת תקינות מחמירה.
        </p>
      </div>

      <ul className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {SHOP_GEAR_ITEMS.map((item) => {
          const waHref = buildWhatsAppHref({
            text: `שלום, הגעתי מעמוד הציוד בחנות. מעוניין/ת ב${item.title}.`,
            utm_source: "website",
            utm_campaign: `shop_gear_${item.id}`,
          });

          if (item.placeholder) {
            return (
              <li key={item.id}>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-lift flex h-full min-h-[280px] flex-col justify-center rounded-xl border border-dashed border-border bg-[#f4f4f2] p-8 transition-colors hover:border-brand-red/40"
                >
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                  <span className="mt-4 font-bold text-brand-red">
                    צפו במלאי
                  </span>
                </a>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <ShopCardImage
                  src={item.imageSrc!}
                  alt={item.imageAlt}
                  className="mb-4 rounded-xl"
                  hoverScale
                />
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              </a>
            </li>
          );
        })}
      </ul>

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
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto inline-flex min-h-12 items-center justify-center gap-4 rounded-xl bg-brand-red px-12 py-5 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105"
            aria-label="שלחו הודעה בוואטסאפ לקבלת פרטים על ציוד למכירה"
          >
            <span>שלחו הודעה בוואטסאפ</span>
            <Send className="h-6 w-6" aria-hidden />
          </a>
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
