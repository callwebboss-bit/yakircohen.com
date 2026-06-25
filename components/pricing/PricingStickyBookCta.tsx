"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PricingStickyBookCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let heroGone = false;
    let footerVisible = false;

    const update = () => setVisible(heroGone && !footerVisible);

    const heroObs = new IntersectionObserver(
      ([e]) => {
        heroGone = !e!.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    const footerObs = new IntersectionObserver(
      ([e]) => {
        footerVisible = e!.isIntersecting;
        update();
      },
      { threshold: 0 },
    );

    const heroSentinel = document.getElementById("pricing-hero-sentinel");
    const footerSentinel = document.getElementById("pricing-footer-sentinel");
    if (heroSentinel) heroObs.observe(heroSentinel);
    if (footerSentinel) footerObs.observe(footerSentinel);

    return () => {
      heroObs.disconnect();
      footerObs.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 pb-[env(safe-area-inset-bottom)] pt-3 backdrop-blur-sm">
        <p className="text-xs text-muted-foreground">מחיר שקוף, ללא הפתעות</p>
        <Link
          href="/book"
          className="inline-flex min-h-10 items-center rounded-xl bg-brand-red px-5 py-2 text-sm font-semibold text-white"
          tabIndex={visible ? 0 : -1}
        >
          הזמנה מקוונת
        </Link>
      </div>
    </div>
  );
}
