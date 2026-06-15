"use client";

import Link from "next/link";
import {
  getBundleSaving,
  getBundleRetailTotal,
  MASHUP_BUNDLE_OFFERS,
} from "@/lib/data/mashup-bundle-pricing";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { buildWhatsAppHref } from "@/lib/whatsapp";

function buildBundleWaText(bundleId: string, title: string): string {
  return `שלום, מעוניין/ת ב${title} ממרכז הדיג'יי.\nאשמח לפרטים ולרשימת שילובים.`;
}

export default function DjMashupBundlePicker() {
  return (
    <section
      id="mashup-bundles"
      className="scroll-mt-24 rounded-2xl border border-brand-red/15 bg-gradient-to-br from-brand-red/5 to-transparent p-6 sm:p-8"
      aria-labelledby="mashup-bundles-heading"
    >
      <h2 id="mashup-bundles-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
        כמה מאשאפים? יש הנחה
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        דיג&apos;יי עם עונה עמוסה לא צריך לשלם מחיר בודד על כל שילוב.
        בוחרים חבילה, שולחים רשימה — מקבלים קבצים מוכנים לנגן.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {MASHUP_BUNDLE_OFFERS.map((offer) => {
          const retail = getBundleRetailTotal(offer);
          const bundlePrice = getExVat(offer.pricingId);
          const saving = getBundleSaving(offer);
          const waHref = buildWhatsAppHref({
            text: buildBundleWaText(offer.id, offer.title),
            utm_source: "website",
            utm_campaign: "dj_mashup_bundle",
          });
          return (
            <article
              key={offer.id}
              className="flex flex-col rounded-xl border border-border bg-surface p-5"
            >
              <h3 className="font-semibold text-foreground">{offer.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{offer.description}</p>
              {offer.tags?.length ? (
                <p className="mt-3 flex flex-wrap gap-2">
                  {offer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </p>
              ) : null}
              <p className="mt-3 text-sm text-muted-foreground line-through">
                {retail.toLocaleString("he-IL")} ₪ לפני מע״מ בנפרד
              </p>
              <p className="text-lg font-semibold text-brand-red">
                {formatFromPriceDual(bundlePrice)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                חיסכון {saving.toLocaleString("he-IL")} ₪ לפני מע״מ
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-brand-red px-4 text-sm font-semibold text-white hover:bg-brand-red-light"
                >
                  וואטסאפ
                </a>
                <Link
                  href={`#wizard-mashup-fixer?bundle=${offer.id}`}
                  className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground hover:border-brand-red/40"
                >
                  טופס הזמנה
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
