"use client";

import { useState } from "react";
import { getBankTransferLine, getDepositLink, getPaymentLink, type MorningLink } from "@/lib/sales/morning-links";
import type { SalesCard as SalesCardData, SalesCardDraft } from "@/lib/sales/sales-book";
import {
  buildDepositMessage,
  buildMorningLinkFields,
  buildPaymentFailedMessage,
  buildPaymentMessage,
  buildPaymentMessageFull,
  buildPaymentWithBankMessage,
} from "@/lib/sales/sales-copy";
import { cn } from "@/lib/utils";

/**
 * אזור "לינק לתשלום" במחשבון של עמדת המכירות (12.10.2026).
 *
 * הלינק הוא ההודעה השלישית (החלטת הבעלים): קודם ההודעה או "רק לוודא", ורק אז
 * הכפתורים נפתחים (unlocked). ברירת המחדל קצרה; "עם הפירוט" מוסיף כלול/לא
 * כלול; "או בהעברה" מופיע רק כשיקיר כתב שורת העברה (morning:link --bank);
 * המקדמה רק באישור יקיר, מאחורי כפתור משלה.
 *
 * הסכום הוא הסכום של הבחירה במחשבון (quote.totalInclVat), לא של הבסיס: כשיש
 * שדרוגים או משתתפים הלינק הקבוע לשירות לא מתאים, והולכים ללינק הסכום הפתוח
 * עם הסכום המדויק בהודעה. הלינקים עצמם ב-lib/data/morning-links.json
 * (docs/MORNING-LINKS.md).
 */

export type PaymentCopyKind = "pay" | "pay-full" | "pay-bank" | "pay-failed" | "pay-link" | "deposit" | "morning-fields";

export const PAYMENT_COPY_ANNOUNCEMENT: Readonly<Record<PaymentCopyKind, string>> = {
  pay: "הודעת התשלום הועתקה",
  "pay-full": "הודעת התשלום עם הפירוט הועתקה",
  "pay-bank": "הודעת התשלום עם ההעברה הועתקה",
  "pay-failed": "הודעת התשלום לא עבר הועתקה",
  "pay-link": "הלינק לתשלום הועתק",
  deposit: "הודעת המקדמה הועתקה",
  "morning-fields": "השדות ללינק במורנינג הועתקו",
};

const LINK_KIND_LABEL = { fixed: "לינק קבוע לשירות", open: "לינק בסכום פתוח", deposit: "מקדמה" } as const;

const chipClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50";

export type PaymentTexts = {
  link: MorningLink | null;
  byKind: Readonly<Record<PaymentCopyKind, string | null>>;
};

/** הטקסטים לכל כפתור, מהכרטיס ומסכום הבחירה. null = הכפתור לא מופיע */
export function paymentTexts(
  card: SalesCardData,
  quote: { totalInclVat: number; priceFrom: boolean; hasSelection: boolean },
): PaymentTexts {
  /* לינק קבוע רק כשהבחירה היא הבסיס עצמו, אחרת הסכום בלינק לא יתאים */
  const link = getPaymentLink(card.id, { priceFrom: quote.priceFrom || quote.hasSelection });
  const draft: SalesCardDraft = { ...card, inclVat: quote.totalInclVat, priceFrom: quote.priceFrom };
  const bank = getBankTransferLine();
  const deposit = getDepositLink();
  return {
    link,
    byKind: {
      pay: link ? buildPaymentMessage(draft, link) : null,
      "pay-full": link ? buildPaymentMessageFull(draft, link) : null,
      "pay-bank": link && bank ? buildPaymentWithBankMessage(draft, link, bank) : null,
      "pay-failed": link ? buildPaymentFailedMessage(link, bank) : null,
      "pay-link": link?.url ?? null,
      deposit: deposit ? buildDepositMessage(deposit) : null,
      /* לינק קבוע נבנה רק לשירות עצמו (בלי שדרוגים ומשתתפים), במחיר של הקטלוג */
      "morning-fields":
        quote.priceFrom || quote.hasSelection || link?.kind === "fixed" || card.priceFrom ? null : buildMorningLinkFields(card),
    },
  };
}

export default function PaymentLinks({
  texts,
  copied,
  copy,
  unlocked,
}: {
  texts: PaymentTexts;
  copied: string | null;
  copy: (what: PaymentCopyKind) => Promise<void>;
  unlocked: boolean;
}) {
  const [showDeposit, setShowDeposit] = useState(false);
  const { link, byKind } = texts;
  const lockTitle = unlocked ? undefined : "קודם ההודעה או רק לוודא, הלינק הוא ההודעה השלישית";
  const payChip = cn(chipClass, !unlocked && "cursor-not-allowed opacity-50");
  const chip = (what: PaymentCopyKind, label: string, ariaLabel?: string) =>
    byKind[what] ? (
      <button
        type="button"
        onClick={() => void copy(what)}
        disabled={!unlocked}
        title={lockTitle}
        aria-label={ariaLabel}
        className={payChip}
      >
        {copied === what ? "הועתק" : label}
      </button>
    ) : null;

  return (
    <section aria-labelledby="calc-pay" className="grid gap-2 rounded-lg border border-border p-3">
      <h3 id="calc-pay" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
        לינק לתשלום
        {link ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {LINK_KIND_LABEL[link.kind]}
          </span>
        ) : null}
        {!unlocked && link ? <span className="text-[11px] font-normal text-muted-foreground">נפתח אחרי ההודעה</span> : null}
      </h3>
      {byKind.pay ? (
        <p className="rounded-lg bg-muted p-3 leading-relaxed [overflow-wrap:anywhere] whitespace-pre-wrap text-foreground select-text">{byKind.pay}</p>
      ) : (
        <p className="text-muted-foreground">
          עוד אין לינק לתשלום. יוצרים במורנינג (תשלומים, לינקים לתשלום) ושומרים עם npm run morning:link.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {chip("pay", "העתק הודעה עם לינק")}
        {byKind["pay-full"] !== byKind.pay ? chip("pay-full", "עם הפירוט") : null}
        {chip("pay-bank", "או בהעברה")}
        {chip("pay-link", "רק הלינק")}
        {chip("pay-failed", "התשלום לא עבר?")}
        {byKind["morning-fields"] ? (
          <button
            type="button"
            onClick={() => void copy("morning-fields")}
            className={chipClass}
            aria-label="העתק את השדות ליצירת לינק קבוע לשירות הזה במורנינג"
          >
            {copied === "morning-fields" ? "הועתק" : "שדות ללינק קבוע במורנינג"}
          </button>
        ) : null}
      </div>
      {byKind.deposit ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-2">
          {showDeposit ? (
            chip("deposit", "העתק לינק מקדמה")
          ) : (
            <button
              type="button"
              onClick={() => setShowDeposit(true)}
              className="min-h-11 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              מקדמה (רק באישור יקיר)
            </button>
          )}
        </div>
      ) : null}
    </section>
  );
}
