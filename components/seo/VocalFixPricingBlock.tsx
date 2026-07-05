"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type Track = {
  id: "standard" | "express";
  label: string;
  badge?: string;
  delivery: string;
  price: string;
  priceNote: string;
  whatsappText: string;
  utmCampaign: string;
};

const TRACKS: Track[] = [
  {
    id: "standard",
    label: "מסלול רגיל",
    delivery: "1-3 ימי עסקים",
    price: "250 ₪",
    priceNote: "+ מע\"מ",
    whatsappText:
      "היי יקיר! אני מעוניין/ת בשירות שיפור קול מהנייד (250 ₪ עד 5 דק). אשמח לשלוח קובץ.",
    utmCampaign: "vocal_fix_standard",
  },
  {
    id: "express",
    label: "מסלול חירום",
    badge: "אקספרס",
    delivery: "4-12 שעות",
    price: "375 ₪",
    priceNote: "+ מע\"מ",
    whatsappText:
      "היי יקיר! אני צריך/ה שיפור קול בדחיפות - מסלול חירום (4-12 שעות). מה הזמינות?",
    utmCampaign: "vocal_fix_express",
  },
];

const PRICE_INCLUDED = [
  "עיבוד מקצועי לקובץ אחד",
  "עד 5 דקות של חומר",
  "הסרת רעשים + חידוד + העשרה",
  "קובץ MP3/WAV איכותי",
];

export default function VocalFixPricingBlock() {
  const [activeTrack, setActiveTrack] = useState<"standard" | "express">(
    "standard",
  );

  const track = TRACKS.find((t) => t.id === activeTrack)!;

  const ctaHref = buildWhatsAppHref({
    text: track.whatsappText,
    utm_source: "online",
    utm_campaign: track.utmCampaign,
  });

  return (
    <div className="mx-auto max-w-md">
      {/* Track toggle */}
      <div
        role="tablist"
        aria-label="בחרו מסלול"
        className="mb-4 flex overflow-hidden rounded-xl border border-border"
      >
        {TRACKS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === activeTrack}
            onClick={() => setActiveTrack(t.id)}
            className={cn(
              "relative flex-1 px-3 py-2.5 text-xs font-semibold transition-colors",
              t.id === activeTrack
                ? "bg-brand-red text-white"
                : "bg-muted/40 text-muted-foreground hover:bg-muted",
            )}
          >
            {t.label}
            {t.badge && (
              <span className="absolute right-1.5 top-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pricing card */}
      <div className="rounded-2xl border border-brand-red/30 bg-background p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">כמה זה עולה?</h2>

        <div className="mt-4 transition-all">
          <p className="text-4xl font-bold text-foreground tabular-nums">
            {track.price}
          </p>
          <p className="text-sm text-muted-foreground">{track.priceNote}</p>
          <p
            className={cn(
              "mt-1 text-xs font-semibold",
              activeTrack === "express" ? "text-brand-red" : "text-muted-foreground",
            )}
          >
            {activeTrack === "express" ? "⚡ " : ""}אספקה: {track.delivery}
          </p>
        </div>

        <ul className="mt-6 space-y-2 text-start text-sm text-muted-foreground">
          {PRICE_INCLUDED.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-brand-red" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
          {activeTrack === "express" && (
            <li className="flex gap-2 font-medium text-brand-red">
              <span aria-hidden>⚡</span>
              עיבוד בעדיפות מיידית - תוך 4-12 שעות
            </li>
          )}
        </ul>

        {activeTrack === "standard" && (
          <p className="mt-4 text-xs text-muted-foreground">
            לקטעים ארוכים: כל 5 דקות נוספות - 200 ₪
          </p>
        )}

        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          {activeTrack === "express" ? "⚡ הזמינו מסלול חירום" : "הזמינו בוואטסאפ"}
        </a>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <Link
            href="/online/vocal-fix/pitch-correction"
            className="font-medium text-brand-red hover:underline"
          >
            גם צריך תיקון זיופים?
          </Link>
          <Link
            href="/online/vocal-fix/volume-balance"
            className="font-medium text-brand-red hover:underline"
          >
            איזון ווליומים (500 ₪)
          </Link>
          <Link
            href="/online/vocal-fix/noise-removal"
            className="font-medium text-brand-red hover:underline"
          >
            ניקוי רעשים (500 ₪)
          </Link>
          <Link
            href="/online/vocal-fix/eq-fix"
            className="font-medium text-brand-red hover:underline"
          >
            תיקון תדרים ו-EQ (500 ₪)
          </Link>
          <Link
            href="/online/vocal-fix/mixing"
            className="font-medium text-brand-red hover:underline"
          >
            מיקס ומאסטרינג (500 ₪)
          </Link>
        </div>
      </div>
    </div>
  );
}
