import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";
import {
  HOME_STUDIO_PLANS,
  HOME_STUDIO_SERVICE_SECTIONS,
  HOME_STUDIO_WHY_YAKIR,
} from "@/lib/data/academy-home-studio-page";

export const metadata: Metadata = constructMetadata({
  title: "ייעוץ בניית אולפן ביתי | יקיר כהן הפקות",
  description:
    "ייעוץ אישי לבניית אולפן ביתי: תכנון אקוסטי, הדרכה מעשית וליווי צמוד. זום 60 דק 500 ₪ | ייעוץ מלא עם ביקור 950 ₪. בכל הארץ.",
  slug: "academy/home-studio",
  keywords: [
    "ייעוץ אולפן ביתי",
    "בניית אולפן ביתי",
    "אקוסטיקה ביתית",
    "תכנון אקוסטי",
    "ציוד הקלטה",
    "מוניטורים",
  ],
});

export default function HomeStudioPage() {
  const generalCtaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בייעוץ לבניית אולפן ביתי. אשמח לשמוע איזה חבילה מתאימה לי.",
    utm_source: "academy",
    utm_campaign: "home_studio_cta",
  });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט ארגוני" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  ראשי
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/academy"
                  className="hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  האקדמיה
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground" aria-current="page">
                ייעוץ אולפן ביתי
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            ייעוץ בניית אולפן ביתי
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            ייעוץ אישי לבניית אולפן ביתי, הכולל תכנון אקוסטי מותאם אישית,
            הדרכה טכנית וליווי צמוד של יקיר כהן לתוצאות מעולות.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            קבלו ייעוץ אישי לאולפן ביתי מושלם: תכנון אקוסטי מותאם, הדרכה
            מעשית וליווי צמוד - כדי לקבל את האולפן שתמיד חלמתם עליו.
          </p>

          <a
            href={generalCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            הזמינו ייעוץ בוואטסאפ ←
          </a>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            רוצים אולפן ביתי משלכם?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            הקלטות איכותיות מתחילות באקוסטיקה נכונה ובציוד מדויק. הייעוץ של
            יקיר כהן מעניק פתרון אמיתי - מהתכנון האקוסטי ועד לסידור ועיצוב
            החלל האידיאלי אצלכם בבית.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            השירות כולל
          </h2>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {HOME_STUDIO_SERVICE_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <div className="flex gap-3">
                <span className="text-2xl shrink-0" aria-hidden="true">
                  {section.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-red"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          אני כאן כדי לעזור ולתת מידע מתוך 20 שנות ניסיון וידע מעשי בשטח. עם
          רזומה עשיר, אחסוך לכם טעויות של זמן וכסף שלוואי - כאלה שהייתי
          חוסך בעצמי בתחילת הדרך.
        </p>
        <p className="mt-3 text-sm font-medium text-foreground">
          לפעמים עצה אחת יכולה לחסוך לכם ים של כסף - ואני יודע שזה שווה את
          זה.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          השירות ניתן בכל חלקי הארץ (בחישוב הוצאות נסיעות וזמן לביקור פיזי).
        </p>
      </section>

      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              מחירים
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              בחרו את הייעוץ שמתאים לכם
            </h2>
          </header>

          <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
            {HOME_STUDIO_PLANS.map((plan) => {
              const href = buildWhatsAppHref({
                text: plan.waText,
                utm_source: "academy",
                utm_campaign: plan.utm,
              });
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-7 shadow-sm ${
                    plan.premium
                      ? "border-brand-red/40 bg-background shadow-[0_4px_24px_rgba(212,43,43,0.08)]"
                      : "border-border bg-background"
                  }`}
                >
                  {plan.premium && (
                    <span className="absolute -top-3 right-5 rounded-full bg-brand-red px-3 py-0.5 text-xs font-bold text-white">
                      מומלץ
                    </span>
                  )}

                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.sub}
                  </p>

                  <div className="mt-5">
                    <span className="text-3xl font-bold text-foreground">
                      {plan.price} ₪
                    </span>
                    <span className="mr-1 text-sm text-muted-foreground">
                      + מע&quot;מ
                    </span>
                  </div>

                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-0.5 text-brand-red" aria-hidden="true">
                          ✦
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3 text-sm font-semibold text-white shadow-[0_0_16px_rgba(212,43,43,0.25)] transition-[background-color,box-shadow] hover:bg-brand-red-light hover:shadow-[0_0_24px_rgba(212,43,43,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    הזמינו בוואטסאפ ←
                  </a>
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-xs text-muted-foreground">
            ייעוץ ראשוני (שיחת זום 60 דק&apos;) - 500 ₪ | ייעוץ מלא כולל ביקור
            פיזי ודו&quot;ח - 950 ₪
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            למה לבחור ביקיר כהן?
          </h2>
          <ul className="space-y-3">
            {HOME_STUDIO_WHY_YAKIR.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            אספר לכם בשפה שלכם בדיוק מה שאתם מסוגלים גם לשמוע. האפשרות
            להיעזר בי זו הבחירה שלכם בלבד - אחרי ששמעתם את ההדרכות והרעיונות
            ואתם בטוחים שאני יכול לפתור עבורכם כל סוגיה בנושא מוזיקה, סאונד
            וציוד.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={generalCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(212,43,43,0.25)] hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              הזמינו עכשיו ←
            </a>
            <ShareButton title="ייעוץ בניית אולפן ביתי | יקיר כהן הפקות" />
          </div>
        </div>
      </section>
    </div>
  );
}
