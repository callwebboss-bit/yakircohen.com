"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  buildMashupIdeaWhatsAppText,
  getMashupIdeas,
  MASHUP_MOMENT_LABELS,
  MASHUP_MOMENT_ORDER,
  MASHUP_TIER_LABELS,
  MASHUP_TIER_ORDER,
  type DjMashupIdea,
  type MashupMoment,
  type MashupTier,
} from "@/lib/data/dj-mashup-ideas";
import {
  formatMusicLine,
  getCompatibilityLevel,
  type MashupYoutubeDemo,
} from "@/lib/mashup-music-theory";
import MashupYoutubeModal from "@/components/seo/MashupYoutubeModal";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const WISHLIST_KEY = "yc_mashup_wishlist";

type MomentFilter = MashupMoment | "הכל";
type TierFilter = MashupTier | "הכל";

const ENERGY_STYLES = {
  גבוה: "bg-brand-red/10 text-brand-red",
  בינוני: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  רך: "bg-muted text-muted-foreground",
} as const;

const COMPAT_STYLES = {
  גבוהה: "text-emerald-700 dark:text-emerald-400",
  בינונית: "text-amber-700 dark:text-amber-400",
  "דרוג+": "text-brand-red",
} as const;

const TIER_STYLES = {
  יצירתי: "border-brand-red/25 bg-brand-red/5",
  רחבה: "border-border bg-surface",
} as const;

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function writeWishlist(ids: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

export default function DjMashupIdeasSection() {
  const [tierFilter, setTierFilter] = useState<TierFilter>("יצירתי");
  const [momentFilter, setMomentFilter] = useState<MomentFilter>("הכל");
  const [demoOnly, setDemoOnly] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [youtubeDemo, setYoutubeDemo] = useState<MashupYoutubeDemo | null>(null);

  useEffect(() => {
    setWishlist(readWishlist());
  }, []);

  const ideas = getMashupIdeas({
    moment: momentFilter,
    tier: tierFilter,
    hasDemo: demoOnly,
  });

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeWishlist(next);
      return next;
    });
  }, []);

  const wishlistWaHref = buildWhatsAppHref({
    text: `שלום, שמרתי ${wishlist.length} רעיונות מאשאפ מהאתר:\n${wishlist.join(", ")}\nאשמח להצעה על גרסאות מוכנות / חבילה.`,
    utm_source: "website",
    utm_campaign: "dj_mashup_wishlist",
  });

  return (
    <>
      <section id="mashup-ideas" aria-labelledby="mashup-ideas-heading">
        <h2 id="mashup-ideas-heading" className="text-2xl font-semibold text-foreground">
          שילובים עם BPM, סולם והרמוניה
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          לא רק רעיונות — לכל שילוב יש קצב, סולם Camelot והסבר למה זה מחזיק מוזיקלית.
          אפשר לקחת את זה ולערוך בדרך שלך, או לבקש גרסה מהאולפן.
        </p>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">סוג שילוב</p>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="סינון לפי סוג">
            <FilterChip active={tierFilter === "הכל"} onClick={() => setTierFilter("הכל")}>
              הכל
            </FilterChip>
            {MASHUP_TIER_ORDER.map((tier) => (
              <FilterChip
                key={tier}
                active={tierFilter === tier}
                onClick={() => setTierFilter(tier)}
              >
                {MASHUP_TIER_LABELS[tier]}
              </FilterChip>
            ))}
          </div>

          <p className="pt-2 text-xs font-medium text-muted-foreground">רגע באירוע</p>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="סינון לפי רגע באירוע">
            <FilterChip active={momentFilter === "הכל"} onClick={() => setMomentFilter("הכל")}>
              הכל
            </FilterChip>
            {MASHUP_MOMENT_ORDER.map((moment) => (
              <FilterChip
                key={moment}
                active={momentFilter === moment}
                onClick={() => setMomentFilter(moment)}
              >
                {MASHUP_MOMENT_LABELS[moment]}
              </FilterChip>
            ))}
            <FilterChip active={demoOnly} onClick={() => setDemoOnly((v) => !v)}>
              יש דוגמה ביוטיוב
            </FilterChip>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              saved={wishlist.includes(idea.id)}
              onToggleSave={() => toggleWishlist(idea.id)}
              onPlayDemo={setYoutubeDemo}
            />
          ))}
        </div>

        {ideas.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            אין שילובים בסינון הזה — נסו &quot;הכל&quot; או בטלו את פילטר היוטיוב.
          </p>
        ) : null}

        <p className="mt-4 text-xs text-muted-foreground">
          השראה בלבד — לא הורדה מהאתר. דוגמות יוטיוב הן רפרנס או גרסה מהאולפן.
        </p>
      </section>

      {wishlist.length > 0 ? (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-lg flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-red/30 bg-surface px-4 py-3 shadow-lg sm:left-auto">
          <p className="text-sm text-foreground">
            {wishlist.length} שילובים שמורים
          </p>
          <div className="flex gap-2">
            <Link
              href={`#wizard-mashup-fixer?ideas=${wishlist.join(",")}`}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-brand-red/40"
            >
              טופס
            </Link>
            <a
              href={wishlistWaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red-light"
            >
              וואטסאפ
            </a>
          </div>
        </div>
      ) : null}

      <MashupYoutubeModal demo={youtubeDemo} onClose={() => setYoutubeDemo(null)} />
    </>
  );
}

function IdeaCard({
  idea,
  saved,
  onToggleSave,
  onPlayDemo,
}: {
  idea: DjMashupIdea;
  saved: boolean;
  onToggleSave: () => void;
  onPlayDemo: (demo: MashupYoutubeDemo) => void;
}) {
  const tier = idea.tier ?? "רחבה";
  const compat = idea.music ? getCompatibilityLevel(idea.music) : null;
  const waHref = buildWhatsAppHref({
    text: buildMashupIdeaWhatsAppText(idea),
    utm_source: "website",
    utm_campaign: tier === "יצירתי" ? "dj_mashup_creative" : "dj_mashup_idea",
  });

  return (
    <article className={cn("flex flex-col rounded-xl border p-5", TIER_STYLES[tier])}>
      <div className="flex flex-wrap items-center gap-2">
        {tier === "יצירתי" ? (
          <span className="rounded-full bg-brand-red px-2.5 py-0.5 text-xs font-semibold text-white">
            {MASHUP_TIER_LABELS.יצירתי}
          </span>
        ) : null}
        {idea.technique ? (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {idea.technique}
          </span>
        ) : null}
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {MASHUP_MOMENT_LABELS[idea.moment]}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            ENERGY_STYLES[idea.energy],
          )}
        >
          אנרגיה {idea.energy}
        </span>
        {compat ? (
          <span className={cn("text-xs font-medium", COMPAT_STYLES[compat])}>
            תאימות {compat}
          </span>
        ) : null}
      </div>

      {idea.hook ? (
        <p className="mt-3 text-sm font-medium leading-snug text-foreground">{idea.hook}</p>
      ) : null}

      <h3
        className={cn(
          "text-sm font-semibold leading-snug text-foreground",
          idea.hook ? "mt-2" : "mt-3",
        )}
      >
        {idea.songA}
        <span className="mx-1.5 font-normal text-muted-foreground">×</span>
        {idea.songB}
      </h3>

      {idea.music ? (
        <p className="mt-2 font-mono text-xs text-foreground/80">
          {formatMusicLine(idea.music)}
        </p>
      ) : null}
      {idea.music?.harmony.note ? (
        <p className="mt-1 text-xs text-muted-foreground">{idea.music.harmony.note}</p>
      ) : null}

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {idea.whyItWorks}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-foreground/80">
        <span className="font-medium">איפה לחבר: </span>
        {idea.mergeTip}
      </p>
      {idea.upgradePlus ? (
        <p className="mt-2 text-xs leading-relaxed text-brand-red/90">
          <span className="font-medium">דרוג+: </span>
          {idea.upgradePlus}
        </p>
      ) : null}

      {!idea.music && (idea.bpmHint || idea.keyHint || idea.technicalNote) ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {idea.bpmHint ? `BPM: ${idea.bpmHint}` : null}
          {idea.bpmHint && idea.keyHint ? " · " : null}
          {idea.keyHint ? `סולם: ${idea.keyHint}` : null}
          {idea.technicalNote ? ` · ${idea.technicalNote}` : null}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {idea.youtubeDemo ? (
          <button
            type="button"
            onClick={() => onPlayDemo(idea.youtubeDemo!)}
            className="inline-flex min-h-9 items-center rounded-lg border border-border px-3 text-xs font-semibold text-foreground hover:border-brand-red/40"
          >
            שמעו דוגמה
          </button>
        ) : (
          <span className="inline-flex min-h-9 items-center px-1 text-xs text-muted-foreground">
            אין דוגמה עדיין — אפשר להזמין
          </span>
        )}
        <button
          type="button"
          onClick={onToggleSave}
          className={cn(
            "inline-flex min-h-9 items-center rounded-lg border px-3 text-xs font-semibold",
            saved
              ? "border-brand-red bg-brand-red/10 text-brand-red"
              : "border-border text-muted-foreground hover:border-brand-red/30",
          )}
        >
          {saved ? "שמור ✓" : "שמור לסט"}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-10 flex-1 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors",
            tier === "יצירתי"
              ? "bg-brand-red text-white hover:bg-brand-red-light"
              : "border border-brand-red/30 text-brand-red hover:bg-brand-red/5",
          )}
        >
          {tier === "יצירתי" ? "בואו נבנה" : "רוצה גרסה מוכנה"}
        </a>
        <Link
          href={`#wizard-mashup-fixer?idea=${idea.id}`}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground hover:border-brand-red/40"
        >
          טופס
        </Link>
      </div>
    </article>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-brand-red text-white"
          : "border border-border bg-surface text-muted-foreground hover:border-brand-red/30",
      )}
    >
      {children}
    </button>
  );
}
