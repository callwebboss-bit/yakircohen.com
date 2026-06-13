import Link from "next/link";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const upsellWhatsAppHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText("שדרוג חבילה - עשן כבד או צילום לאחר הקלטה באולפן"),
  utm_source: "website",
  utm_campaign: "studio_upsell_bundle",
});

export default function StudioUpsellCallout() {
  return (
    <aside
      className="rounded-2xl border border-[var(--service-accent,#d42b2b)]/30 bg-surface px-6 py-7 sm:px-8"
      aria-labelledby="studio-upsell-heading"
    >
      <p className="text-xs font-semibold tracking-[0.15em] text-[var(--service-accent-ink,#d42b2b)] uppercase">
        שדרוג חכם
      </p>
      <h2
        id="studio-upsell-heading"
        className="mt-2 text-lg font-semibold text-foreground sm:text-xl"
      >
        רוצים לצאת מהאולפן עם משהו ממש מיוחד?
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        בואו נוסיף <strong className="text-foreground">עשן כבד</strong> לכניסה
        או <strong className="text-foreground">צילום</strong> לאירוע במחיר חבילה.
        אתם מתמקדים ביצירה. אנחנו סוגרים את השאר. שגר ושכח.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={upsellWhatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
        >
          בואו נתקתק בוואטסאפ
        </a>
        <Link
          href="/events/attractions/wedding-smoking-machine"
          className="text-sm font-medium text-[var(--service-accent-ink,#d42b2b)] transition-colors hover:opacity-80"
        >
          עשן כבד לאירוע
        </Link>
        <Link
          href="/photography/wedding"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--service-accent-ink,#d42b2b)]"
        >
          צילום לחתונה
        </Link>
      </div>
    </aside>
  );
}
