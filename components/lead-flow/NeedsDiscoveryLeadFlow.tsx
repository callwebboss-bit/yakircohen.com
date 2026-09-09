"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MultiStepLeadShell from "@/components/leads/MultiStepLeadShell";
import PackageTierCards from "@/components/lead-flow/PackageTierCards";
import HoldCountdown from "@/components/lead-flow/HoldCountdown";
import { DISCOVERY_QUESTIONS } from "@/lib/data/lead-flow/discovery-questions";
import { SCOPE_BLOCKS } from "@/lib/data/lead-flow/scope-blocks";
import {
  PACKAGE_TIERS,
  resolveTierCatalogId,
  type PackageTierId,
} from "@/lib/data/lead-flow/packages";
import { getUpsellsForService } from "@/lib/data/lead-flow/upsells";
import {
  computeHoldExpiresAt,
  HOLD_POLICY_TEXT,
  HOLD_STORAGE_KEY,
} from "@/lib/data/lead-flow/payment-hold";
import {
  LEAD_FLOW_SERVICES,
  getLeadFlowService,
  isLeadFlowServiceId,
  type LeadFlowServiceId,
} from "@/lib/data/lead-flow/services";
import {
  formatLeadFlowPrice,
  sumExVat,
  tryGetExVat,
  PRICE_FALLBACK_LABEL,
} from "@/lib/data/lead-flow/resolve-price";
import { buildLeadFlowWhatsAppHref } from "@/lib/data/lead-flow/build-whatsapp";
import { trackFlowStep } from "@/lib/data/lead-flow/track-flow-step";
import {
  LEAD_FLOW_STEPS,
  isLeadFlowStepId,
  type LeadFlowStepId,
} from "@/lib/data/lead-flow/steps";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { trackConversion } from "@/lib/analytics/conversion-events";

const STEP_INDEX: Record<LeadFlowStepId, number> = {
  needs: 0,
  scope: 1,
  packages: 2,
  upsells: 3,
  hold: 4,
};

type NeedsDiscoveryLeadFlowProps = {
  defaultServiceId?: LeadFlowServiceId;
};

export default function NeedsDiscoveryLeadFlow({
  defaultServiceId,
}: NeedsDiscoveryLeadFlowProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedStep = useRef<string | null>(null);

  const [serviceId, setServiceId] = useState<LeadFlowServiceId | null>(
    defaultServiceId ?? null,
  );
  const [stepId, setStepId] = useState<LeadFlowStepId>("needs");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [priceRevealed, setPriceRevealed] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PackageTierId | null>(null);
  const [upsellIds, setUpsellIds] = useState<string[]>([]);
  const [holdExpiresAt, setHoldExpiresAt] = useState<number | null>(null);

  // Hydration-safe: sync from URL after mount
  useEffect(() => {
    const qsService = searchParams.get("flowService");
    const qsStep = searchParams.get("flowStep");
    if (!defaultServiceId && qsService && isLeadFlowServiceId(qsService)) {
      setServiceId(qsService);
    }
    if (qsStep && isLeadFlowStepId(qsStep)) {
      setStepId(qsStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial URL sync only
  }, []);

  const syncUrl = useCallback(
    (nextService: LeadFlowServiceId | null, nextStep: LeadFlowStepId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("flow", "needs");
      if (nextService) params.set("flowService", nextService);
      else params.delete("flowService");
      params.set("flowStep", nextStep);
      const qs = params.toString();
      router.replace(`${pathname}?${qs}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const goStep = useCallback(
    (next: LeadFlowStepId) => {
      setStepId(next);
      syncUrl(serviceId, next);
    },
    [serviceId, syncUrl],
  );

  useEffect(() => {
    if (!serviceId) return;
    const key = `${serviceId}:${stepId}`;
    if (trackedStep.current === key) return;
    trackedStep.current = key;
    trackFlowStep(stepId, { service: serviceId });
  }, [serviceId, stepId]);

  // Browser back/forward
  useEffect(() => {
    const qsStep = searchParams.get("flowStep");
    const qsService = searchParams.get("flowService");
    if (qsStep && isLeadFlowStepId(qsStep) && qsStep !== stepId) {
      setStepId(qsStep);
    }
    if (
      !defaultServiceId &&
      qsService &&
      isLeadFlowServiceId(qsService) &&
      qsService !== serviceId
    ) {
      setServiceId(qsService);
    }
  }, [searchParams, stepId, serviceId, defaultServiceId]);

  const questions = serviceId ? DISCOVERY_QUESTIONS[serviceId] : [];
  const scope = serviceId ? SCOPE_BLOCKS[serviceId] : null;
  const allAnswered =
    !!serviceId && questions.every((q) => Boolean(answers[q.id]));

  const tierPrices = useMemo(() => {
    if (!serviceId) return [];
    return (["full", "adapted", "economy"] as const).map((tierId) => {
      const catalogId = resolveTierCatalogId(serviceId, tierId, answers);
      return { tierId, exVat: tryGetExVat(catalogId) };
    });
  }, [serviceId, answers]);

  const selectedTierExVat = useMemo(() => {
    if (!selectedTier) return null;
    return tierPrices.find((t) => t.tierId === selectedTier)?.exVat ?? null;
  }, [selectedTier, tierPrices]);

  const upsells = serviceId ? getUpsellsForService(serviceId) : [];
  const upsellExVatList = upsellIds.map((id) => {
    const u = upsells.find((x) => x.id === id);
    return u ? tryGetExVat(u.catalogId) : null;
  });
  const totalExVat = sumExVat([selectedTierExVat, ...upsellExVatList]);
  const totalDisplay = formatLeadFlowPrice(totalExVat);

  const answerLabels = useMemo(() => {
    if (!serviceId) return {};
    const labels: Record<string, string> = {};
    for (const q of DISCOVERY_QUESTIONS[serviceId]) {
      const optId = answers[q.id];
      const opt = q.options.find((o) => o.id === optId);
      if (opt) labels[q.prompt] = opt.label;
    }
    return labels;
  }, [serviceId, answers]);

  const selectService = (id: LeadFlowServiceId) => {
    setServiceId(id);
    setAnswers({});
    setPriceRevealed(false);
    setSelectedTier(null);
    setUpsellIds([]);
    setHoldExpiresAt(null);
    setStepId("needs");
    syncUrl(id, "needs");
    trackFlowStep("service", { service: id });
  };

  const onSelectTier = (tierId: PackageTierId) => {
    setSelectedTier(tierId);
    const expires = computeHoldExpiresAt();
    setHoldExpiresAt(expires);
    try {
      window.localStorage.setItem(HOLD_STORAGE_KEY, String(expires));
    } catch {
      /* ignore */
    }
  };

  const toggleUpsell = (id: string) => {
    setUpsellIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const submitWa = () => {
    if (!serviceId || !selectedTier) return;
    const href = buildLeadFlowWhatsAppHref({
      serviceId,
      answers,
      answerLabels,
      tierId: selectedTier,
      tierCatalogExVat: selectedTierExVat,
      selectedUpsellIds: upsellIds,
      holdExpiresAt,
    });
    trackConversion("needs_flow_wa_submit", { service: serviceId, tier: selectedTier });
    openWhatsAppLead(href);
  };

  const stepIndex = STEP_INDEX[stepId];

  if (!serviceId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">בחרו שירות להתאמת הצעה:</p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LEAD_FLOW_SERVICES.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => selectService(s.id)}
                className="flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:border-brand-red/50"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const serviceLabel = getLeadFlowService(serviceId)?.label ?? serviceId;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">שירות: {serviceLabel}</p>
        {!defaultServiceId ? (
          <button
            type="button"
            className="min-h-12 text-sm font-medium text-brand-red underline-offset-2 hover:underline"
            onClick={() => {
              setServiceId(null);
              setStepId("needs");
              syncUrl(null, "needs");
            }}
          >
            החלפת שירות
          </button>
        ) : null}
      </div>

      <MultiStepLeadShell steps={[...LEAD_FLOW_STEPS]} stepIndex={stepIndex}>
        {stepId === "needs" ? (
          <div className="space-y-6">
            {questions.map((q) => (
              <fieldset key={q.id} className="space-y-2">
                <legend className="text-sm font-semibold text-foreground">
                  {q.prompt}
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => {
                    const active = answers[q.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                        }
                        aria-pressed={active}
                        className={`min-h-12 rounded-xl border px-3 text-start text-sm ${
                          active
                            ? "border-brand-red bg-brand-red/5 font-semibold"
                            : "border-border bg-surface"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={!allAnswered}
                onClick={() => goStep("scope")}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-6 text-sm font-semibold text-white disabled:opacity-40"
              >
                המשך
              </button>
            </div>
          </div>
        ) : null}

        {stepId === "scope" && scope ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <ScopeCard title="מה כלול" items={scope.includes} />
              <ScopeCard title="מה לא כלול" items={scope.excludes} />
              <div className="space-y-4">
                <ScopeCard title="למי מתאים" items={scope.suitedFor} />
                <ScopeCard title="למי לא מתאים" items={scope.notSuitedFor} />
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <button
                type="button"
                onClick={() => goStep("needs")}
                className="min-h-12 rounded-xl border border-border px-5 text-sm font-medium"
              >
                חזרה
              </button>
              <button
                type="button"
                onClick={() => goStep("packages")}
                className="min-h-12 rounded-xl bg-brand-red px-6 text-sm font-semibold text-white"
              >
                המשך למחיר
              </button>
            </div>
          </div>
        ) : null}

        {stepId === "packages" ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              המחירים לפני מע״מ (+18%). אחרי בחירה רואים גם כולל מע״מ.
            </p>
            <PackageTierCards
              serviceId={serviceId}
              prices={tierPrices}
              selectedTier={selectedTier}
              revealed={priceRevealed}
              onReveal={() => setPriceRevealed(true)}
              onSelect={onSelectTier}
            />
            <div className="flex flex-wrap justify-between gap-2">
              <button
                type="button"
                onClick={() => goStep("scope")}
                className="min-h-12 rounded-xl border border-border px-5 text-sm font-medium"
              >
                חזרה
              </button>
              <button
                type="button"
                disabled={!selectedTier || !priceRevealed}
                onClick={() => goStep("upsells")}
                className="min-h-12 rounded-xl bg-brand-red px-6 text-sm font-semibold text-white disabled:opacity-40"
              >
                המשך לתוספות
              </button>
            </div>
          </div>
        ) : null}

        {stepId === "upsells" ? (
          <div className="space-y-6">
            <ul className="space-y-3">
              {upsells.map((u) => {
                const ex = tryGetExVat(u.catalogId);
                const price = formatLeadFlowPrice(ex);
                const checked = upsellIds.includes(u.id);
                return (
                  <li key={u.id}>
                    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5 accent-[var(--brand-red,#d42b2b)]"
                        checked={checked}
                        onChange={() => toggleUpsell(u.id)}
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {u.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {price.line}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm font-semibold text-foreground">
              סה״כ נכון לכרגע:{" "}
              {totalDisplay.isFallback ? PRICE_FALLBACK_LABEL : totalDisplay.line}
            </p>
            <div className="flex flex-wrap justify-between gap-2">
              <button
                type="button"
                onClick={() => goStep("packages")}
                className="min-h-12 rounded-xl border border-border px-5 text-sm font-medium"
              >
                חזרה
              </button>
              <button
                type="button"
                onClick={() => goStep("hold")}
                className="min-h-12 rounded-xl bg-brand-red px-6 text-sm font-semibold text-white"
              >
                המשך ל-Hold
              </button>
            </div>
          </div>
        ) : null}

        {stepId === "hold" ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-brand-red/30 bg-surface px-4 py-4 text-sm leading-relaxed text-foreground">
              {HOLD_POLICY_TEXT}
            </div>
            <HoldCountdown expiresAt={holdExpiresAt} />
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
              <p className="font-semibold text-foreground">
                חבילה: {selectedTier ? PACKAGE_TIERS[serviceId][selectedTier].title : " - "}
              </p>
              <p className="mt-1 text-muted-foreground">
                סה״כ נכון לכרגע:{" "}
                {totalDisplay.isFallback ? PRICE_FALLBACK_LABEL : totalDisplay.line}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
              <button
                type="button"
                onClick={() => goStep("upsells")}
                className="min-h-12 rounded-xl border border-border px-5 text-sm font-medium"
              >
                חזרה
              </button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href="/book"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground"
                >
                  קביעת תאריך ביומן
                </a>
                <button
                  type="button"
                  onClick={submitWa}
                  disabled={!selectedTier}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-6 text-sm font-semibold text-white disabled:opacity-40"
                >
                  שליחת הצעה בוואטסאפ
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </MultiStepLeadShell>
    </div>
  );
}

function ScopeCard({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 list-disc space-y-1 pe-4 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
