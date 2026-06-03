import Link from "next/link";
import JourneyStepsLink from "@/components/marketing/JourneyStepsLink";
import CategoryRelatedLinks from "@/components/seo/CategoryRelatedLinks";
import {
  AI_MUSIC_GUIDED_SERVICES,
  AI_MUSIC_LEARN_MODULES,
  AI_MUSIC_WARNINGS,
} from "@/lib/data/academy-ai-music-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

export default function AiMusicPageContent() {
  const courseHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בקורס AI + מוזיקה (לימוד 1:1). אשמח לשמוע פרטים.",
    utm_source: "academy",
    utm_campaign: "ai_music_course",
  });

  const serviceHref = buildWhatsAppHref({
    text: "היי יקיר! אני צריך/ה שירות AI במוזיקה בליווי (לא לבד). אשמח להצעת מחיר.",
    utm_source: "academy",
    utm_campaign: "ai_music_service",
  });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט ארגוני" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/academy" className="hover:text-brand-red">
                  האקדמיה
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">
                קורס AI במוזיקה
              </li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            AI + מוזיקה - לימוד ושירות בליווי
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            פיצול לערוצים, שחזור שיר ישן, הפיכת רעיון לשיר מלא, ניקוי ווקאל
            ועוד - הכל אפשרי עם AI. אבל לא לבד: אנחנו עושים את זה יחד, עם
            הסבר, בקרה ואוזן מקצועית.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={courseHref}
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light"
            >
              קורס AI 1:1 ←
            </a>
            <a
              href={serviceHref}
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:border-brand-red/40"
            >
              שירות בליווי ←
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-amber-500/25 bg-amber-500/5 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-sm font-semibold text-foreground">
            חשוב לפני שמתחילים
          </h2>
          <ul className="mt-4 space-y-2">
            {AI_MUSIC_WARNINGS.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="text-amber-600" aria-hidden>
                  ⚠
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            שירותים באתר
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            מה אפשר לעשות איתנו ב-AI
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            כולל עבודה אונליין, מחירים מיוחדים לפי פרויקט, ואופציה לשניות
            במקום שעות - כשהכלי מתאים.
          </p>
        </header>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AI_MUSIC_GUIDED_SERVICES.map((svc) => (
            <li
              key={svc.href}
              className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {svc.icon}
              </span>
              <h3 className="mt-3 font-semibold text-foreground">{svc.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {svc.description}
              </p>
              {svc.priceHint ? (
                <p className="mt-2 text-xs font-medium text-brand-red">
                  {svc.priceHint}
                </p>
              ) : null}
              <Link
                href={svc.href}
                className="mt-4 text-sm font-semibold text-brand-red hover:underline"
              >
                {svc.cta} ←
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              קורס
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
              רוצים ללמוד - לא רק להזמין שירות?
            </h2>
          </header>
          <div className="grid gap-5 sm:grid-cols-2">
            {AI_MUSIC_LEARN_MODULES.map((m) => (
              <div
                key={m.title}
                className="flex gap-4 rounded-2xl border border-border bg-background p-6"
              >
                <span className="text-2xl shrink-0" aria-hidden>
                  {m.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{m.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
            מחירון מקוון:{" "}
            <Link
              href="/online/online-ai-pricing"
              className="font-medium text-brand-red hover:underline"
            >
              שירותי AI מרחוק
            </Link>
            {" · "}
            <Link
              href="/academy/private-lessons"
              className="font-medium text-brand-red hover:underline"
            >
              שיעור פרטי 60 / 90 דק׳
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-10 sm:px-6 lg:px-8">
        <CategoryRelatedLinks pathname="/academy/ai-music" />
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-10 sm:px-6 lg:px-8">
        <section className="py-4">
          <JourneyStepsLink variant="studio" />
        </section>
      </section>

      <section className="border-t border-border bg-surface py-16 text-center sm:py-20">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          לא בטוחים אם צריך קורס או שירות?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          שיחת ייעוץ קצרה - נבין יחד ונחסוך לכם זמן וכסף.
        </p>
        <a
          href={serviceHref}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          בואו נדבר בוואטסאפ ←
        </a>
        <div className="mt-5 flex justify-center">
          <ShareButton title="קורס AI במוזיקה | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
