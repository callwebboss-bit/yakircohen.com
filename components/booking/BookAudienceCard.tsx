"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BookDemoVideoModal from "@/components/booking/BookDemoVideoModal";
import BookPriceDual from "@/components/booking/BookPriceDual";
import BookQualificationMiniForm from "@/components/booking/BookQualificationMiniForm";
import PriceSocialProof from "@/components/booking/PriceSocialProof";
import { formatScopeLine } from "@/lib/data/pricing-display";
import {
  buildFastWhatsAppMessage,
  getQualificationFields,
  type BookAudienceRoute,
} from "@/lib/data/book-audience-routes";
import {
  clearBookQualificationDraft,
  readBookQualificationDraft,
  writeBookQualificationDraft,
  hasMeaningfulQualificationAnswers,
} from "@/lib/book-qualification-draft";
import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { catalogWithVat } from "@/lib/data/pricing-catalog";
import { mirrorWhatsAppLeadToEmail } from "@/lib/mirror-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import MicroAudioAudition from "@/components/ui/MicroAudioAudition";
import type { AudioDemoId } from "@/lib/data/audio-demos";
import { cn } from "@/lib/utils";

const ROUTE_AUDIO_DEMO: Partial<Record<string, AudioDemoId>> = {
  "online-restore": "weber-restoration",
  "podcast-content": "podcast-zoom-cleanup",
};

function cardBullets(route: BookAudienceRoute): string[] {
  const bullets: string[] = [];
  if (route.scope) {
    const scopeLine = formatScopeLine(route.scope);
    if (scopeLine) bullets.push(scopeLine);
  }
  if (route.essenceMicroCopy.trim()) {
    bullets.push(route.essenceMicroCopy.trim());
  }
  if (bullets.length < 2 && route.upsellHint.trim()) {
    bullets.push(route.upsellHint.trim());
  }
  return bullets.slice(0, 2);
}

const V_CARD: Record<BookAudienceRoute["variant"], string> = {
  gold: "bg-surface border-border hover:border-brand-red/50 hover:shadow-md",
  neutral: "bg-background border-border hover:border-foreground/20 hover:shadow-md",
  luxury:
    "border-border bg-surface hover:border-brand-red/40 hover:shadow-[0_8px_32px_rgba(212,43,43,0.12)]",
  academy: "bg-background border-border hover:border-brand-red/40 hover:shadow-md",
  online: "bg-background border-border hover:border-brand-red/40 hover:shadow-md",
};

const V_BADGE: Record<BookAudienceRoute["variant"], string> = {
  gold: "bg-brand-red/10 text-brand-red",
  neutral: "bg-brand-red/10 text-brand-red",
  luxury: "bg-brand-red/20 text-brand-red",
  academy: "bg-brand-red/10 text-brand-red",
  online: "bg-brand-red/10 text-brand-red",
};

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type BookAudienceCardProps = {
  route: BookAudienceRoute;
  boosted?: boolean;
  compact?: boolean;
  resumeQualOpen?: boolean;
  onFullPath: (route: BookAudienceRoute, emotionalLabel: string | null) => void;
};

export default function BookAudienceCard({
  route,
  boosted = false,
  compact = false,
  resumeQualOpen = false,
  onFullPath,
}: BookAudienceCardProps) {
  const savedDraft = useMemo(() => {
    const draft = readBookQualificationDraft();
    if (draft?.data.routeId === route.id) return draft.data;
    return null;
  }, [route.id]);

  const [emotionalId, setEmotionalId] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [qualFormOpen, setQualFormOpen] = useState(resumeQualOpen || Boolean(savedDraft));
  const [qualAnswers, setQualAnswers] = useState<Record<string, string>>(
    savedDraft?.answers ?? {},
  );

  const emotionalLabel =
    route.emotionalOptions.find((o) => o.id === emotionalId)?.label ??
    savedDraft?.emotionalLabel ??
    null;

  const videoId = YOUTUBE_SERVICE_EMBED_IDS[route.demoVideoKey];
  const qualificationFields = getQualificationFields(route);
  const bullets = cardBullets(route);
  const audioDemoId = ROUTE_AUDIO_DEMO[route.id];

  const persistQualDraft = useCallback(
    (answers: Record<string, string>) => {
      if (!hasMeaningfulQualificationAnswers(answers)) {
        const current = readBookQualificationDraft();
        if (current?.data.routeId === route.id) {
          clearBookQualificationDraft();
        }
        return;
      }
      writeBookQualificationDraft({
        routeId: route.id,
        categoryId: route.categoryId,
        answers,
        emotionalLabel,
      });
    },
    [route.id, route.categoryId, emotionalLabel],
  );

  useEffect(() => {
    if (!resumeQualOpen) return;
    setQualFormOpen(true);
    requestAnimationFrame(() => {
      document.getElementById(`book-route-${route.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [resumeQualOpen, route.id]);

  useEffect(() => {
    persistQualDraft(qualAnswers);
  }, [qualAnswers, persistQualDraft]);

  function sendQualifiedWhatsApp(answers: Record<string, string>) {
    const text = buildFastWhatsAppMessage(route, emotionalLabel, answers);
    const href = buildWhatsAppHref({
      text,
      utm_source: "website",
      utm_campaign: route.utm_campaign,
    });
    trackConversion("book_fast_whatsapp", {
      route_id: route.id,
      category: route.categoryId,
    });
    clearBookQualificationDraft();
    mirrorWhatsAppLeadToEmail({
      href,
      formId: `book_audience_${route.id.replace(/[^a-z0-9_]/gi, "_").slice(0, 40)}`,
      subject: `ליד מהיר /book - ${route.title}`,
      body: text,
      leadCategory: route.categoryId,
    });
    setQualFormOpen(false);
  }

  function openFeasibilityCheck() {
    if (!route.feasibilityCheckMessage) return;
    const href = buildWhatsAppHref({
      text: route.feasibilityCheckMessage,
      utm_source: "website",
      utm_campaign: route.feasibilityUtmCampaign ?? route.utm_campaign,
    });
    mirrorWhatsAppLeadToEmail({
      href,
      formId: `book_feasibility_${route.id.replace(/[^a-z0-9_]/gi, "_").slice(0, 36)}`,
      subject: `בדיקת התאמה /book - ${route.title}`,
      body: route.feasibilityCheckMessage,
      leadCategory: route.categoryId,
    });
  }

  return (
    <>
      <article
        id={`book-route-${route.id}`}
        className={cn(
          "book-service-card relative flex h-full min-w-0 flex-col rounded-2xl border bg-surface p-5 shadow-sm transition-all duration-200",
          V_CARD[route.variant],
          boosted && "ring-2 ring-brand-red/40 ring-offset-2 ring-offset-background",
          resumeQualOpen && "ring-2 ring-brand-red/30",
        )}
      >
        {boosted && (
          <span className="absolute -top-2.5 end-4 rounded-full bg-brand-red px-2.5 py-0.5 text-[0.65rem] font-bold text-white">
            מבוקש
          </span>
        )}
        {!boosted && route.popularBadge ? (
          <span className="absolute -top-2.5 end-4 rounded-full bg-brand-red/90 px-2.5 py-0.5 text-[0.65rem] font-bold text-white">
            {route.popularBadge}
          </span>
        ) : null}

        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xl">
            {route.icon}
          </span>
          <span className={cn("rounded-md px-2.5 py-1 text-[0.62rem] font-bold uppercase", V_BADGE[route.variant])}>
            {route.tag}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold leading-snug text-foreground">{route.title}</h3>
          {audioDemoId && !compact ? (
            <MicroAudioAudition demoId={audioDemoId} className="shrink-0 scale-75" />
          ) : null}
        </div>
        {!compact ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{route.description}</p>
          </>
        ) : (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{route.description}</p>
        )}

        <div className="mt-4 flex-1">
          <BookPriceDual exVat={route.priceExVat} dualLabel={route.startingPriceDual} size="sm" />
          {!compact && bullets.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {bullets.map((line) => (
                <li key={line} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-0.5 text-brand-red" aria-hidden="true">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-2 text-xs font-medium text-foreground">{route.valueFrame}</p>
          {!compact ? (
            <PriceSocialProof className="mt-2" categoryId={route.categoryId} />
          ) : null}
          <p className="mt-3 text-[0.65rem] text-muted-foreground">
            <span aria-hidden="true">🔒 </span>
            סליקה מאובטחת · ביטול עד 14 יום
          </p>
        </div>

        {compact ? null : (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-foreground">{route.emotionalQuestion}</p>
          <div className="flex flex-wrap gap-1.5">
            {route.emotionalOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEmotionalId(emotionalId === opt.id ? null : opt.id)}
                className={cn(
                  "min-h-11 rounded-full border px-3 text-xs transition-colors",
                  emotionalId === opt.id
                    ? "border-brand-red bg-brand-red/10 text-brand-red"
                    : "border-border text-muted-foreground hover:border-brand-red/40",
                )}
                aria-pressed={emotionalId === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        )}

        {compact ? null : (
        <button
          type="button"
          onClick={() => setVideoOpen(true)}
          className="mt-4 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-brand-red underline-offset-2 hover:underline"
        >
          ▶ איך זה נראה?
        </button>
        )}

        <BookQualificationMiniForm
          route={route}
          fields={qualificationFields}
          open={qualFormOpen}
          initialAnswers={qualAnswers}
          onAnswersChange={setQualAnswers}
          onSubmit={sendQualifiedWhatsApp}
          onFullPath={() => onFullPath(route, emotionalLabel)}
        />

        <div className={cn("mt-4 grid gap-2", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
          <button
            type="button"
            onClick={() => setQualFormOpen((v) => !v)}
            aria-expanded={qualFormOpen}
            aria-label={`קבלו הצעה תוך דקה ל${route.title} - ${catalogWithVat(route.priceExVat).toLocaleString("he-IL")} שקל סופי`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1fba59] hover:shadow-md active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            <WaIcon />
            קבלו הצעה תוך דקה
          </button>
          <button
            type="button"
            onClick={() => onFullPath(route, emotionalLabel)}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-red-light hover:shadow-md active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            בנו הצעה מפורטת
          </button>
        </div>

        {compact ? null : route.feasibilityCheckMessage ? (
          <button
            type="button"
            onClick={openFeasibilityCheck}
            className="mt-2 inline-flex min-h-9 w-full items-center justify-center text-xs font-medium text-brand-red underline-offset-2 hover:underline"
          >
            שלחו קובץ לבדיקת היתכנות חינם
          </button>
        ) : null}

        {!compact && route.servicePageHref ? (
          <Link
            href={route.servicePageHref}
            className="mt-3 inline-flex min-h-9 w-full items-center justify-center text-xs text-muted-foreground underline-offset-2 hover:text-brand-red hover:underline"
          >
            למידע נוסף על השירות
          </Link>
        ) : null}
      </article>

      <BookDemoVideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoId={videoId}
        title={route.title}
      />
    </>
  );
}
