import Link from "next/link";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import AudioShowcase from "@/components/seo/AudioShowcase";
import ClientMaterialsLiabilityBanner from "@/components/seo/ClientMaterialsLiabilityBanner";
import {
  getAudioDemo,
  SEVERE_RESTORATION_DISCLAIMER,
} from "@/lib/data/audio-demos";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { buildPricingOffersSchema } from "@/lib/seo/page-schema";
import { absoluteUrl } from "@/lib/site-url";
import { buildWhatsAppHref } from "@/lib/whatsapp";

function NoiseIcon() {
  return (
    <svg className="h-6 w-6 text-brand-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V5.25A2.25 2.25 0 0 1 11.25 3h1.5A2.25 2.25 0 0 1 15 5.25v13.5A2.25 2.25 0 0 1 12.75 21h-1.5A2.25 2.25 0 0 1 9 18.75V15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5h1.5M6 13.5h1.5M17.25 10.5H18.75M17.25 13.5H18.75" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg className="h-6 w-6 text-brand-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
    </svg>
  );
}

function EnhanceIcon() {
  return (
    <svg className="h-6 w-6 text-brand-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg className="h-6 w-6 text-brand-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}

const AI_SERVICES = [
  {
    id: "episode",
    name: "חבילת פרק שלם",
    icon: <PackageIcon />,
    exVat: null as number | null,
    billingType: "per-episode" as const,
    deliverables: [
      "עריכה מלאה של פרק",
      "שיפור AI + ניקוי",
      "כתוביות (אופציונלי)",
      "מסירה מוכנה להעלאה",
    ],
    note: "עריכה + AI + מסירה מוכנה להעלאה",
    whatsappText: "שלום, אשמח לקבל הצעת מחיר לחבילת פרק שלם",
    ctaHref: "/book#podcast",
    ctaLabel: "הזמנה מקוונת",
  },
  {
    id: "ai_voice_enhance",
    name: "שיפור קול חכם",
    icon: <EnhanceIcon />,
    exVat: getExVat("ai_voice_enhance"),
    billingType: "one-time" as const,
    deliverables: [
      "הבהרת קול ונוכחות",
      "עקביות בין קטעים",
      "מותאם לפודקאסט וראיונות",
      "קובץ מוכן לפרסום",
    ],
    note: "הבהרה, נוכחות ועקביות לפודקאסט",
    whatsappText: "שלום, אשמח לקבל הצעת מחיר לשיפור קול חכם",
    ctaHref: null,
    ctaLabel: "קבלו הצעה בוואטסאפ",
  },
  {
    id: "ai_voice_restore",
    name: "שחזור קול מלא",
    icon: <RestoreIcon />,
    exVat: getExVat("ai_voice_restore"),
    billingType: "one-time" as const,
    deliverables: [
      "ניקוי רעשים מתקדם",
      "איזון EQ ודחיסה עדינה",
      "שחזור הקלטות פגומות",
      "עד שעת חומר גולמי",
    ],
    note: "פרק או ראיון עד שעה - ניקוי + איזון",
    whatsappText: "שלום, אשמח לקבל הצעת מחיר לשחזור קול מלא",
    ctaHref: null,
    ctaLabel: "קבלו הצעה בוואטסאפ",
  },
  {
    id: "ai_noise_basic",
    name: "ניקוי רעשים בסיסי",
    icon: <NoiseIcon />,
    exVat: getExVat("ai_noise_basic"),
    billingType: "one-time" as const,
    deliverables: [
      "הסרת רעש קבוע (מזגן, רקע)",
      "נורמליזציה בסיסית",
      "קובץ WAV או MP3 מוכן",
    ],
    note: "להקלטות קצרות עם רעש קבוע",
    whatsappText: "שלום, אשמח לקבל הצעת מחיר לניקוי רעשים בסיסי",
    ctaHref: null as string | null,
    ctaLabel: "קבלו הצעה בוואטסאפ",
  },
] as const;

function formatServicePrice(exVat: number | null): string {
  if (exVat === null) return "לפי הצעה";
  return formatFromPriceDual(exVat).replace("כרגע: ", "החל ");
}

function ServiceCta({
  service,
}: {
  service: (typeof AI_SERVICES)[number];
}) {
  const href =
    service.ctaHref ??
    buildWhatsAppHref({
      text: service.whatsappText,
      utm_source: "website",
      utm_campaign: "online_ai_pricing",
    });

  const isExternal = !service.ctaHref;

  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-red px-4 py-2 text-xs font-semibold text-white touch-press hover:bg-brand-red-light active:bg-brand-red-dark"
    >
      {service.ctaLabel} </a>
  );
}

function ServiceRow({ service }: { service: (typeof AI_SERVICES)[number] }) {
  return (
    <>
      {/* Desktop table row */}
      <tr className="hidden border-b border-border last:border-0 md:table-row">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            {service.icon}
            <span className="font-medium text-foreground">{service.name}</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <ul className="space-y-1 text-xs text-muted-foreground">
            {service.deliverables.map((d) => (
              <li key={d} className="flex gap-1.5">
                <span className="text-brand-red" aria-hidden>✓</span>
                {d}
              </li>
            ))}
          </ul>
        </td>
        <td className="px-4 py-4 font-bold text-brand-red tabular-nums">
          {formatServicePrice(service.exVat)}
        </td>
        <td className="px-4 py-4">
          <ServiceCta service={service} />
        </td>
      </tr>

      {/* Mobile card */}
      <tr className="md:hidden">
        <td colSpan={4} className="p-0">
          <article
            className="border-b border-border p-4 last:border-0"
            data-billing-type={service.billingType}
            data-package-id={service.id}
            itemScope
            itemType="https://schema.org/Offer"
          >
            <div className="flex items-center gap-3">
              {service.icon}
              <h3 className="font-semibold text-foreground">{service.name}</h3>
            </div>
            <p className="mt-2 text-sm font-bold text-brand-red">
              {formatServicePrice(service.exVat)}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {service.deliverables.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-brand-red" aria-hidden>✓</span>
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">{service.note}</p>
            <div className="mt-4">
              <ServiceCta service={service} />
            </div>
          </article>
        </td>
      </tr>
    </>
  );
}

export default function OnlineAiPricingPageContent() {
  const restorationDemo = getAudioDemo("weber-restoration");
  const pageUrl = absoluteUrl("online/online-ai-pricing");
  const pricingOffersSchema = buildPricingOffersSchema(
    pageUrl,
    AI_SERVICES.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.note,
      priceExVat: service.exVat,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingOffersSchema) }}
      />
    <ServicePageLayout
      category="ai"
      pagePath="/online/online-ai-pricing"
      title="מחירון שירותי AI מקוונים"
      subtitle="תמחור שקוף לעריכה ושחזור קול מרחוק - המחיר הסופי תלוי באורך ההקלטה ובמצב הקובץ."
      features={[
        "הצעת מחיר לפני תחילת עבודה",
        "ללא התחייבות אחרי ייעוץ ראשון",
        "מסירה דיגיטלית בפורמט שאתם צריכים",
      ]}
      whatsappText="שלום, אשמח לקבל הצעת מחיר לשירותי AI"
      utmCampaign="online_ai_pricing"
      corporateShareLabel="שירותי AI מקוונים"
      bookSlug="online/online-ai-pricing"
    >
      <div className="mx-auto max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          המחירים להמחשה - שולחים דוגמת קובץ בוואטסאפ ומקבלים הצעה מדויקת תוך יום עסקים.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-border bg-surface text-right">
                <th className="px-4 py-3 font-semibold text-foreground">שירות</th>
                <th className="px-4 py-3 font-semibold text-foreground">מה מקבלים</th>
                <th className="px-4 py-3 font-semibold text-foreground">מחיר התחלתי</th>
                <th className="px-4 py-3 font-semibold text-foreground">פעולה</th>
              </tr>
            </thead>
            <tbody>
              {AI_SERVICES.map((row) => (
                <ServiceRow key={row.id} service={row} />
              ))}
            </tbody>
          </table>
        </div>

        <ClientMaterialsLiabilityBanner className="mt-8" />

        <section className="mt-12" aria-labelledby="ai-pricing-demo-heading">
          <h2
            id="ai-pricing-demo-heading"
            className="text-lg font-semibold text-foreground"
          >
            דוגמת שחזור - הקלטה פגומה
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            רלוונטי לשחזור קול, הצלת הקלטות פגומות ועריכת פודקאסט. שחזור כזה
            אפשרי - אבל קשה, ותלוי מאוד באיכות המקור.
          </p>
          <div className="mt-6 max-w-2xl">
            <div
              className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-foreground dark:border-amber-900/50 dark:bg-amber-950/30"
              role="note"
            >
              <p className="font-medium text-amber-900 dark:text-amber-100">
                חשוב לדעת לפני שמאזינים
              </p>
              <p className="mt-1 text-muted-foreground">
                {SEVERE_RESTORATION_DISCLAIMER}
              </p>
            </div>
            <AudioShowcase
              variant="restoration"
              context="page"
              beforeSrc={restorationDemo.beforeSrc}
              afterSrc={restorationDemo.afterSrc}
              beforeLabel={restorationDemo.beforeLabel}
              afterLabel={restorationDemo.afterLabel}
              storageKey={restorationDemo.storageKey}
              beforeNote={restorationDemo.beforeNote}
              afterNote={restorationDemo.afterNote}
            />
          </div>
        </section>

        <p className="mt-8 text-sm text-muted-foreground">
          לעריכה מלאה של פודקאסט ראו גם{" "}
          <Link href="/podcast/podcast-editing" className="text-brand-red hover:underline">
            עריכת פודקאסט
          </Link>{" "}
          ו
          <Link href="/online" className="text-brand-red hover:underline">
            {" "}
            מרכז השירותים המקוונים
          </Link>
          .
        </p>
      </div>
    </ServicePageLayout>
    </>
  );
}
