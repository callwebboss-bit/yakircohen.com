import Link from "next/link";
import {
  ONLINE_HOW_IT_WORKS,
  ONLINE_SERVICES,
  ONLINE_SUB_LINKS,
  ONLINE_WHY_US,
} from "@/lib/data/online-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

export default function OnlinePageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! יש לי קובץ אודיו שצריך שיפור/עריכה. אשמח לבדיקה והצעת מחיר (ללא התחייבות).",
    utm_source: "online",
    utm_campaign: "online_hub_cta",
  });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            שירותי עריכה ושיפור אודיו Online &amp; AI
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            פתרונות סאונד מקצועיים מרחוק - אולפן אצלכם במחשב. יש הקלטה שצריכה
            שיפור? קובץ שצריך עריכה? ברכה שהווליום נמוך מדי?
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            לא צריך להיכנס לאוטו ולנסוע לאולפן. אנחנו עושים את הכל מרחוק,
            באותה איכות בדיוק.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/online/vocal-fix/send-file"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              אישור תנאים ושליחת קבצים ←
            </Link>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
            >
              בדיקה חינם בוואטסאפ
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-8">
        <div className="mx-auto flex max-w-[72rem] flex-wrap justify-center gap-3 px-4 sm:px-6">
          <span className="rounded-full border border-brand-red/30 bg-background px-4 py-2 text-sm font-medium text-foreground">
            שירותי Online
          </span>
          <Link
            href="/business/social-media"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
          >
            שירותים לעסקים
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-xl font-semibold text-foreground sm:text-2xl">
          איך זה עובד? פשוט ומהיר
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {ONLINE_HOW_IT_WORKS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-background p-6 text-center"
            >
              <span className="text-3xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-3 font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-xl font-semibold text-foreground sm:text-2xl">
            השירותים שלנו (מה אפשר לעשות עם הקובץ?)
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {ONLINE_SERVICES.map((svc) => (
              <article
                key={svc.title}
                className="flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <span className="text-2xl" aria-hidden>
                  {svc.icon}
                </span>
                <h3 className="mt-3 font-semibold text-foreground">{svc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{svc.intro}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">כולל: </span>
                  {svc.includes}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">מתאים ל: </span>
                  {svc.suited}
                </p>
                {svc.href && (
                  <Link
                    href={svc.href}
                    className="mt-4 text-sm font-semibold text-brand-red hover:underline"
                  >
                    לפרטים ←
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          שירותים ממוקדים
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {ONLINE_SUB_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand-red/40"
              >
                <span className="font-semibold text-foreground">{link.label}</span>
                <p className="mt-1 text-sm text-muted-foreground">{link.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-foreground">
            למה לעבוד איתנו אונליין?
          </h2>
          <ul className="mt-6 space-y-3">
            {ONLINE_WHY_US.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border py-16 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="text-xl font-semibold text-foreground">
            מוכנים לשפר את הסאונד שלכם?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            שלחו את הקובץ עכשיו לבדיקה וקבלת הצעת מחיר מדויקת. לא עולה כסף
            לבדוק.
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            שלחו קובץ בוואטסאפ ←
          </a>
          <div className="mt-5 flex justify-center">
            <ShareButton title="שירותי עריכה ושיפור אודיו Online | יקיר כהן הפקות" />
          </div>
        </div>
      </section>
    </div>
  );
}
