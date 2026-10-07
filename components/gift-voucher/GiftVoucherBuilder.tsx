"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { formatNis } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import {
  buildGiftVoucherCheckoutUrl,
  GIFT_VOUCHER_CHECKOUT_URL,
  GIFT_VOUCHER_CHOICES,
  GIFT_VOUCHER_LIMITS,
  GIFT_VOUCHER_VALIDITY_LABEL,
} from "@/lib/data/gift-voucher";
import {
  canvasToPngBlob,
  drawVoucherImage,
  VOUCHER_IMAGE_SIZE,
} from "@/lib/gift-voucher-canvas";
import { cn } from "@/lib/utils";

const FIELD =
  "mt-1 block min-h-12 w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground";

export default function GiftVoucherBuilder() {
  const uid = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [choiceId, setChoiceId] = useState(GIFT_VOUCHER_CHOICES[1]?.id ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [downloadError, setDownloadError] = useState(false);

  const choice = useMemo(
    () => GIFT_VOUCHER_CHOICES.find((c) => c.id === choiceId),
    [choiceId],
  );
  const valueLabel = choice
    ? choice.kind === "package"
      ? `${choice.label}, ${formatNis(choice.amountNis)} כולל מע״מ`
      : `${formatNis(choice.amountNis)} לשימוש באולפן`
    : "";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      void drawVoucherImage(canvas, {
        from,
        to,
        message,
        valueLabel,
        validityLabel: GIFT_VOUCHER_VALIDITY_LABEL,
      });
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [from, to, message, valueLabel]);

  const checkoutUrl = choice
    ? buildGiftVoucherCheckoutUrl(GIFT_VOUCHER_CHECKOUT_URL, choice.amountNis)
    : null;

  /* בלי כתובת סליקה: הכפתור פותח וואטסאפ עם בקשת רכישה מוכנה. הפרטים נשלחים
     ליקיר בלחיצה של הגולש עצמו, לא לצד שלישי. */
  const whatsappHref = choice
    ? buildWhatsAppHref({
        text: [
          `שלום, אשמח לרכוש שובר מתנה: ${valueLabel}.`,
          to ? `עבור: ${to}.` : "",
          from ? `מאת: ${from}.` : "",
          message ? `ההודעה האישית: ${message}` : "",
        ]
          .filter(Boolean)
          .join(" "),
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
        validityLabel: GIFT_VOUCHER_VALIDITY_LABEL,
      });
      const blob = await canvasToPngBlob(canvas);
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = "gift-voucher-yakir-cohen.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
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
            1. בחרו סכום או חבילה
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {GIFT_VOUCHER_CHOICES.map((option) => {
              const selected = option.id === choiceId;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex min-h-12 cursor-pointer flex-col rounded-lg border p-4 transition-colors",
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
                  {option.kind === "package" ? (
                    <span className="mt-1 text-xs text-muted-foreground">
                      {option.note}
                    </span>
                  ) : null}
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
          {checkoutUrl ? (
            <Button
              as="a"
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-12 flex-1"
            >
              לרכישה
            </Button>
          ) : whatsappHref ? (
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

        {!checkoutUrl ? (
          <p className="text-sm text-muted-foreground" role="status">
            הכפתור לרכישה פותח וואטסאפ עם הבחירה והפרטים שמילאתם, ומשם מתאמים
            את התשלום ומקבלים את קוד השובר.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            התשלום מתבצע אצל ספק הסליקה. שם הנותן, שם המקבל וההודעה נשארים
            בדפדפן שלכם ולא נשלחים אליו.
          </p>
        )}
        {downloadError ? (
          <p className="text-sm text-brand-red-text" role="alert">
            לא הצלחנו ליצור את התמונה בדפדפן הזה. נסו דפדפן אחר.
          </p>
        ) : null}
      </div>
    </div>
  );
}
