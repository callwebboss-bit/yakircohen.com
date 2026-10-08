import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VoucherImageButton from "@/components/gift-voucher/VoucherImageButton";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  findVoucher,
  formatVoucherDate,
  getAllVoucherCodes,
  getVoucherStatus,
} from "@/lib/gift-voucher";

/* הקודים נקראים מ-lib/data/vouchers.json. קודים ידועים נבנים מראש. קוד אחר
   (למשל אותו קוד באותיות קטנות) נבדק מול אותו JSON ב-findVoucher, ואם אינו שם
   מקבל 404. אין שום מקור נתונים אחר, ולכן אין מה לנחש מול שרת חי. */
type Props = { params: Promise<{ code: string }> };

/* הסטטוס (בתוקף, פג, מומש) מחושב לפי התאריך. בלי רענון הדף היה קופא על הסטטוס
   של זמן הפריסה, ושובר שפג תוקפו המשיך להופיע "בתוקף" עד הפריסה הבאה. */
export const revalidate = 3600;

export function generateStaticParams() {
  return getAllVoucherCodes().map((code) => ({ code }));
}

/* שובר הוא עמוד אישי: לא לאינדקס, ולא להצגת כותרת עם פרטי הנותן. */
export const metadata: Metadata = {
  title: { absolute: "שובר מתנה | יקיר כהן הפקות" },
  robots: { index: false, follow: false, nocache: true },
  /* הקוד הוא הסוד היחיד של הדף. בלי referrer הוא לא דולף לאתר שהקישור בו נלחץ. */
  referrer: "no-referrer",
};

export default async function VoucherPage({ params }: Props) {
  const { code } = await params;
  const voucher = findVoucher(code);
  if (!voucher) notFound();

  const status = getVoucherStatus(voucher);
  /* רק מה שהמקבל זכאי לו, בלי מחיר (החלטת הבעלים 8.10.2026) */
  const value = voucher.packageLabel ?? "";

  return (
    <Section className="bg-background" ariaLabelledby="voucher-title" padding="sm">
      <Container className="max-w-2xl">
        <article className="rounded-2xl border-2 border-brand-red bg-surface p-8 text-center shadow-sm sm:p-12">
          <p className="mb-3 text-xs text-muted-foreground">בס״ד</p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            יקיר כהן הפקות
          </p>
          <h1
            id="voucher-title"
            className="mt-3 font-serif text-4xl font-semibold text-foreground"
          >
            שובר מתנה
          </h1>
          {value ? (
            <p className="mt-4 text-2xl font-semibold text-brand-red-text">
              {value}
            </p>
          ) : null}

          <p className="mt-8 text-lg text-foreground">עבור: {voucher.to}</p>
          {voucher.message ? (
            <p className="mx-auto mt-4 max-w-md whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {voucher.message}
            </p>
          ) : null}
          <p className="mt-6 text-base font-medium text-foreground">
            מאת: {voucher.from}
          </p>

          <dl className="mx-auto mt-10 grid max-w-sm gap-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">קוד שובר</dt>
              <dd className="font-semibold text-foreground" dir="ltr">
                {voucher.code}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">הונפק</dt>
              <dd className="text-foreground">{formatVoucherDate(voucher.issuedAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">בתוקף עד</dt>
              <dd className="text-foreground">{formatVoucherDate(voucher.validUntil)}</dd>
            </div>
          </dl>

          {status === "redeemed" ? (
            <p className="mt-6 text-sm font-medium text-foreground" role="status">
              השובר מומש ב-{formatVoucherDate(voucher.redeemedAt ?? voucher.issuedAt)}.
            </p>
          ) : status === "expired" ? (
            <p className="mt-6 text-sm font-medium text-brand-red-text" role="status">
              תוקף השובר הסתיים. אפשר לפנות אלינו בוואטסאפ ולבדוק מה אפשר לעשות.
            </p>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              למימוש שולחים הודעה בוואטסאפ עם קוד השובר ומתאמים תאריך.
            </p>
          )}
          {status !== "redeemed" ? (
            <VoucherImageButton
              filename={`gift-voucher-${voucher.code}.png`}
              input={{
                from: voucher.from,
                to: voucher.to,
                message: voucher.message,
                valueLabel: value,
                validityLabel: `בתוקף עד ${formatVoucherDate(voucher.validUntil)}`,
                code: voucher.code,
              }}
            />
          ) : null}
        </article>
      </Container>
    </Section>
  );
}
