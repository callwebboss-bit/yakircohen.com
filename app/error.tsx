"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const errorWhatsAppHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText("תמיכה אחרי שגיאה באתר"),
  utm_source: "website",
  utm_campaign: "global_error",
});

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
        שגיאה בלתי צפויה
      </p>

      <h1 className="mt-4 font-serif text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
        משהו השתבש
      </h1>

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        נתקלנו בשגיאה טכנית. הצוות שלנו כבר יודע על הבעיה. תוכלו לנסות שוב או
        לחזור לדף הבית.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          נסו שוב ←
        </button>

        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors duration-fast ease-luxury hover:text-brand-red hover:underline"
        >
          חזרה לדף הבית
        </Link>
      </div>

      <a
        href={errorWhatsAppHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-xs text-muted-foreground underline-offset-4 transition-colors duration-fast hover:text-brand-red hover:underline"
      >
        נתקלתם בבעיה חוזרת? דברו איתנו בוואטסאפ
      </a>
    </div>
  );
}
