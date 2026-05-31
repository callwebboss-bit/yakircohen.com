import Link from "next/link";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import FunnyRingtoneBeforeAfter from "@/components/seo/FunnyRingtoneBeforeAfter";
import FullProductionShowcaseSection from "@/components/seo/FullProductionShowcaseSection";
import FunnyRingtoneOrderForm from "@/components/seo/FunnyRingtoneOrderForm";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import PageBottomCta from "@/components/layout/PageBottomCta";
import ShareButton from "@/components/ui/ShareButton";
import {
  RINGTONE_AUDIENCES,
  RINGTONE_FAQ,
  RINGTONE_HERO,
  RINGTONE_INCLUDES,
  RINGTONE_PRICE_NIS,
  RINGTONE_STEPS,
} from "@/lib/data/funny-ringtone-page";
import { formatNis } from "@/lib/data/pricing";
import { SITE_NAME } from "@/lib/constants";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const WHATSAPP_CTA = buildWhatsAppHref({
  text: RINGTONE_HERO.whatsappText,
  utm_source: "studio",
  utm_campaign: RINGTONE_HERO.utmCampaign,
});

export default function FunnyRingtonePageContent() {
  const faqItems: FaqCtaItem[] = RINGTONE_FAQ.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    ctaText: "שאלו בוואטסאפ",
    whatsappMessage: item.whatsappText,
    utm_campaign: item.utmCampaign,
  }));

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/studio/recording-song-modiin"
                  className="hover:text-brand-red"
                >
                  הקלטת שיר
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/studio/recording-song-modiin/gifts"
                  className="hover:text-brand-red"
                >
                  מתנות
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">
                רינגטון מצחיק
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {RINGTONE_HERO.eyebrow}
          </p>
          <span className="mt-4 inline-flex rounded-full bg-brand-red px-4 py-1 text-sm font-bold text-white">
            {RINGTONE_HERO.priceBadge}
          </span>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {RINGTONE_HERO.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {RINGTONE_HERO.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={WHATSAPP_CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light sm:w-auto"
            >
              הזמנה בוואטסאפ — {formatNis(RINGTONE_PRICE_NIS)}
            </a>
            <a
              href="#ringtone-order-form"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red sm:w-auto"
            >
              טופס הזמנה מקוון
            </a>
          </div>
        </div>
      </section>

      <TrustStatsBar variant="compact" className="border-b" />

      <section className="border-b border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              לפני ואחרי
            </p>
            <h2 className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              שמעו איך נשמע רינגטון גולמי לעומת גרסה מוכנה
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              זה ההבדל בין &quot;הקלטה מהטלפון&quot; לבין רינגטון שמישהו באמת
              ירצה לשמוע שוב ושוב.
            </p>
          </header>
          <FunnyRingtoneBeforeAfter />
        </div>
      </section>

      <FullProductionShowcaseSection variant="ringtone" />

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            מה כלול
          </p>
          <h2 className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl">
            מה מקבלים ב-{formatNis(RINGTONE_PRICE_NIS)}?
          </h2>
        </header>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {RINGTONE_INCLUDES.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-border bg-background p-5 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              איך זה עובד
            </p>
            <h2 className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              3 שלבים לרינגטון שיגרום לצחוק
            </h2>
          </header>
          <ol className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
            {RINGTONE_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl border border-border bg-background p-5 text-center transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">
                  {step.step}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            למי זה מתאים
          </p>
          <h2 className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl">
            מתנה מקורית לקהל שאוהב להפתיע
          </h2>
        </header>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {RINGTONE_AUDIENCES.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-border bg-background p-5 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
            >
              <span className="inline-flex rounded-full bg-brand-red/10 px-3 py-0.5 text-xs font-semibold text-brand-red">
                {item.badge}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              הזמנה
            </p>
            <h2 className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              מוכנים להזמין?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {formatNis(RINGTONE_PRICE_NIS)} מבצע — וואטסאפ או טופס, מה שנוח
              לכם.
            </p>
          </header>
          <FunnyRingtoneOrderForm />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
          שאלות נפוצות
        </p>
        <h2 className="mb-6 mt-3 font-serif text-xl font-semibold text-foreground">
          שאלות על רינגטון מצחיק במתנה
        </h2>
        <FAQWithCtaLinks items={faqItems} />
      </section>

      <PageBottomCta
        layout="section"
        variant="whatsapp"
        heading="רוצים להפתיע מישהו בצלצול הבא?"
        description={`רינגטון מצחיק במתנה — ${formatNis(RINGTONE_PRICE_NIS)} מבצע. נעזור לכם לנסח, להקליט ולסיים עם קובץ מוכן.`}
        headingId="ringtone-bottom-cta-heading"
        whatsappHref={WHATSAPP_CTA}
        whatsappLabel={`הזמנה בוואטסאפ — ${formatNis(RINGTONE_PRICE_NIS)}`}
        whatsappAriaLabel="הזמנת רינגטון מצחיק בוואטסאפ"
        showBookContact={false}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/studio/recording-song-modiin/gifts"
            className="text-sm text-brand-red hover:underline"
          >
            כל המתנות מהאולפן
          </Link>
          <Link
            href="/studio/recording-song-modiin"
            className="text-sm text-brand-red hover:underline"
          >
            הקלטת שיר במודיעין
          </Link>
          <ShareButton title={`רינגטון מצחיק במתנה | ${SITE_NAME}`} />
        </div>
      </PageBottomCta>
    </div>
  );
}
