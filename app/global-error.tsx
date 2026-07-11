"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const errorWhatsAppHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText("תמיכה אחרי שגיאה באתר"),
  utm_source: "website",
  utm_campaign: "global_error_root",
});

/** Root-level error UI (replaces root layout). Must include html + body. */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="he" dir="rtl">
      <body className="bg-[#fafaf8] text-[#1a1a1a] antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d42b2b] uppercase">
            שגיאה בלתי צפויה
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            משהו השתבש
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#737373] sm:text-base">
            נתקלנו בשגיאה טכנית. אפשר לנסות שוב או לחזור לדף הבית.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-12 items-center rounded-xl bg-[#d42b2b] px-7 py-3 text-sm font-semibold text-white"
            >
              נסו שוב
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-[#737373] underline-offset-4 hover:text-[#d42b2b] hover:underline"
            >
              חזרה לדף הבית
            </Link>
          </div>
          <a
            href={errorWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-xs text-[#737373] underline-offset-4 hover:text-[#d42b2b] hover:underline"
          >
            בעיה חוזרת? וואטסאפ
          </a>
        </div>
      </body>
    </html>
  );
}
