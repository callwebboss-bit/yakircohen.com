/**
 * הטקסטים של "לינק לתשלום" לכרטיס ולסכום של בחירה. פונקציה טהורה, בלי React:
 * המחשבון (components/admin/PaymentLinks.tsx) וסוכן המכירות (agent-tools.ts)
 * משתמשים באותה אחת, כדי שהלינק וההודעה יהיו זהים בשני המקומות. הלינק עצמו
 * תמיד מגיע מכאן ולא מהמודל, כך שה-URL לא יכול להשתבש.
 */
import { getBankTransferLine, getDepositLink, getPaymentLink, type MorningLink } from "@/lib/sales/morning-links";
import type { SalesCard, SalesCardDraft } from "@/lib/sales/sales-book";
import {
  buildDepositMessage,
  buildMorningLinkFields,
  buildPaymentFailedMessage,
  buildPaymentMessage,
  buildPaymentMessageFull,
  buildPaymentWithBankMessage,
} from "@/lib/sales/sales-copy";

export type PaymentCopyKind = "pay" | "pay-full" | "pay-bank" | "pay-failed" | "pay-link" | "deposit" | "morning-fields";

export type PaymentTexts = {
  link: MorningLink | null;
  byKind: Readonly<Record<PaymentCopyKind, string | null>>;
};

/** הטקסטים לכל כפתור, מהכרטיס ומסכום הבחירה. null = הכפתור לא מופיע */
export function paymentTexts(
  card: SalesCard,
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
