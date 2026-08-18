"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export default function ServiceAreasWhatsAppCta() {
  const [city, setCity] = useState("");

  const whatsappHref = useMemo(
    () =>
      buildWhatsAppHref({
        text: `היי יקיר, אנחנו ב${city.trim() || "[עיר]"} ורוצים לבדוק אפשרות להקלטה/אירוע בתאריך...`,
        utm_source: "website",
        utm_campaign: "service_areas_cta",
      }),
    [city],
  );

  return (
    <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
      <label htmlFor="service-area-city" className="block text-sm font-semibold text-foreground">
        העיר שלכם
      </label>
      <p className="mt-2 text-sm text-muted-foreground">
        אפשר למלא כאן את שם העיר לפני פתיחת וואטסאפ.
      </p>
      <input
        id="service-area-city"
        name="service-area-city"
        dir="rtl"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="לדוגמה: ירושלים"
        className="mt-4 min-h-12 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-brand-red"
      />
      <div className="mt-5">
        <Button
          as="a"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-12 w-full sm:w-auto"
        >
          רוצים לבדוק זמינות לאזור שלכם?
        </Button>
      </div>
    </div>
  );
}
