"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import EventIndexAttractionsBundle from "@/components/marketing/EventIndexAttractionsBundle";
import EventIndexAttractionsCatalog from "@/components/marketing/EventIndexAttractionsCatalog";
import EventIndexProducerPitch from "@/components/marketing/EventIndexProducerPitch";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  EVENT_INDEX_HAS_DATA,
  EVENT_INDEX_WEEK,
  type EventIndexWeek,
} from "@/lib/data/event-index.generated";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const TOKEN_STORAGE_KEY = "yc_event_index_token";

type FullPayload = {
  index: EventIndexWeek;
  hasData: boolean;
  alerts: { id: string; message: string; segmentLabel: string; suggestedPremiumPct: number }[];
};

async function fetchEventIndexFull(
  bearer: string,
): Promise<
  | { ok: true; data: FullPayload }
  | { ok: false; status: number }
  | { ok: false; status: "network" }
> {
  try {
    const res = await fetch("/api/event-index/full", {
      headers: { Authorization: `Bearer ${bearer}` },
    });
    if (!res.ok) return { ok: false, status: res.status };
    const data = (await res.json()) as FullPayload;
    return { ok: true, data };
  } catch {
    return { ok: false, status: "network" };
  }
}

function formatNis(n: number | null): string {
  if (n == null) return "לא זמין";
  return `${n.toLocaleString("he-IL")} שקלים`;
}

function TrendBar({ pct }: { pct: number }) {
  const w = Math.min(100, Math.abs(pct));
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${pct >= 0 ? "bg-brand-red" : "bg-muted-foreground/40"}`}
          style={{ width: `${w}%` }}
        />
      </div>
      <span className="min-w-[4rem] text-end font-medium tabular-nums">
        {pct >= 0 ? "+" : ""}
        {pct}%
      </span>
    </div>
  );
}

function IndexBody({ index, isTeaser }: { index: EventIndexWeek; isTeaser: boolean }) {
  const rising = index.topRising.slice(0, isTeaser ? 2 : 5);
  const segments = index.segments.slice(0, isTeaser ? 2 : undefined);

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="text-xs font-semibold text-muted-foreground">לידים השבוע</p>
          <p className="mt-2 font-serif text-3xl font-semibold">
            {index.sampleSize || "לא זמין"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="text-xs font-semibold text-muted-foreground">שבוע</p>
          <p className="mt-2 text-lg font-medium">{index.weekOf}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="text-xs font-semibold text-muted-foreground">עודכן</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {index.publishedAt ? new Date(index.publishedAt).toLocaleDateString("he-IL") : "לא עודכן"}
          </p>
        </div>
      </div>

      {rising.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold">במגמת עלייה</h2>
          <ul className="mt-4 space-y-3">
            {rising.map((r) => (
              <li
                key={r.id}
                className={`rounded-xl border border-border p-4 ${isTeaser ? "blur-[2px] select-none" : ""}`}
              >
                <div className="flex justify-between gap-4">
                  <span className="font-medium">{r.label}</span>
                  <span className="font-semibold text-brand-red">+{r.trendPct}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="font-serif text-xl font-semibold">ממוצעי מחיר סגור</h2>
        {!segments.length && (
          <p className="mt-4 text-sm text-muted-foreground">
            עדיין אין מספיק נתונים מסוננים לפרסום. מנויים יקבלו גישה מלאה עם צבירת עסקאות.
          </p>
        )}
        <div className="mt-4 space-y-4">
          {segments.map((s) => (
            <article
              key={s.id}
              className={`rounded-xl border border-border p-5 ${isTeaser && !s.sampleSufficient ? "blur-sm select-none" : ""}`}
            >
              <h3 className="font-semibold">{s.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {s.sampleSufficient ? (
                  <>
                    ממוצע סגירה {formatNis(s.avgClosedPriceNis)} לפני מע״מ
                    <span className="mx-1 text-border">|</span>
                    {s.closedCount} עסקאות
                    {s.catalogBenchmarkNis ? (
                      <>
                        <span className="mx-1 text-border">|</span>
                        מחירון {formatNis(s.catalogBenchmarkNis)}
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    נדרשות לפחות 5 סגירות
                    <span className="mx-1 text-border">|</span>
                    {s.leadCount} לידים השבוע
                  </>
                )}
              </p>
              <div className="mt-3">
                <TrendBar pct={s.demandTrendPct} />
              </div>
            </article>
          ))}
        </div>
      </div>

      {!isTeaser && index.attractions.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold">ביקוש לפי אטרקציה</h2>
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
            {index.attractions.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                <span>{a.label}</span>
                <span className="font-medium tabular-nums">
                  {a.demandTrendPct >= 0 ? "עלייה " : "ירידה "}
                  {Math.abs(a.demandTrendPct)}%
                  <span className="mx-1 text-border">|</span>
                  {a.leadCount} לידים
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function EventIndexPageContent() {
  const [tokenInput, setTokenInput] = useState("");
  const [fullData, setFullData] = useState<FullPayload | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasFullAccess = fullData !== null;

  const applyFetchResult = useCallback(
    (result: Awaited<ReturnType<typeof fetchEventIndexFull>>, bearer: string) => {
      if (result.ok) {
        setFullData(result.data);
        sessionStorage.setItem(TOKEN_STORAGE_KEY, bearer);
        setTokenInput(bearer);
        setLoadError("");
        return;
      }
      setFullData(null);
      if (result.status === 401) setLoadError("קוד גישה לא תקין");
      else if (result.status === "network") setLoadError("לא ניתן להתחבר לשרת");
      else setLoadError("שגיאה בטעינה");
    },
    [],
  );

  const loadFull = useCallback(
    async (bearer: string) => {
      setLoading(true);
      setLoadError("");
      const result = await fetchEventIndexFull(bearer);
      applyFetchResult(result, bearer);
      setLoading(false);
    },
    [applyFetchResult],
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!saved) return;

    let cancelled = false;
    void fetchEventIndexFull(saved).then((result) => {
      if (!cancelled) applyFetchResult(result, saved);
    });

    return () => {
      cancelled = true;
    };
  }, [applyFetchResult]);

  const displayIndex = fullData?.index ?? EVENT_INDEX_WEEK;
  const waHref = buildWhatsAppHref({
    text: "שלום, מעוניין/ת במנוי דופק השוק. אשמח לנתונים על מחירים וביקוש באירועים.",
    utm_source: "website",
    utm_campaign: "event_index_subscription",
  });

  return (
    <article>
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-4xl">
          <p className="text-xs font-semibold text-muted-foreground">
            שירותים מקצועיים - מודיעין שוק
          </p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            דופק השוק
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            מחירון אטרקציות למפיקים, השוואת ספקים, ומדד שבועי של מה נסגר
            בשוק.
          </p>
          <nav
            className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium"
            aria-label="קפיצה לחלקי העמוד"
          >
            <a href="#producer-services" className="text-brand-red hover:underline">
              שירותי אטרקציות
            </a>
            <a href="#bundle-picker" className="text-brand-red hover:underline">
              חבילת שלוש
            </a>
            <a href="#price-compare" className="text-brand-red hover:underline">
              השוואת מחירים
            </a>
            <a href="#market-index" className="text-brand-red hover:underline">
              מדד שוק
            </a>
          </nav>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              בקשת מנוי בוואטסאפ
            </a>
            <Link
              href="/pro"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:border-brand-red/40"
            >
              חזרה למרכז השירותים
            </Link>
          </div>
        </Container>
      </Section>

      <Section padding="sm" className="border-b border-border bg-muted/20">
        <Container className="max-w-4xl space-y-10">
          <EventIndexProducerPitch />
          <EventIndexAttractionsBundle />
          <EventIndexAttractionsCatalog
            index={displayIndex}
            hasFullAccess={hasFullAccess}
          />
        </Container>
      </Section>

      <Section padding="sm" id="market-index" className="scroll-mt-24 border-b border-border">
        <Container className="max-w-4xl">
          <div className="mb-8">
            <h2 className="font-serif text-xl font-semibold">מדד שוק שבועי</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              ממוצעי סגירה, מגמות ביקוש והתרעות מלאי. גישה מלאה למנויים.
            </p>
          </div>

          {!hasFullAccess && (
            <div className="mb-8 rounded-xl border border-dashed border-brand-red/30 bg-brand-red/5 p-5">
              <p className="text-sm font-medium">תצוגה מקדימה למנויים</p>
              <p className="mt-1 text-sm text-muted-foreground">
                הזינו קוד גישה שקיבלתם אחרי ההרשמה, או בקשו מנוי בטופס למטה.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="קוד גישה"
                  className="min-h-11 min-w-[200px] flex-1 rounded-lg border border-border bg-background px-4 text-sm"
                  autoComplete="off"
                />
                <button
                  type="button"
                  disabled={loading || !tokenInput.trim()}
                  onClick={() => void loadFull(tokenInput.trim())}
                  className="min-h-11 rounded-lg bg-foreground px-5 text-sm font-semibold text-background disabled:opacity-50"
                >
                  {loading ? "טוען…" : "פתיחת המדד"}
                </button>
              </div>
              {loadError ? <p className="mt-2 text-sm text-brand-red">{loadError}</p> : null}
            </div>
          )}

          <IndexBody index={displayIndex} isTeaser={!hasFullAccess} />

          {!EVENT_INDEX_HAS_DATA && !hasFullAccess && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              הנתונים מתעדכנים שבועית. הפרסום הראשון יופיע אחרי צבירת לידים מספקת.
            </p>
          )}
        </Container>
      </Section>

      <Section padding="sm" className="border-t border-border bg-muted/30">
        <Container className="max-w-lg">
          <CallbackLeadForm
            heading="רוצים גישה לדופק השוק?"
            description="השאירו פרטים. נחזור עם מנוי וקוד גישה למדד המלא."
            formId="event_index_subscription"
            utmCampaign="event_index_subscription"
            source="/pro/event-index"
            serviceOptions={[
              "ספק אירועים / דיג'יי",
              "חברת הגברה",
              "מפיק או מפיקה",
              "אחר",
            ]}
          />
        </Container>
      </Section>
    </article>
  );
}
