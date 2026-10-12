"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { GIFT_VOUCHER_EXAMPLES } from "@/lib/data/gift-voucher-examples";
import { cn } from "@/lib/utils";

/* מה שמקבלים בפועל, לפי docs/GIFT-VOUCHER.md: קישור אישי עם הורדת תמונה אחרי
   התשלום, תוקף שנתיים, ומימוש בשליחת הקוד בוואטסאפ. */
const FACTS = [
  {
    title: "שם, הודעה וקוד אישי",
    body: "על כל שובר מופיעים שם המקבל/ת, ההודעה שכתבתם וקוד אישי למימוש.",
  },
  {
    title: "נשלח כקישור וכתמונה",
    body: "אחרי התשלום מקבלים קישור לשובר עם הורדת תמונה. שולחים בוואטסאפ או במייל, או מדפיסים ומכניסים לכרטיס ברכה.",
  },
  {
    title: "שנתיים למימוש",
    body: "המקבל/ת שולח/ת את הקוד בוואטסאפ, ומתאמים יום באולפן במודיעין.",
  },
] as const;

function ReadTicks() {
  return (
    <svg viewBox="0 0 18 12" className="h-3 w-[18px] text-sky-500" aria-hidden="true">
      <path d="M1 6.5 4.5 10 11 2.5M7.5 10 14 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GiftVoucherExamples() {
  const [activeId, setActiveId] = useState(GIFT_VOUCHER_EXAMPLES[0].id);
  const active = GIFT_VOUCHER_EXAMPLES.find((e) => e.id === activeId) ?? GIFT_VOUCHER_EXAMPLES[0];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="דוגמאות לפי אירוע">
        {GIFT_VOUCHER_EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            aria-pressed={example.id === active.id}
            onClick={() => setActiveId(example.id)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
              example.id === active.id
                ? "border-brand-red bg-brand-red text-white"
                : "border-border bg-surface text-foreground hover:border-brand-red/40 hover:text-brand-red-text",
            )}
          >
            {example.occasion}
          </button>
        ))}
      </div>

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <figure>
          <Image
            src={active.imageSrc}
            alt={`שובר מתנה לדוגמה ל${active.occasion}: ${active.packageLabel}, עבור ${active.to} מאת ${active.from}. ההודעה: ${active.message}. תוקף שנתיים מיום הרכישה`}
            width={1600}
            height={900}
            unoptimized
            loading="lazy"
            className="h-auto w-full rounded-lg border border-border bg-white shadow-md"
          />
          <figcaption className="mt-2 text-center text-xs text-muted-foreground">
            השמות, ההודעה והקוד כאן לדוגמה. קוד אמיתי נוצר רק אחרי התשלום.
          </figcaption>
        </figure>

        {/* טלפון לדוגמה: ככה השובר מגיע למקבל/ת. דקורטיבי, כל המידע כבר בתמונה ובטקסט. */}
        <div aria-hidden="true" className="mx-auto w-[15.5rem] rounded-[2.4rem] bg-neutral-900 p-2.5 shadow-xl">
          <div className="overflow-hidden rounded-[1.9rem] bg-[#efeae2]">
            <div className="flex items-center gap-2 bg-neutral-800 px-3 pb-2.5 pt-5 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-sm font-semibold">
                {[...active.to][0]}
              </span>
              <span className="text-sm font-medium">{active.to}</span>
            </div>
            <div className="flex min-h-[15rem] flex-col justify-end gap-2 p-2.5">
              <div className="me-auto max-w-[92%] rounded-lg rounded-se-none bg-[#d9fdd3] p-1 shadow-sm">
                <Image
                  src={active.imageSrc}
                  alt=""
                  width={1600}
                  height={900}
                  unoptimized
                  loading="lazy"
                  className="h-auto w-full rounded-md"
                />
                <p className="px-1.5 pt-1.5 text-[0.8rem] leading-snug text-neutral-900">{active.chatText}</p>
                <p className="flex items-center justify-end gap-1 px-1.5 pb-0.5 text-[0.65rem] text-neutral-500">
                  <ReadTicks />
                  <span dir="ltr">{active.chatTime}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {FACTS.map((fact) => (
          <li key={fact.title} className="rounded-2xl border border-border bg-background p-5">
            <h3 className="text-base font-semibold text-foreground">{fact.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{fact.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center gap-2">
        <Button as="link" href={`/matanot/gift-voucher?package=${active.packageId}`} className="min-w-[16rem]">
          לעצב שובר משלכם
        </Button>
        <p className="text-xs text-muted-foreground">
          כותבים שמות והודעה, ורואים את השובר מיד. התשלום רק אחרי שיחה בוואטסאפ.
        </p>
      </div>
    </div>
  );
}
