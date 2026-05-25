"use client";

import { useState, useMemo } from "react";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { STUDIO_HALF_HOUR_NIS } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type ServiceCategory = "recordings" | "podcasts" | "clips" | "events" | "ai";

type Service = {
  name: string;
  category: ServiceCategory;
  price: number;
  icon: string;
  desc: string;
  badge?: "popular" | "new" | "kids";
  upsells: string[];
};

type Upsell = {
  name: string;
  price: number;
  desc: string;
};

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const SERVICES: Record<string, Service> = {
  recording_basic: {
    name: "הקלטת שיר בסיסית",
    category: "recordings",
    price: 590,
    icon: "🎤",
    desc: "הקלטה מקצועית עם מיקס ומאסטרינג כלול",
    upsells: ["warmup", "melodyne", "production_full", "stems", "video_pro", "video_studio", "raw_only"],
  },
  recording_premium: {
    name: "הקלטת שיר פרמיום",
    category: "recordings",
    price: 1190,
    icon: "🌟",
    desc: "חבילה מושלמת עם כל התוספות",
    upsells: ["warmup", "melodyne", "production_full", "stems", "video_pro"],
  },
  podcast_basic: {
    name: "הקלטת פודקאסט",
    category: "podcasts",
    price: STUDIO_HALF_HOUR_NIS,
    icon: "🎙️",
    desc: "הקלטה מקצועית באולפן, מוכנה לשחרור",
    upsells: ["editing_advanced", "full_edit", "custom_graphics", "highlights", "premium_package"],
  },
  podcast_advanced: {
    name: "פודקאסט מתקדם",
    category: "podcasts",
    price: 1500,
    icon: "🎙️",
    desc: "כולל עריכה מלאה, גרפיקה ותוצרים לכל פלטפורמה",
    upsells: ["custom_graphics", "highlights"],
  },
  clip_basic: {
    name: "קליפ בסיסי",
    category: "clips",
    price: 2500,
    icon: "🎬",
    desc: "צילום ועריכה מקצועית לשיר או לתוכן",
    upsells: [],
  },
  clip_pro: {
    name: "קליפ מקצועי",
    category: "clips",
    price: 5000,
    icon: "🎬",
    desc: "הפקה מלאה עם צוות מקצועי ואיכות פרסומית",
    upsells: [],
  },
  event_smoke: {
    name: "עשן כבד",
    category: "events",
    price: 1750,
    icon: "💨",
    badge: "popular",
    desc: "אטרקציה מרהיבה לכניסה מרשימה",
    upsells: [],
  },
  event_bubbles: {
    name: "בועות סבון",
    category: "events",
    price: 1750,
    icon: "🫧",
    badge: "kids",
    desc: "מושלם לאירועי ילדים ובני מצווה",
    upsells: [],
  },
  event_balloons: {
    name: "בלונים ענקיים",
    category: "events",
    price: 1750,
    icon: "🎈",
    desc: "בלונים ענקיים מרשימים לצילום וכניסה",
    upsells: [],
  },
  event_sparklers: {
    name: "זיקוקים קרים",
    category: "events",
    price: 1750,
    icon: "❄️",
    badge: "popular",
    desc: "זיקוקים בטוחים ומרהיבים לרגע הגדול",
    upsells: [],
  },
  event_confetti: {
    name: "קונפטי",
    category: "events",
    price: 1750,
    icon: "🎊",
    desc: "פיצוץ קונפטי צבעוני ומרגש",
    upsells: [],
  },
  event_drummer: {
    name: "מתופף",
    category: "events",
    price: 1750,
    icon: "🥁",
    desc: "מתופף מקצועי שמכניס אנרגיה לאירוע",
    upsells: [],
  },
  event_smoke_cannon: {
    name: "תותחי עשן צבעוני",
    category: "events",
    price: 1750,
    icon: "🌈",
    badge: "new",
    desc: "תותחי עשן בצבעים מרהיבים לצילום",
    upsells: [],
  },
  event_smoke_gun: {
    name: "רובה עשן",
    category: "events",
    price: 1750,
    icon: "💨",
    badge: "new",
    desc: "רובה עשן מקצועי לאפקטים ממוקדים",
    upsells: [],
  },
  event_slideshow: {
    name: "מצגת תמונות",
    category: "events",
    price: 1750,
    icon: "📸",
    desc: "מצגת תמונות מרגשת ליום הולדת ואירועים משפחתיים",
    upsells: [],
  },
  event_foam: {
    name: "תותח קצף לילדים",
    category: "events",
    price: 1750,
    icon: "🎉",
    badge: "kids",
    desc: "כיף מטורף לילדים שיזכרו לכל החיים",
    upsells: [],
  },
  podcast_grandpa: {
    name: "פודקאסט עם סבא",
    category: "events",
    price: 1750,
    icon: "🎙️",
    desc: "מתנה מרגשת שנשארת לדורות, כולל הקלטת שיר",
    upsells: [],
  },
  sound_rental: {
    name: "השכרת ציוד הגברה",
    category: "events",
    price: 1750,
    icon: "🔊",
    desc: "מערכת הגברה מקצועית לאירוע שלכם",
    upsells: [],
  },
  ai_voice: {
    name: "שיפור קול מהנייד",
    category: "ai",
    price: 250,
    icon: "🎤",
    desc: "הפיכת הקלטת וואטסאפ לאולפנית, כולל MP3",
    upsells: [],
  },
  ai_mixing: {
    name: "מיקס ומאסטרינג",
    category: "ai",
    price: 1750,
    icon: "🎚️",
    desc: "עיבוד מקצועי מלא בכל הפורמטים",
    upsells: [],
  },
  ai_podcast_edit: {
    name: "עריכת פודקאסט",
    category: "ai",
    price: 750,
    icon: "🎬",
    desc: "ניקוי רעשים, שיפור סאונד, הוצאת MP3/MP4",
    upsells: [],
  },
  ai_video_edit: {
    name: "עריכת סרטונים קצרים",
    category: "ai",
    price: 750,
    icon: "📱",
    desc: "רילס/שורטס/טיקטוק עם כתוביות ואפקטים",
    upsells: [],
  },
  ai_volume: {
    name: "שינוי והתאמת ווליום",
    category: "ai",
    price: 250,
    icon: "🔊",
    desc: "עד שעת הקלטה, איזון דינמי",
    upsells: [],
  },
  ai_rescue: {
    name: "הצלת הקלטות פגומות",
    category: "ai",
    price: 250,
    icon: "🆘",
    desc: "לכל 5 דקות: ניקוי רעשים ושחזור איכות",
    upsells: [],
  },
  ai_photos: {
    name: "שדרוג תמונות (AI)",
    category: "ai",
    price: 250,
    icon: "📸",
    desc: "לכל 10 תמונות: רזולוציה, צבעים, חדות",
    upsells: [],
  },
};

const UPSELLS: Record<string, Upsell> = {
  warmup: { name: "חימום קולי מודרך", price: 0, desc: "20 דקות לפני ההקלטה, כלול במחיר" },
  melodyne: { name: "Melodyne - תיקון זיופים", price: 200, desc: "שיפור דיוק קולי מקצועי" },
  production_full: { name: "הפקה מלאה מקצועית", price: 1200, desc: "עד 5 כלים, עיבוד מקצועי" },
  stems: { name: "Stems - רצועות נפרדות", price: 300, desc: "קבצים נפרדים לכל כלי" },
  video_pro: { name: "צילום וידאו מקצועי", price: 850, desc: "צלם מקצועי לקליפ או מזכרת" },
  video_studio: { name: "צילום במצלמות אולפן", price: 400, desc: "צילום באיכות HD" },
  raw_only: { name: "הקלטה גולמית בלבד", price: 0, desc: "ללא עיבוד, קובץ גולמי" },
  editing_advanced: { name: "עריכה מתקדמת", price: 590, desc: "לכל שעה שצולמה, פתיח וסגיר" },
  full_edit: { name: "עריכה מלאה של וידאו", price: 750, desc: "עריכה + מיקס + גרפיקה" },
  custom_graphics: { name: "התאמה אישית מתקדמת", price: 450, desc: "גרפיקה וטקסטים מותאמים" },
  highlights: { name: "רגעי שיא (עד 3 דקות)", price: 300, desc: "Highlights לרילס/טיקטוק" },
  premium_package: { name: "חבילת ראש שקט - הכל!", price: 3540, desc: "הפקה מלאה ומושלמת" },
};

const CATEGORIES = [
  { id: "all", label: "הכל", icon: "🎯" },
  { id: "recordings", label: "הקלטות", icon: "🎤" },
  { id: "podcasts", label: "פודקאסטים", icon: "🎙️" },
  { id: "clips", label: "קליפים", icon: "🎬" },
  { id: "events", label: "אטרקציות", icon: "🎉" },
  { id: "ai", label: "שירותים דיגיטליים", icon: "💻" },
] as const;

const BADGE_LABELS: Record<string, string> = { popular: "פופולרי", new: "חדש", kids: "לילדים" };

// Tiered bundle pricing  -  must match AttractionsCalculator
const EVENT_BUNDLE_TIERS: Record<number, number> = { 1: 1750, 2: 3200, 3: 4450 };
const EVENT_BUNDLE_4PLUS = 5500;
const EVENT_GIFT_THRESHOLD = 4;

function getEventBundlePrice(count: number): number {
  if (count <= 0) return 0;
  if (count >= EVENT_GIFT_THRESHOLD) return EVENT_BUNDLE_4PLUS;
  return EVENT_BUNDLE_TIERS[count] ?? count * 1750;
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

type FormState = {
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  notes: string;
};

export default function BookingCalculator() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", date: "", time: "", location: "", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "booking_calculator",
  });

  const filtered = useMemo(
    () => Object.entries(SERVICES).filter(([, s]) => activeCategory === "all" || s.category === activeCategory),
    [activeCategory],
  );

  const allSelected = Array.from(selectedServices);
  const eventKeys = allSelected.filter((k) => SERVICES[k]?.category === "events");
  const regularKey = allSelected.find((k) => SERVICES[k]?.category !== "events");
  const hasEvents = eventKeys.length > 0;
  const hasGift = eventKeys.length >= EVENT_GIFT_THRESHOLD;

  const eventBundleTotal = getEventBundlePrice(eventKeys.length);
  const eventSingleTotal = eventKeys.length * 1750;
  const eventDiscount = eventSingleTotal - eventBundleTotal;
  const basePrice = (regularKey ? SERVICES[regularKey].price : 0) + eventBundleTotal;
  const addonPrice = Array.from(selectedUpsells).reduce((acc, k) => acc + (UPSELLS[k]?.price ?? 0), 0);
  const total = basePrice + addonPrice;

  const activeUpsellKeys = regularKey ? SERVICES[regularKey].upsells : [];
  const hasSelection = selectedServices.size > 0;

  const toggleService = (key: string) => {
    const svc = SERVICES[key];
    if (!svc) return;

    if (svc.category === "events") {
      setSelectedServices((prev) => {
        const n = new Set(prev);
        n.has(key) ? n.delete(key) : n.add(key);
        return n;
      });
    } else {
      const already = selectedServices.has(key);
      setSelectedServices((prev) => {
        const n = new Set(prev);
        for (const k of n) { if (SERVICES[k]?.category !== "events") n.delete(k); }
        if (!already) n.add(key);
        return n;
      });
      setSelectedUpsells(new Set());
    }
  };

  const toggleUpsell = (key: string) => {
    setSelectedUpsells((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const handleSubmit = () => {
    if (!hasSelection) return;

    const fieldErrs = attemptSubmit(
      () => {
        const base = validateBookingLead({
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time,
          location: form.location,
          notes: form.notes,
          requireLocation: hasEvents,
        });
        return base;
      },
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : form.phone.trim();

        const serviceLines = allSelected.map((k) => `• ${SERVICES[k]?.name}`).join("\n");
        const upsellLines = Array.from(selectedUpsells)
          .filter((k) => (UPSELLS[k]?.price ?? 0) > 0)
          .map((k) => `• ${UPSELLS[k]?.name} (+${UPSELLS[k]?.price.toLocaleString()} ₪)`)
          .join("\n");

        const parts = [
          "הזמנה חדשה מהאתר! 🎤",
          "",
          `שם: ${sanitizeLeadText(form.name, 60)}`,
          `טלפון: ${displayPhone}`,
          `תאריך: ${form.date}`,
          `שעה: ${form.time}`,
          hasEvents && form.location
            ? `מיקום: ${sanitizeLeadText(form.location, 120)}`
            : null,
          "",
          "שירות/ים:",
          serviceLines,
          upsellLines ? `\nתוספות:\n${upsellLines}` : null,
          "",
          eventDiscount > 0
            ? `הנחת חבילת אטרקציות: -${eventDiscount.toLocaleString()} ₪`
            : null,
          `סה"כ: ${total.toLocaleString()} ₪`,
          form.notes ? `\nהערות: ${sanitizeLeadText(form.notes, 1500)}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        const href = buildWhatsAppHref({
          text: parts,
          utm_source: "website",
          utm_campaign: "booking_calculator",
        });
        openWhatsAppLead(href);
        setDone(true);
      },
    );

    setErrors(fieldErrs ?? {});
  };

  const setField = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      {/* ── Category tabs ── */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color] duration-fast ease-luxury",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
              activeCategory === cat.id
                ? "bg-brand-red text-white"
                : "bg-surface text-muted-foreground hover:bg-brand-red/10 hover:text-brand-red",
            )}
          >
            <span aria-hidden="true">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* ── Left: services ── */}
        <div>
          {/* Event bundle hint */}
          {hasEvents && (
            <div className="mb-4 rounded-xl border border-brand-red/30 bg-brand-red/8 px-4 py-3 text-sm text-foreground">
              {hasGift
                ? `🎉 4 אטרקציות ומעלה  -  ${EVENT_BUNDLE_4PLUS.toLocaleString()} ₪ + קליפ היילייטס מתנה`
                : eventKeys.length === 3
                  ? `⭐ 3 אטרקציות  -  ${EVENT_BUNDLE_TIERS[3]!.toLocaleString()} ₪ (חיסכון 800 ₪). עוד אחת ותקבלו קליפ מתנה!`
                  : eventKeys.length === 2
                    ? `⭐ 2 אטרקציות  -  ${EVENT_BUNDLE_TIERS[2]!.toLocaleString()} ₪ (חיסכון 300 ₪)`
                    : `💡 בחרו 2+ אטרקציות לחסוך בחבילה`}
            </div>
          )}

          {/* Services grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map(([key, svc]) => {
              const isSelected = selectedServices.has(key);
              const isEvent = svc.category === "events";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleService(key)}
                  className={cn(
                    "relative flex flex-col items-start gap-2 rounded-2xl border p-5 text-start shadow-sm",
                    "transition-[border-color,box-shadow,transform] duration-fast ease-luxury",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                    isSelected
                      ? "border-brand-red/50 bg-brand-red/5 shadow-[0_4px_16px_rgba(212,43,43,0.1)]"
                      : "border-border bg-background hover:border-brand-red/30",
                  )}
                  aria-pressed={isSelected}
                >
                  {/* Badge */}
                  {svc.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-brand-red px-2 py-0.5 text-[0.6rem] font-bold text-white">
                      {BADGE_LABELS[svc.badge]}
                    </span>
                  )}

                  {/* Checkmark */}
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-xs text-white">
                      ✓
                    </span>
                  )}

                  <span className="text-2xl" aria-hidden="true">{svc.icon}</span>
                  <span className="text-sm font-semibold text-foreground">{svc.name}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{svc.desc}</span>
                  <span className="mt-auto text-base font-bold text-foreground">
                    {isEvent ? "1,750 ₪" : svc.price.toLocaleString() + " ₪"}
                    {isEvent && eventKeys.length > 1 && (
                      <span className="mr-1.5 text-xs font-normal text-brand-red">
                        {eventKeys.length >= 2 ? "חבילה" : ""}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Upsells */}
          {activeUpsellKeys.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                תוספות זמינות לשירות שנבחר
              </h3>
              <div className="space-y-2.5">
                {activeUpsellKeys.map((uKey) => {
                  const u = UPSELLS[uKey];
                  if (!u) return null;
                  const active = selectedUpsells.has(uKey);
                  return (
                    <button
                      key={uKey}
                      type="button"
                      onClick={() => toggleUpsell(uKey)}
                      className={cn(
                        "flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-3 text-start",
                        "transition-[border-color,background-color] duration-fast ease-luxury",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                        active
                          ? "border-brand-red/40 bg-brand-red/5"
                          : "border-border bg-background hover:border-brand-red/30",
                      )}
                      aria-pressed={active}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-xs",
                            active ? "border-brand-red bg-brand-red text-white" : "border-border",
                          )}
                          aria-hidden="true"
                        >
                          {active && "✓"}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.desc}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-foreground">
                        {u.price === 0 ? "כלול" : `+${u.price.toLocaleString()} ₪`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: cart + form ── */}
        <div className="lg:sticky lg:top-6">
          {/* Cart summary */}
          {hasSelection && (
            <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                סיכום הזמנה
              </h3>

              <ul className="mb-3 space-y-1">
                {allSelected.map((k) => (
                  <li key={k} className="text-xs text-muted-foreground">
                    • {SERVICES[k]?.name}
                  </li>
                ))}
                {Array.from(selectedUpsells).map((k) => (
                  <li key={k} className="text-xs text-muted-foreground">
                    • {UPSELLS[k]?.name}
                  </li>
                ))}
              </ul>

              <div className="space-y-1 border-t border-border pt-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>מחיר בסיס</span>
                  <span>{basePrice.toLocaleString()} ₪</span>
                </div>
                {addonPrice > 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>תוספות</span>
                    <span>+{addonPrice.toLocaleString()} ₪</span>
                  </div>
                )}
                {eventDiscount > 0 && (
                  <div className="flex justify-between text-xs font-medium text-green-600">
                    <span>הנחת חבילה</span>
                    <span>-{eventDiscount.toLocaleString()} ₪</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                  <span>סה&quot;כ</span>
                  <span>{total.toLocaleString()} ₪</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <h3 className="mb-5 border-b border-border pb-3 text-base font-semibold text-foreground">
              פרטים להזמנה
            </h3>

            <div className="relative space-y-4">
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <LeadFormAlert message={globalError} />
              {/* Name */}
              <div>
                <label htmlFor="book-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  שם מלא *
                </label>
                <input
                  id="book-name"
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="הכנס שם מלא"
                  className={cn(
                    "w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
                    "transition-[border-color,box-shadow] duration-fast ease-luxury",
                    "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                    errors.name ? "border-red-400 bg-red-50" : "border-border bg-background",
                  )}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="book-phone" className="mb-1.5 block text-xs font-semibold text-foreground">
                  טלפון *
                </label>
                <input
                  id="book-phone"
                  type="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                  placeholder="05xxxxxxxx"
                  className={cn(
                    "w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
                    "transition-[border-color,box-shadow] duration-fast ease-luxury",
                    "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                    errors.phone ? "border-red-400 bg-red-50" : "border-border bg-background",
                  )}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Location (events only) */}
              {hasEvents && (
                <div>
                  <label htmlFor="book-location" className="mb-1.5 block text-xs font-semibold text-foreground">
                    מיקום האירוע *
                  </label>
                  <input
                    id="book-location"
                    type="text"
                    value={form.location}
                    onChange={setField("location")}
                    placeholder="כתובת מלאה של האירוע"
                    className={cn(
                      "w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
                      "transition-[border-color,box-shadow] duration-fast ease-luxury",
                      "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                      errors.location ? "border-red-400 bg-red-50" : "border-border bg-background",
                    )}
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </div>
              )}

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="book-date" className="mb-1.5 block text-xs font-semibold text-foreground">
                    תאריך *
                  </label>
                  <input
                    id="book-date"
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={setField("date")}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-sm text-foreground",
                      "transition-[border-color,box-shadow] duration-fast ease-luxury",
                      "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                      errors.date ? "border-red-400 bg-red-50" : "border-border bg-background",
                    )}
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                </div>
                <div>
                  <label htmlFor="book-time" className="mb-1.5 block text-xs font-semibold text-foreground">
                    שעה *
                  </label>
                  <input
                    id="book-time"
                    type="time"
                    value={form.time}
                    onChange={setField("time")}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-sm text-foreground",
                      "transition-[border-color,box-shadow] duration-fast ease-luxury",
                      "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                      errors.time ? "border-red-400 bg-red-50" : "border-border bg-background",
                    )}
                  />
                  {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="book-notes" className="mb-1.5 block text-xs font-semibold text-foreground">
                  הערות (אופציונלי)
                </label>
                <textarea
                  id="book-notes"
                  value={form.notes}
                  onChange={setField("notes")}
                  rows={3}
                  placeholder="ספרו לנו עוד על מה שאתם צריכים..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasSelection}
              className={cn(
                "mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold",
                "transition-[background-color,box-shadow,opacity] duration-normal ease-luxury",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                hasSelection
                  ? "bg-brand-red text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)]"
                  : "cursor-not-allowed bg-border text-muted-foreground opacity-60",
              )}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {hasSelection
                ? done
                  ? "ההזמנה נשלחה! לחץ שוב לשליחה נוספת"
                  : `אישור ושליחה בוואטסאפ${hasSelection ? ` | ${total.toLocaleString()} ₪` : ""}`
                : "בחר שירות להמשך"}
            </button>

            {!hasSelection && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                בחרו שירות מהרשימה משמאל כדי להמשיך
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
