import Link from "next/link";
import { PRO_SERVICES } from "@/lib/data/pro-services";
import { getExVat } from "@/lib/data/pricing-catalog";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export default function ProBookingPanel() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        בחרו שירות B2B — כל עמוד כולל ויזארד AI להצעת מחיר. או פנו בוואטסאפ לחבילה מותאמת.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {PRO_SERVICES.map((svc) => {
          const wa = buildWhatsAppHref({
            text: svc.whatsappIntro,
            utm_source: "website",
            utm_campaign: `${svc.utmCampaign}_book`,
          });
          return (
            <li
              key={svc.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <span className="text-lg" aria-hidden>
                {svc.icon}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-foreground">{svc.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                מ-{getExVat(svc.pricingId).toLocaleString("he-IL")} ₪ + מע״מ
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={svc.path}
                  className="text-xs font-semibold text-brand-red hover:underline"
                >
                  ויזארד AI ←
                </Link>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-muted-foreground hover:text-brand-red"
                >
                  וואטסאפ
                </a>
              </div>
            </li>
          );
        })}
      </ul>
      <Link
        href="/pro"
        className="inline-block text-sm font-medium text-brand-red hover:underline"
      >
        מרכז B2B Pro — סקירה מלאה
      </Link>
    </div>
  );
}
