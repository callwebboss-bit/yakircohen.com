"use client";

import { useState, useMemo, useId } from "react";
import { cn } from "@/lib/utils";
import { formatNis, withVat } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";

export type PricingSummaryAddOn = {
  id: string;
  label: string;
  priceExVat: number;
  benefit?: string;
};

export type PricingSummaryBasicProduct = {
  type: "basic";
  name: string;
  priceExVat: number;
  benefit?: string;
  addOns: PricingSummaryAddOn[];
};

export type PricingSummaryPremiumProduct = {
  type: "premium";
  name: string;
  priceExVat: number;
  benefit?: string;
};

export type PricingSummaryProduct =
  | PricingSummaryBasicProduct
  | PricingSummaryPremiumProduct;

export type PricingSummaryCallbackPayload = {
  selectedAddOnIds: string[];
  totalExVat: number;
};

export type PricingSummaryProps = {
  product: PricingSummaryProduct;
  onEmailQuote?: (summary: PricingSummaryCallbackPayload) => void;
  emailHref?: string;
  whatsAppText?: string;
  whatsAppUtmCampaign?: string;
  className?: string;
};

export default function PricingSummary({
  product,
  onEmailQuote,
  emailHref,
  whatsAppText,
  whatsAppUtmCampaign,
  className,
}: PricingSummaryProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const uid = useId();

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const selectedAddOns = useMemo(() => {
    if (product.type !== "basic") return [];
    return product.addOns.filter((a) => checked.has(a.id));
  }, [product, checked]);

  const totalExVat = useMemo(
    () =>
      product.priceExVat +
      selectedAddOns.reduce((sum, a) => sum + a.priceExVat, 0),
    [product.priceExVat, selectedAddOns],
  );

  const totalIncVat = withVat(totalExVat);

  const waHref = buildWhatsAppHref({
    text:
      whatsAppText ??
      `שלום, אשמח להתייעץ בנוגע ל-${product.name} (${formatNis(product.priceExVat)} לפני מע"מ)`,
    utm_source: "pricing_summary",
    utm_campaign: whatsAppUtmCampaign,
  });

  function handleEmailClick() {
    if (onEmailQuote) {
      onEmailQuote({
        selectedAddOnIds: Array.from(checked),
        totalExVat,
      });
    }
  }

  return (
    <div
      dir="rtl"
      className={cn(
        "rounded-2xl bg-[#FAFAF8] p-6 text-[#1A1A1A] sm:p-8",
        className,
      )}
    >
      {/* Product row */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            המוצר שנבחר
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {product.name}
          </p>
          {product.benefit && (
            <p className="mt-1 text-xs text-muted-foreground">
              {product.benefit}
            </p>
          )}
        </div>
        <p className="shrink-0 text-lg font-bold text-foreground">
          {formatNis(product.priceExVat)}
        </p>
      </div>

      <div className="my-6 border-t border-border" />

      {/* Adjustments section */}
      {product.type === "basic" ? (
        <div>
          <p className="mb-4 text-sm font-semibold text-foreground">
            התאמות טכניות זמינות
          </p>
          {product.addOns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              אין תוספות זמינות לבחירה זו.
            </p>
          ) : (
            <ul className="space-y-4">
              {product.addOns.map((addon) => {
                const inputId = `${uid}-addon-${addon.id}`;
                const isChecked = checked.has(addon.id);
                return (
                  <li key={addon.id} className="flex items-start justify-between gap-4">
                    <label
                      htmlFor={inputId}
                      className="flex cursor-pointer items-start gap-3"
                    >
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(addon.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-red"
                      />
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {addon.label}
                        </span>
                        {addon.benefit && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {addon.benefit}
                          </p>
                        )}
                      </div>
                    </label>
                    <span className="shrink-0 text-sm font-semibold text-foreground">
                      + {formatNis(addon.priceExVat)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.benefit ??
            "מפרט זה מכיל את כלל הציוד הנדרש ברמת הפרימיום. אין צורך בתוספות חומרה."}
        </p>
      )}

      <div className="my-6 border-t border-border" />

      {/* Total */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">סה&quot;כ לפני מע&quot;מ</span>
          <span className="text-base font-bold text-foreground">
            {formatNis(totalExVat)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">כולל מע&quot;מ (18%)</span>
          <span className="text-sm font-semibold text-muted-foreground">
            {formatNis(totalIncVat)}
          </span>
        </div>
      </div>

      <div className="my-6 border-t border-border" />

      {/* CTA buttons */}
      <div className="space-y-3">
        {onEmailQuote ? (
          <Button
            variant="primary"
            className="w-full"
            onClick={handleEmailClick}
          >
            אני רוצה לקבל את המפרט והתמחור למייל
          </Button>
        ) : (
          <Button
            as="a"
            variant="primary"
            href={emailHref ?? `mailto:callwebboss@gmail.com`}
            className="w-full"
          >
            אני רוצה לקבל את המפרט והתמחור למייל
          </Button>
        )}

        <Button
          as="a"
          variant="secondary"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          מעבר לשיחה והתייעצות בוואטסאפ
        </Button>
      </div>
    </div>
  );
}
