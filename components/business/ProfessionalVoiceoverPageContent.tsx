import Link from "next/link";
import YouTube from "@/components/YouTube";
import {
  DJ_SET_VOICEOVER_BENEFITS,
  DJ_SET_VOICEOVER_PACKAGE,
} from "@/lib/data/professional-voiceover-page";
import { ACADEMY_VOICEOVER_DEMO } from "@/lib/data/youtube-showcases";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import HubDualCta from "@/components/marketing/HubDualCta";
import ShareButton from "@/components/ui/ShareButton";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";

const bookCta = resolveServiceBookCta("studio");

export default function ProfessionalVoiceoverPageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בחבילת קריינות לסט DJ (5 משפטים). אשמח לשמוע מחיר ופרטים.",
    utm_source: "business",
    utm_campaign: "dj_set_voiceover",
  });

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
                <Link href="/events/dj-events" className="hover:text-brand-red">
                  DJ לאירועים
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">
                קריינות לסט
              </li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            קריינות מקצועית
          </h1>
          <p className="mx-auto mt-4 text-base font-medium text-foreground">
            קריינות לסט (חבילה 5 משפטים)
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            הפכו את הסט שלכם ללהיט: קריינות מקצועית שתרים אתכם לגבהים חדשים.
            רוצים שהסט ייחרט בזיכרון? זו הדרך להפוך אותו למותג בלתי נשכח.
          </p>
          {bookCta ? (
            <HubDualCta
              className="mt-8"
              whatsappHref={ctaHref}
              whatsappLabel="הזמינו חבילת קריינות ←"
              bookHref={bookCta.bookHref}
              bookLabel={bookCta.bookLabel}
            />
          ) : null}
        </div>
      </section>

      <section
        className="border-b border-border bg-surface py-12"
        aria-labelledby="dj-voiceover-demo-heading"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="dj-voiceover-demo-heading"
            className="text-lg font-semibold text-foreground"
          >
            דוגמת קריינות מהאולפן
          </h2>
          <div className="mx-auto mt-6 aspect-video max-w-2xl overflow-hidden rounded-2xl bg-neutral-900">
            <YouTube
              videoId={ACADEMY_VOICEOVER_DEMO.videoId}
              title={ACADEMY_VOICEOVER_DEMO.title}
              fillParent
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          צוות הקריינים המנוסים יעניק קריינות מדויקת, סוחפת ומרתקת - שתגרום
          לקהל להישאר פעור פה.
        </p>
        <h2 className="mt-10 text-lg font-semibold text-foreground">
          חבילת קריינות לסט כוללת
        </h2>
        <ul className="mt-4 space-y-3">
          {DJ_SET_VOICEOVER_PACKAGE.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm text-muted-foreground"
            >
              <span className="text-brand-red shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">יתרונות</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DJ_SET_VOICEOVER_BENEFITS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
        <p className="text-sm text-muted-foreground">
          צריכים קריינות לפרסומת, IVR או סרטון?{" "}
          <Link href="/voiceover/services" className="font-medium text-brand-red hover:underline">
            כל שירותי הקריינות
          </Link>
        </p>
        {bookCta ? (
          <HubDualCta
            className="mt-6"
            whatsappHref={ctaHref}
            whatsappLabel="תיאום בוואטסאפ ←"
            bookHref={bookCta.bookHref}
            bookLabel={bookCta.bookLabel}
          />
        ) : null}
        <div className="mt-5 flex justify-center">
          <ShareButton title="קריינות לסט DJ | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
