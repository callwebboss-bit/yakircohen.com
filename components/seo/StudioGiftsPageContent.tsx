import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import Link from "next/link";
import GiftIdeaCard from "@/components/seo/GiftIdeaCard";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import { STUDIO_GIFTS_VIDEOS } from "@/lib/data/youtube-showcases";
import {
  BAT_MITZVAH_CLIP_TYPES,
  BAT_MITZVAH_PRODUCTION_STYLES,
  GIFT_VOUCHER_STEPS,
  STUDIO_GIFT_FAQ,
  STUDIO_GIFT_IDEAS,
} from "@/lib/data/studio-gifts-page";
import {
  RINGTONE_HERO,
  RINGTONE_PAGE_PATH,
  RINGTONE_PRICE_NIS,
} from "@/lib/data/funny-ringtone-page";
import { formatNis } from "@/lib/data/pricing";
import PageBottomCta from "@/components/layout/PageBottomCta";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

const MAIN_CTA = buildWhatsAppHref({
  text: "היי יקיר! מעוניינים בשובר מתנה מהאולפן. אשמח לשמוע איזה שירותים אפשריים ואיך זה עובד.",
  utm_source: "studio",
  utm_campaign: "studio_gifts_main_cta",
});

const VOUCHER_CTA = buildWhatsAppHref({
  text: "היי יקיר! רוצים להזמין שובר מתנה - לציין שזו מתנה ולבחור שירות. אשמח לפרטים.",
  utm_source: "studio",
  utm_campaign: "studio_gifts_voucher_cta",
});

export default function StudioGiftsPageContent() {
  const faqItems: FaqCtaItem[] = STUDIO_GIFT_FAQ.map((item) => ({
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
              <li className="font-medium text-foreground" aria-current="page">
                מתנות מהאולפן
              </li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            מתנה מהאולפן שיוצאת דופן
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            לא חייבים להתחיל מסכום קבוע. שובר המתנה מאפשר לרכוש כל שירות שמופיע
            אצלנו - הקלטת שיר, פודקאסט עם סבא, ברכה, קליפ, פודקאסט באולפן ועוד -
            עם סימון ברור שמדובר במתנה למישהו שאתם אוהבים.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={VOUCHER_CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light sm:w-auto"
            >
              הזמנת שובר מתנה
            </a>
            <Link
              href="/voucher"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-foreground hover:border-brand-red/40 sm:w-auto"
            >
              איך עובד השובר
            </Link>
          </div>
        </div>
      </section>

      <TrustStatsBar variant="compact" className="border-b" />

      <section className="border-b border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              איך זה עובד
            </p>
            <h2 className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              איך רוכשים מתנה שלא תישכח
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              המחיר נקבע לפי השירות שבחרתם, לא לפי מינימום כללי. בשובר נרשום
              במפורש: מתנה.
            </p>
          </header>
          <ol className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
            {GIFT_VOUCHER_STEPS.map((step) => (
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
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            רעיונות למתנה
          </p>
          <h2 className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl">
            רעיונות למתנה - עם וידאו לצפייה
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            בחרו מה שמתאים למקבל/ת המתנה. ליד כל רעיון דוגמת וידאו, קישור לשירות
            וכפתור לשובר מתנה בוואטסאפ.
          </p>
        </header>
        <div className="space-y-8">
          {STUDIO_GIFT_IDEAS.map((idea, index) => (
            <GiftIdeaCard
              key={idea.id}
              idea={idea}
              reverse={index % 2 === 1}
            />
          ))}
        </div>

        <article className="mt-10 overflow-hidden rounded-2xl border-2 border-brand-red/30 bg-gradient-to-br from-brand-red/5 to-background">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="inline-flex w-fit rounded-full bg-brand-red px-3 py-0.5 text-xs font-bold text-white">
                {formatNis(RINGTONE_PRICE_NIS)} מבצע
              </span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-foreground sm:text-xl">
                רינגטון מצחיק — מתנה לכיף
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                מתנה מקורית ליום הולדת או הפתעה לחבר/ה: מקליטים, מעבדים ומגישים
                רינגטון אישי שמישהו באמת ישמיע בטלפון. שמעו לפני ואחרי בעמוד
                הייעודי.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0 font-bold text-brand-red">-</span>
                  קובץ מוכן ל-iPhone ו-Android
                </li>
                <li className="flex gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0 font-bold text-brand-red">-</span>
                  נגן לפני/אחרי — שמעו את ההבדל
                </li>
                <li className="flex gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0 font-bold text-brand-red">-</span>
                  הזמנה בוואטסאפ או בטופס מקוון
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={RINGTONE_PAGE_PATH}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
                >
                  לעמוד הרינגטון
                </Link>
                <a
                  href={buildWhatsAppHref({
                    text: RINGTONE_HERO.whatsappText,
                    utm_source: "studio",
                    utm_campaign: RINGTONE_HERO.utmCampaign,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
                >
                  הזמנה בוואטסאפ
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-brand-red/5 p-8 text-center lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                {RINGTONE_HERO.eyebrow}
              </p>
              <p className="mt-4 font-serif text-2xl font-semibold text-foreground">
                {RINGTONE_HERO.priceBadge}
              </p>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                רינגטון אישי שיגרום לצחוק בכל פעם שהטלפון מצלצל
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              בת/בר מצווה
            </p>
            <h2 className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              קליפים לבת מצווה - עדיין הלהיט
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              אם המתנה היא לבר/בת מצווה, אלה הסגנונות הפופולריים ביותר. אפשר לרכוש
              גם כשובר מתנה עם סימון מתנה.
            </p>
          </header>
          <div className="mt-8 space-y-8">
            {BAT_MITZVAH_CLIP_TYPES.map((type) => (
              <article
                key={type.id}
                className="rounded-2xl border border-border bg-background p-6 sm:p-8"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {type.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {type.intro}
                </p>
                <ul className="mt-4 space-y-2">
                  {type.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-brand-red">-</span>
                      {b}
                    </li>
                  ))}
                </ul>
                {type.note ? (
                  <p className="mt-4 text-sm font-medium text-foreground">
                    {type.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <ShowcaseVideoSection
          heading="דוגמאות מתנה מהאולפן"
          subheading="קליפים ושירים שהוקלטו כמתנה - הסרטון הראשון נטען מיד"
          videos={STUDIO_GIFTS_VIDEOS}
          initialVisible={4}
        />
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            סגנונות הפקה
          </p>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            סגנונות הפקה לקליפים
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {BAT_MITZVAH_PRODUCTION_STYLES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-background p-5 transition-[border-color,box-shadow] duration-normal ease-luxury hover:border-brand-red/30 hover:shadow-sm"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-brand-red/30 bg-background p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
              מחיר לפי שירות
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              אין מחיר אחיד לכל המתנות. שובר המתנה משקף את השירות שבחרתם (שיר,
              קליפ, פודקאסט וכו&apos;) - ואנחנו מלווים עד המסירה.
            </p>
            <a
              href={MAIN_CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              קבלת הצעה לשובר מתנה
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
          שאלות נפוצות
        </p>
        <h2 className="mb-6 mt-3 font-serif text-xl font-semibold text-foreground">
          שאלות על מתנות ושוברים
        </h2>
        <FAQWithCtaLinks items={faqItems} />
      </section>

      <PageBottomCta
        layout="section"
        variant="whatsapp"
        heading="מוכנים להפתיע מישהו שאתם אוהבים?"
        description="שובר מתנה לכל שירות באולפן - נרשום במפורש שמדובר במתנה ונתאם מסירה."
        headingId="studio-gifts-cta-heading"
        whatsappHref={MAIN_CTA}
        whatsappLabel="שובר מתנה בוואטסאפ"
        whatsappAriaLabel="שובר מתנה בוואטסאפ - מתנות מהאולפן"
        showBookContact={false}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/voucher"
            className="text-sm text-brand-red hover:underline"
          >
            דף שובר מתנה
          </Link>
          <Link
            href="/studio/recording-song-modiin"
            className="text-sm text-brand-red hover:underline"
          >
            הקלטת שיר במודיעין
          </Link>
          <Link
            href="/podcast/podcast-with-grandpa"
            className="text-sm text-brand-red hover:underline"
          >
            פודקאסט עם סבא
          </Link>
          <ShareButton title="מתנות מהאולפן | יקיר כהן הפקות" />
        </div>
      </PageBottomCta>
    </div>
  );
}
