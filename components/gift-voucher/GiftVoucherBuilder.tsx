"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { formatNis } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import {
  buildGiftVoucherRequestText,
  GIFT_VOUCHER_CHOICES,
  GIFT_VOUCHER_LIMITS,
  GIFT_VOUCHER_VALIDITY_LABEL,
} from "@/lib/data/gift-voucher";
import {
  drawVoucherImage,
  saveVoucherImage,
  VOUCHER_IMAGE_SIZE,
} from "@/lib/gift-voucher-canvas";
import { cn } from "@/lib/utils";

const FIELD =
  "mt-1 block min-h-12 w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground";

export default function GiftVoucherBuilder() {
  const uid = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [choiceId, setChoiceId] = useState(GIFT_VOUCHER_CHOICES[0]?.id ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [downloadError, setDownloadError] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const choice = useMemo(
    () => GIFT_VOUCHER_CHOICES.find((c) => c.id === choiceId),
    [choiceId],
  );
  /* על השובר עצמו אין מחיר (החלטת הבעלים 8.10.2026): רק מה שהמקבל זכאי לו.
     המחיר נשאר בבחירה למעלה ובבקשה לוואטסאפ, שהיא אל יקיר ולא אל המקבל. */
  const valueLabel = choice ? choice.label : "";
  const requestLabel = choice
    ? `${choice.label}, ${formatNis(choice.amountNis)} כולל מע״מ`
    : "";

  const validityLabel = GIFT_VOUCHER_VALIDITY_LABEL;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      setPreviewError(false);
      drawVoucherImage(canvas, {
        from,
        to,
        message,
        valueLabel,
        validityLabel,
      }).catch(() => {
        if (!cancelled) setPreviewError(true);
      });
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [from, to, message, valueLabel, validityLabel]);

  const whatsappHref = choice
    ? buildWhatsAppHref({
        text: buildGiftVoucherRequestText({
          valueLabel: requestLabel,
          to,
          from,
          message,
        }),
        utm_source: "website",
        utm_campaign: "gift_voucher_builder",
      })
    : null;

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloadError(false);
    try {
      await drawVoucherImage(canvas, {
        from,
        to,
        message,
        valueLabel,
        validityLabel,
      });
      await saveVoucherImage(canvas, "gift-voucher-yakir-cohen.png");
    } catch {
      setDownloadError(true);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <form
        className="space-y-8"
        onSubmit={(event) => event.preventDefault()}
        aria-label="פרטי השובר"
      >
        <fieldset>
          <legend className="font-serif text-xl font-semibold text-foreground">
            1. בחרו חבילה
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {GIFT_VOUCHER_CHOICES.map((option) => {
              const selected = option.id === choiceId;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex min-h-12 cursor-pointer flex-col rounded-lg border p-4 transition-colors",
                    "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-red",
                    selected
                      ? "border-brand-red bg-brand-red/5"
                      : "border-border bg-surface hover:border-brand-red/40",
                  )}
                >
                  <input
                    type="radio"
                    name={`${uid}-choice`}
                    value={option.id}
                    checked={selected}
                    onChange={() => setChoiceId(option.id)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-foreground">
                    {formatNis(option.amountNis)}
                  </span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    {option.label}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {option.note}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-serif text-xl font-semibold text-foreground">
            2. למי ומאת מי
          </legend>
          <label className="block text-sm font-medium text-foreground" htmlFor={`${uid}-from`}>
            שם הנותן
            <input
              id={`${uid}-from`}
              type="text"
              value={from}
              maxLength={GIFT_VOUCHER_LIMITS.name}
              onChange={(event) => setFrom(event.target.value)}
              autoComplete="off"
              className={FIELD}
            />
          </label>
          <label className="block text-sm font-medium text-foreground" htmlFor={`${uid}-to`}>
            שם המקבל
            <input
              id={`${uid}-to`}
              type="text"
              value={to}
              maxLength={GIFT_VOUCHER_LIMITS.name}
              onChange={(event) => setTo(event.target.value)}
              autoComplete="off"
              className={FIELD}
            />
          </label>
          <label className="block text-sm font-medium text-foreground" htmlFor={`${uid}-msg`}>
            הודעה אישית
            <textarea
              id={`${uid}-msg`}
              rows={4}
              value={message}
              maxLength={GIFT_VOUCHER_LIMITS.message}
              onChange={(event) => setMessage(event.target.value)}
              className={cn(FIELD, "min-h-28")}
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              {message.length} מתוך {GIFT_VOUCHER_LIMITS.message} תווים
            </span>
          </label>
        </fieldset>
      </form>

      <div className="space-y-5 lg:sticky lg:top-24">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          3. תצוגה מקדימה
        </h2>
        <canvas
          ref={canvasRef}
          width={VOUCHER_IMAGE_SIZE.width}
          height={VOUCHER_IMAGE_SIZE.height}
          role="img"
          aria-label={`תצוגה מקדימה של שובר מתנה עבור ${to || "המקבל"} מאת ${from || "הנותן"}, ${valueLabel}`}
          className="aspect-video w-full rounded-lg border border-border bg-surface shadow-sm"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          {whatsappHref ? (
            <Button
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-12 flex-1"
            >
              לרכישה
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={handleDownload}
            className="min-h-12 flex-1"
          >
            הורדת תמונת השובר
          </Button>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          לחיצה על לרכישה פותחת וואטסאפ עם הבחירה והפרטים שמילאתם. אחרי שנדבר
          נשלח הצעת מחיר, התשלום הוא מראש ובמלואו, ואחריו חשבונית ירוקה והשובר
          עם קוד.
        </p>
        {previewError ? (
          <p className="text-sm text-brand-red-text" role="alert">
            לא הצלחנו לצייר את תצוגת השובר. רעננו את הדף ונסו שוב.
          </p>
        ) : null}
        {downloadError ? (
          <p className="text-sm text-brand-red-text" role="alert">
            לא הצלחנו ליצור את התמונה בדפדפן הזה. נסו דפדפן אחר.
          </p>
        ) : null}
      </div>
    </div>
  );
}
