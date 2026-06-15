"use client";

import { useState } from "react";
import type { ProService, ProServiceSimpleCta } from "@/lib/data/pro-services";
import { getExVat } from "@/lib/data/pricing-catalog";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type ProServiceTopicCtaProps = {
  service: ProService;
  config: ProServiceSimpleCta;
};

export default function ProServiceTopicCta({ service, config }: ProServiceTopicCtaProps) {
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {
      setError("כתבו במשפט אחד על מה הפודקאסט.");
      return;
    }
    setError(null);

    const basePrice = getExVat(service.pricingId);
    const waBody = appendYcLeadTag(
      `${service.whatsappIntro} ${trimmed}`,
      {
        service: service.closerServiceId,
        price: basePrice,
        source: service.utmCampaign,
        step: 1,
      },
    );

    const href = buildWhatsAppHref({
      text: waBody,
      utm_source: "website",
      utm_campaign: `${service.utmCampaign}_topic`,
    });

    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
      aria-labelledby={`topic-cta-${service.id}`}
    >
      <h2
        id={`topic-cta-${service.id}`}
        className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
      >
        {config.title}
      </h2>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label htmlFor={`topic-${service.id}`} className="sr-only">
            {config.fieldLabel}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <input
              id={`topic-${service.id}`}
              type="text"
              className="min-h-11 w-full flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              placeholder={config.placeholder}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-brand-red px-8 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              {config.buttonLabel}
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{config.fieldLabel}</p>
        </div>
        {error ? (
          <p className="text-sm text-brand-red" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
