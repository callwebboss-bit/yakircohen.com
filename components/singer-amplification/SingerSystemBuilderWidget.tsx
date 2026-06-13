"use client";

import { useMemo, useState } from "react";
import {
  getSingerBuilderRecommendation,
  SINGER_BUILDER_ACT,
  SINGER_BUILDER_AUDIENCE,
  SINGER_BUILDER_EXTRAS,
  type SingerActId,
  type SingerAudienceId,
  type SingerExtraId,
} from "@/lib/data/singer-amplification-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["קהל ומיקום", "סוג האקט", "תוספות"] as const;

export default function SingerSystemBuilderWidget() {
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<SingerAudienceId | "">("");
  const [act, setAct] = useState<SingerActId | "">("");
  const [extra, setExtra] = useState<SingerExtraId | "">("");
  const [done, setDone] = useState(false);

  const recommendation = useMemo(() => {
    if (!audience || !act || !extra) return null;
    return getSingerBuilderRecommendation(audience, act, extra);
  }, [audience, act, extra]);

  const whatsappHref = useMemo(() => {
    if (!recommendation || !audience || !act || !extra) return "";
    const audienceLabel = SINGER_BUILDER_AUDIENCE.find((a) => a.id === audience)?.label ?? "";
    const actLabel = SINGER_BUILDER_ACT.find((a) => a.id === act)?.label ?? "";
    const extraLabel = SINGER_BUILDER_EXTRAS.find((e) => e.id === extra)?.label ?? "";
    const text = [
      "שלום, הרצתי את מחשבון מערכת ההגברה באתר:",
      `• קהל: ${audienceLabel}`,
      `• סוג: ${actLabel}`,
      `• תוספות: ${extraLabel}`,
      `• המלצה: ${recommendation.title}`,
      "אשמח לבדיקת זמינות וייעוץ קצר.",
    ].join("\n");
    return buildWhatsAppHref({
      text,
      utm_source: "website",
      utm_campaign: "singer_system_builder",
    });
  }, [recommendation, audience, act, extra]);

  const reset = () => {
    setStep(0);
    setAudience("");
    setAct("");
    setExtra("");
    setDone(false);
  };

  return (
    <section
      className="rounded-2xl border border-brand-red/20 bg-gradient-to-b from-brand-red/[0.04] to-surface p-6 sm:p-8"
      aria-labelledby="system-builder-heading"
    >
      <header className="text-center">
        <h2
          id="system-builder-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          מחשבון מערכת הגברה - 3 קליקים
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          בלי מחירים - רק המערכת האופטימלית עבורכם. לזמרים, הרכבים ומפיקי אירועים.
        </p>
      </header>

      {!done ? (
        <>
          <ol className="mt-6 flex justify-center gap-2 text-xs font-semibold text-muted-foreground">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={cn(
                  "rounded-full px-3 py-1",
                  i === step && "bg-brand-red/10 text-brand-red",
                  i < step && "text-brand-red",
                )}
              >
                {i + 1}. {label}
              </li>
            ))}
          </ol>

          {step === 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {SINGER_BUILDER_AUDIENCE.map((opt) => (
                <OptionButton
                  key={opt.id}
                  active={audience === opt.id}
                  title={opt.label}
                  detail={opt.detail}
                  onClick={() => {
                    setAudience(opt.id);
                    setStep(1);
                  }}
                />
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {SINGER_BUILDER_ACT.map((opt) => (
                <OptionButton
                  key={opt.id}
                  active={act === opt.id}
                  title={opt.label}
                  onClick={() => {
                    setAct(opt.id);
                    setStep(2);
                  }}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {SINGER_BUILDER_EXTRAS.map((opt) => (
                <OptionButton
                  key={opt.id}
                  active={extra === opt.id}
                  title={opt.label}
                  onClick={() => {
                    setExtra(opt.id);
                    setDone(true);
                  }}
                />
              ))}
            </div>
          )}

          {step > 0 && !done ? (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-sm text-muted-foreground hover:text-brand-red"
              > חזרה לשלב הקודם
              </button>
            </div>
          ) : null}
        </>
      ) : recommendation ? (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-border bg-background p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-red">
              המערכת האופטימלית עבורכם
            </p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">
              {recommendation.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{recommendation.summary}</p>
            <ul className="mt-4 space-y-1.5 text-start text-sm text-muted-foreground">
              {recommendation.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-brand-red" aria-hidden>
                    ✓
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light sm:w-auto"
            >
              שלחו את מפרט המחשבון בוואטסאפ
            </a>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-muted-foreground hover:text-brand-red"
            >
              התחילו מחדש
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function OptionButton({
  active,
  title,
  detail,
  onClick,
}: {
  active: boolean;
  title: string;
  detail?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-start transition-colors",
        active
          ? "border-brand-red bg-brand-red/5"
          : "border-border bg-background hover:border-brand-red/40",
      )}
    >
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {detail ? (
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      ) : null}
    </button>
  );
}
