"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import VoiceSearchMicButton from "@/components/ui/VoiceSearchMicButton";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import {
  POPULAR_SEARCH_QUERIES,
  getSiteSearchIndex,
  type SiteSearchItem,
} from "@/lib/data/site-search";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const CATEGORY_CUBES = [
  {
    href: "/studio",
    title: "אולפן הקלטות",
    description: "שיר במתנה, ברכות, עיבוד מוזיקלי",
    icon: "🎙️",
  },
  {
    href: "/studio/blessings/bride-groom-blessing",
    title: "תוכן לאירועים",
    description: "שירי כניסה לחופה, ברכת כלה, שירים מותאמים",
    icon: "🎵",
  },
  {
    href: "/events/dj-events",
    title: "הפקה מוזיקלית",
    description: "DJ לאירועים, הגברה, אפקטים",
    icon: "🎧",
  },
] as const;

const FEATURED_SERVICES = [
  { href: "/studio", label: "אולפן הקלטות", sub: "Studio" },
  { href: "/studio/recording-song-modiin", label: "הקלטת שיר", sub: "Recording" },
  { href: "/events/dj-events", label: "תקליטן לאירועים", sub: "DJ" },
  { href: "/events/attractions", label: "אטרקציות", sub: "Attractions" },
  { href: "/events/attractions/cold-fireworks", label: "זיקוקים קרים", sub: "Fireworks" },
  { href: "/studio/blessings/video-clip", label: "קליפ בר מצווה", sub: "Clip" },
  { href: "/voiceover/services", label: "קריינות מקצועית", sub: "Voiceover" },
  { href: "/academy/dj-course", label: "קורס DJ", sub: "Course" },
] as const;

const SEASONAL_BY_MONTH: Record<
  number,
  { text: string; href: string }
> = {
  2: { text: "הקלטת שיר לאמא ליום האם", href: "/studio/blessings/bride-groom-blessing" },
  3: { text: "הקלטת שיר לאמא ליום האם", href: "/studio/blessings/bride-groom-blessing" },
  4: { text: "חבילת חתונת אביב - DJ ואפקטים", href: "/events/dj-events" },
  5: { text: "חבילת חתונת אביב - DJ ואפקטים", href: "/events/dj-events" },
  6: { text: "בר/בת מצווה בקיץ - אולפן וקליפ", href: "/studio/blessings/video-clip" },
  7: { text: "בר/בת מצווה בקיץ - אולפן וקליפ", href: "/studio/blessings/video-clip" },
  8: { text: "בר/בת מצווה בקיץ - אולפן וקליפ", href: "/studio/blessings/video-clip" },
  9: { text: "אירועי חגי תשרי - הפקה מלאה", href: "/events/attractions" },
  10: { text: "אירועי חגי תשרי - הפקה מלאה", href: "/events/attractions" },
  11: { text: "אירועי סוף שנה וחברה", href: "/events/dj-events" },
  0: { text: "אירועי סוף שנה וחברה", href: "/events/dj-events" },
  1: { text: "אירועי סוף שנה וחברה", href: "/events/dj-events" },
};

function highlight(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    "<mark class='bg-brand-red/15 px-0.5'>$1</mark>",
  );
}

const REDIRECT_MAP = [
  { keywords: ["studio", "אולפן", "הקלטה", "recording"], href: "/studio" },
  { keywords: ["dj", "תקליטן", "event", "אירוע"], href: "/events/dj-events" },
  { keywords: ["bride", "groom", "חופה", "כלה", "חתן", "blessing", "שיר-כניסה"], href: "/studio/blessings/bride-groom-blessing" },
  { keywords: ["fireworks", "זיקוק", "cold"], href: "/events/attractions/cold-fireworks" },
  { keywords: ["attraction", "אטרקצי"], href: "/events/attractions" },
  { keywords: ["bar-mitzvah", "בר-מצווה", "clip", "קליפ"], href: "/studio/blessings/video-clip" },
  { keywords: ["voiceover", "קריינ"], href: "/voiceover" },
  { keywords: ["course", "קורס", "academy"], href: "/academy/dj-course" },
  { keywords: ["podcast", "פודקאסט"], href: "/podcast" },
  { keywords: ["contact", "צור-קשר", "יצירת-קשר"], href: "/contact" },
  { keywords: ["book", "הזמנ", "מחיר"], href: "/book" },
];

function getSuggestedHrefFromPathname(): string | null {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname.toLowerCase();
  for (const entry of REDIRECT_MAP) {
    if (entry.keywords.some((kw) => path.includes(kw))) {
      return entry.href;
    }
  }
  return null;
}

export default function NotFoundContent() {
  const router = useRouter();
  const searchIndex = useMemo(() => getSiteSearchIndex(), []);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const voiceAutoNavigateRef = useRef(false);
  const suggestedHref = useSyncExternalStore(
    () => () => {},
    getSuggestedHrefFromPathname,
    () => null,
  );
  const seasonal = SEASONAL_BY_MONTH[new Date().getMonth()];

  const consultHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText("ייעוץ מהעמוד לא נמצא (404)"),
    utm_source: "website",
    utm_campaign: "not_found_consult",
  });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)),
      )
      .slice(0, 8);
  }, [query, searchIndex]);

  const runSearch = useCallback((value: string) => {
    setQuery(value);
    setOpen(true);
    voiceAutoNavigateRef.current = false;
  }, []);

  const onNavigate = useCallback(
    (href: string, _label: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  const onSearchQuery = useCallback((value: string, source: "final" | "interim") => {
    setQuery(value);
    setOpen(true);
    if (source === "final") voiceAutoNavigateRef.current = true;
  }, []);

  const {
    isSupported: voiceSupported,
    isListening,
    errorMessage: voiceError,
    toggleListening,
    clearError,
    liveMessage,
  } = useVoiceSearch({ onNavigate, onSearchQuery });

  useEffect(() => {
    if (!voiceAutoNavigateRef.current || !query.trim()) return;
    if (results.length !== 1) return;
    voiceAutoNavigateRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery("");
    router.push(results[0].href);
  }, [query, results, router]);

  const searchWaHref = buildWhatsAppHref({
    text: `${buildServiceWhatsAppText("חיפוש באתר")} - חיפשתי "${query.trim()}" ולא מצאתי.`,
    utm_source: "website",
    utm_campaign: "not_found_search",
  });

  return (
    <div className="bg-background">
      {suggestedHref ? (
        <div className="fixed start-1/2 top-20 z-50 w-[min(100%,22rem)] -translate-x-1/2 rounded-xl border border-brand-red/30 bg-surface px-5 py-4 text-center text-sm shadow-xl">
          <p className="font-semibold text-foreground">אולי התכוונתם לעמוד אחר?</p>
          <Link
            href={suggestedHref}
            className="mt-2 inline-flex font-semibold text-brand-red hover:underline"
          >
            מעבר לעמוד המתאים </Link>
        </div>
      ) : null}
      <Section padding="sm">
        <Container className="max-w-3xl text-center">
        <p className="inline-block rounded-full border border-brand-red px-4 py-1 text-xs font-bold tracking-[0.25em] text-brand-red uppercase">
          שגיאה 404
        </p>
        <h1 className="text-hero mt-8 font-serif font-semibold text-foreground">
          לא מצאנו את העמוד
          <br />
          אבל נוכל לעזור<span className="text-brand-red">.</span>
        </h1>

        {seasonal ? (
          <p className="mx-auto mt-6 max-w-lg rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            עכשיו פופולרי:{" "}
            <strong className="text-foreground">{seasonal.text}</strong> -{" "}
            <Link href={seasonal.href} className="font-semibold text-brand-red hover:underline">
              בואו נדבר </Link>
          </p>
        ) : null}

        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
          חפשו שירות למטה, או התחילו מ
          <Link href="/start" className="font-semibold text-brand-red hover:underline">
            {" "}מפת השלבים
          </Link>
          .
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            onClick={() => {
              document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
              document.querySelector<HTMLInputElement>('input[type="search"]')?.scrollIntoView({ behavior: "smooth" });
            }}
            className="shadow-[0_4px_24px_rgba(212,43,43,0.25)]"
          >
            מצאו שירות
          </Button>
          <Button as="link" href="/start" variant="ghost" className="text-sm">
            מה קורה אחרי שפונים
          </Button>
        </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container className="max-w-2xl pb-12">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          <strong className="text-foreground">אופס, הלכתם לאיבוד?</strong>
          <br />
          כתבו מה אתם מחפשים ונמצא את הדף המתאים.
        </p>
        <div className="relative">
          <input
            type="search"
            role="combobox"
            value={query}
            onChange={(e) => {
              runSearch(e.target.value);
              clearError();
            }}
            onFocus={() => setOpen(true)}
            placeholder="חפשו שירות, שיר, אולפן..."
            className={cn(
              "min-h-11 w-full rounded-xl border border-border bg-surface py-4 ps-5 text-base font-medium text-foreground outline-none transition-[border-color,box-shadow] focus:border-brand-red focus:ring-2 focus:ring-brand-red/30",
              voiceSupported ? "pe-14" : "pe-5",
              isListening && "border-brand-red ring-2 ring-brand-red/30",
            )}
            aria-label="חיפוש שירותים"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="not-found-search-results"
          />
          {voiceSupported ? (
            <VoiceSearchMicButton
              isListening={isListening}
              onClick={toggleListening}
              size="md"
              className="absolute end-2 top-1/2 -translate-y-1/2"
            />
          ) : null}
          <div role="status" aria-live="polite" className="sr-only">
            {liveMessage}
            {voiceError}
          </div>
          {voiceError && !isListening ? (
            <p className="mt-1 text-xs text-brand-red" role="alert">
              {voiceError}
            </p>
          ) : null}
          {open ? (
            <div
              id="not-found-search-results"
              className="absolute top-full z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-xl border border-border bg-background shadow-lg"
            >
              {!query.trim() ? (
                <div className="p-4">
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    חיפושים נפוצים
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {POPULAR_SEARCH_QUERIES.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => runSearch(chip)}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground hover:border-brand-red/40"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {results.map((item: SiteSearchItem) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-end transition-colors hover:bg-surface"
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-muted-foreground"> </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className="block text-sm font-semibold text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: highlight(item.title, query),
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.category}
                        </span>
                      </span>
                    </Link>
                  ))}
                  <div className="border-t-2 border-brand-red bg-brand-red/5 p-4">
                    <p className="text-xs text-muted-foreground">
                      {results.length === 0
                        ? `לא מצאנו תוצאות עבור "${query}"`
                        : "לא מצאתם מה שחיפשתם?"}
                    </p>
                    <a
                      href={searchWaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-brand-red hover:underline"
                    >
                      שלחו הודעה בוואטסאפ
                    </a>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container className="max-w-5xl pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {CATEGORY_CUBES.map((cube) => (
            <Link
              key={cube.href}
              href={cube.href}
              className="group hover-lift flex flex-col gap-3 rounded-xl border border-border bg-foreground p-6 text-background"
            >
              <span className="text-2xl" aria-hidden="true">
                {cube.icon}
              </span>
              <h2 className="font-serif text-xl font-semibold">{cube.title}</h2>
              <p className="text-sm text-white/70">{cube.description}</p>
              <span className="mt-auto text-xs font-bold text-brand-red group-hover:underline">
                לפרטים </span>
            </Link>
          ))}
        </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container className="max-w-5xl pb-20">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">
          כל השירותים
        </p>
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {FEATURED_SERVICES.map((svc) => (
            <Link
              key={svc.href}
              href={svc.href}
              className="flex flex-col items-end gap-2 bg-background p-5 text-end transition-colors hover:bg-foreground hover:text-background"
            >
              <span className="text-sm font-semibold">{svc.label}</span>
              <span className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                {svc.sub}
              </span>
            </Link>
          ))}
        </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container className="max-w-3xl pb-16">
        <div className="grid gap-6 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2 sm:gap-8 sm:p-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              הפילוסופיה שלנו
            </span>
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              &ldquo;גם בטעות יש לוגיקה - בוא נמצא אותה יחד.
              15 דקות ייעוץ אישי עם יקיר, ללא עלות. זה על הבית.&rdquo;
            </p>
            <Button
              as="a"
              href={consultHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="mt-auto self-start"
            >
              תיאום שיחת ייעוץ (15 דק&apos;)
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              מתנה קטנה ממני
            </span>
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              חבל שהגעתם לעמוד ריק - בוא נמתיק את זה: הצצה למחירון ולכל השירותים.
            </p>
            <Button as="link" href="/book" variant="secondary" className="mt-auto self-start">
              ראו מחירון שירותים
            </Button>
          </div>
        </div>
        </Container>
      </Section>

      <Section padding="sm" className="border-t border-border bg-surface text-center">
        <Container className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.2em] text-brand-red uppercase">
          מתנה לדרך
        </p>
        <h2 className="text-section-title mt-4 font-serif font-semibold text-foreground">
          ייעוץ ראשוני ללא עלות
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          הגעתם לכאן בטעות? נשמח לעזור למצוא את השירות המתאים.
        </p>
        <Button
          as="a"
          href={consultHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8"
        >
          דברו איתנו בוואטסאפ
        </Button>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/studio/pricing" className="inline-flex min-h-11 items-center text-muted-foreground hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
            מחירון
          </Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center text-muted-foreground hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
            צור קשר
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center text-muted-foreground hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
            דף הבית
          </Link>
        </div>
        </Container>
      </Section>
    </div>
  );
}
