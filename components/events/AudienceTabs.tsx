"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Data
   ───────────────────────────────────────────────────────────────────────────── */

type AudienceTab = {
  id: string;
  label: string;
  /** Short label shown on narrow mobile viewports */
  shortLabel: string;
  heading: string;
  description: string;
  features: string[];
  learnMoreHref: string;
  ctaText: string;
  whatsappMessage: string;
  utm_campaign: string;
};

const AUDIENCE_TABS: AudienceTab[] = [
  {
    id: "weddings",
    label: "חתונות",
    shortLabel: "חתונות",
    heading: "הפקת חתונה שתישאר בזיכרון",
    description:
      "מה-DJ הפותח ועד האפקט האחרון - אנחנו מנהלים את כל האווירה כדי שתוכלו ליהנות מהיום המיוחד ובלי לדאוג לפרטים.",
    features: [
      "DJ מקצועי עם ניסיון בחתונות בכל הסגנונות",
      "הנחיית קהל וניהול לו\"ז מדויק",
      "מערכת סאונד ותאורה דינמית ברמה הגבוהה",
      "אטרקציות חובה: עשן, קונפטי ובועות",
      "תותחי קונפטי צבעוני ומכונת עשן כבד",
      "תיאום מלא עם הצוות ועם רצונות החתן והכלה",
    ],
    learnMoreHref: "/events",
    ctaText: "לתיאום הפקת החתונה",
    whatsappMessage:
      "שלום, אשמח לשמוע פרטים על הפקת חתונה - DJ, תאורה ואפקטים.",
    utm_campaign: "events_tab_weddings",
  },
  {
    id: "corporate",
    label: "ארגונים",
    shortLabel: "חברות",
    heading: "אירוע חברה ברמה מקצועית",
    description:
      "הפקות תאגידיות מצריכות דיוק טכני ולוגיסטי. הצוות שלנו מתמחה בכנסים, ימי גיבוש ואירועי הכרה - מהרמקולים ועד הבמה.",
    features: [
      "מערכות A/V מלאות כולל מסכים ומקרנים",
      "הנחיית קהל לטקסים, פרסים ואמנים אורחים",
      "ניהול שמע ומיקס מצגות בזמן אמת",
      "DJ / מוזיקת רקע מותאמת לאירוע עסקי",
      "תמיכה לוגיסטית לאורך כל שעות הכנה",
    ],
    learnMoreHref: "/events",
    ctaText: "לקבלת הצעת מחיר",
    whatsappMessage:
      "שלום, מעוניין לקבל הצעת מחיר להפקת אירוע חברה / כנס מקצועי.",
    utm_campaign: "events_tab_corporate",
  },
  {
    id: "barmitzvah",
    label: "בר ובת מצווה",
    shortLabel: "בר/בת מצווה",
    heading: "אירוע בר/בת מצווה מרגש ומיוחד",
    description:
      "אירוע שמאחד שלושה דורות דורש מוזיקה גמישה ואפקטים מרגשים. נתאים את הרפרטואר ואת הסאונד בדיוק לציפיות המשפחה.",
    features: [
      "מוזיקה מגוונת המתאימה לכל הגילאים",
      "כניסת הבר/בת מצווה עם אפקטים בלתי נשכחים",
      "מיקרופון ואמפ לנאומים וברכות",
      "גמישות בתכנות המוזיקלי עד ליום האירוע",
    ],
    learnMoreHref: "/events",
    ctaText: "לתיאום הבר/בת מצווה",
    whatsappMessage:
      "שלום, אשמח לשמוע על הפקת בר/בת מצווה - DJ, תאורה ואפקטים.",
    utm_campaign: "events_tab_barmitzvah",
  },
  {
    id: "parties",
    label: "מסיבות",
    shortLabel: "מסיבות",
    heading: "מסיבה שמדברים עליה",
    description:
      "ימי הולדת, חגיגות פרטיות, ימי כיף - הציוד הנכון, הפלייליסט הנכון, האנרגיה הנכונה. אנחנו גם להשכרה עם נהג.",
    features: [
      "ציוד הגברה ותאורה להשכרה עם נהג",
      "רצועות מוזיקה מגוונות לכל סגנון",
      "בועות, לייזרים ואפקטים ויזואליים",
      "גמישות בחבילות המותאמות לתקציב",
    ],
    learnMoreHref: "/events",
    ctaText: "לתיאום המסיבה",
    whatsappMessage:
      "שלום, מעוניין לשמוע פרטים על הפקת מסיבה / שכירת ציוד אירועים.",
    utm_campaign: "events_tab_parties",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   AudienceTabs
   ─────────────────────────────────────────────────────────────────────────────
   Segmented tab control that shows relevant service details per audience type.

   Interaction model:
   - Active tab: high-contrast bg-foreground/text-background pill (smooth
     transition-[background-color,color] duration-normal)
   - Content panel: cross-fades on tab switch via a brief opacity toggle so
     the transition feels polished without requiring a CSS animation library.

   Accessibility:
   - tab / tablist / tabpanel ARIA roles with aria-selected + aria-controls.
   - Keyboard: arrow keys navigate between tabs (Left/Right in RTL context).
   - Focus-visible ring on every interactive element.
   ───────────────────────────────────────────────────────────────────────────── */

export type AudienceTabsProps = {
  className?: string;
};

export default function AudienceTabs({ className }: AudienceTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  /* isVisible drives the cross-fade: briefly drop to 0 while swapping content */
  const [isVisible, setIsVisible] = useState(true);

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    setIsVisible(false);
    /* duration-fast = 150 ms - content swaps at the nadir of the fade */
    const t = setTimeout(() => {
      setActiveIndex(index);
      setIsVisible(true);
    }, 120);
    return () => clearTimeout(t);
  };

  /* Keyboard navigation: ArrowLeft = next in RTL reading direction, ArrowRight = prev */
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const total = AUDIENCE_TABS.length;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelect((index + 1) % total);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelect((index - 1 + total) % total);
    }
  };

  const activeTab = AUDIENCE_TABS[activeIndex];
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(activeTab.heading),
    utm_source: "website",
    utm_campaign: activeTab.utm_campaign,
  });

  return (
    <div className={cn("", className)}>
      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="קהל יעד לאירועים"
        /* 2-col grid on mobile 4-col on sm+ */
        className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface p-1 sm:grid-cols-4"
      >
        {AUDIENCE_TABS.map((tab, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-semibold select-none",
                "transition-[background-color,color,box-shadow] duration-normal ease-luxury",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {/* Full label on sm+, short label on xs */}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab panel ───────────────────────────────────────────────────── */}
      <div
        id={`panel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.id}`}
        className={cn(
          "mt-6 transition-opacity duration-fast ease-luxury",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* ── Text side ── */}
          <div>
            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              {activeTab.label}
            </p>

            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              {activeTab.heading}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {activeTab.description}
            </p>

            {/* Feature list */}
            <ul className="mt-6 space-y-3" aria-label={`יתרונות - ${activeTab.label}`}>
              {activeTab.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red"
                    aria-hidden="true"
                  >
                    <CheckIcon size={12} />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── CTA card ── */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24">
            {/* Gold accent top line */}
            <div
              className="h-px w-full bg-gradient-to-l from-transparent via-brand-red/50 to-transparent"
              aria-hidden="true"
            />

            <h3 className="text-base font-semibold text-foreground">
              מעוניינים? נדבר עכשיו
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              ייעוץ ראשוני ללא עלות - נתאים חבילה לצרכים ולתקציב שלכם ונשלח
              הצעה, בדרך כלל תוך 24 שעות.
            </p>

            {/* Trust signals */}
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {["מענה מהיר - ימים א׳-ו׳ 09:00-20:00", "ניסיון במאות אירועים", "ציוד מקצועי לאירועים"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckIcon size={13} className="shrink-0 text-brand-red" />
                    {t}
                  </li>
                ),
              )}
            </ul>

            {/* Divider */}
            <hr className="border-border" />

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl",
                  "bg-brand-red px-5 py-3 text-sm font-semibold text-white",
                  "shadow-[0_0_20px_rgba(212,43,43,0.3)]",
                  "transition-[background-color,box-shadow,transform] duration-normal ease-luxury",
                  "hover:bg-brand-red-light hover:shadow-[0_0_30px_rgba(212,43,43,0.45)]",
                  "active:scale-[0.97]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                )}
                aria-label={`${activeTab.ctaText} - פתיחת שיחת וואטסאפ`}
              >
                {/* WhatsApp inline icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {activeTab.ctaText}
              </a>

              <Link
                href={activeTab.learnMoreHref}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-xl",
                  "border border-border px-5 py-3 text-sm font-medium text-foreground",
                  "transition-[border-color,background-color] duration-fast ease-luxury",
                  "hover:border-brand-red/50 hover:bg-brand-red/8",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                )}
              >
                פרטים נוספים </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
