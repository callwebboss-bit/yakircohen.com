import Link from "next/link";
import {
  ONLINE_LIABILITY_COMMITMENTS,
  ONLINE_LIABILITY_FORM_URL,
} from "@/lib/data/online-send-file-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

export default function OnlineSendFilePageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: "היי יקיר! אישרתי את תנאי השירות והצהרת האחריות. מצרף/ת קבצים לעיבוד.",
    utm_source: "online",
    utm_campaign: "send_file_whatsapp",
  });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/online" className="hover:text-brand-red">
                  Online
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">
                שליחת קבצים
              </li>
            </ol>
          </nav>

          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 text-center font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            לפני שאנחנו מתחילים
          </h1>
          <p className="mx-auto mt-5 text-center text-sm leading-relaxed text-muted-foreground">
            חשוב להגן עליך ועלינו. השירות באתר הינו שירות טכני בלבד של שיפור
            סאונד ועריכה. האחריות על תוכן הקבצים, חוקיותם וזכויות היוצרים חלה
            על הלקוח בלבד.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-foreground">
          בלחיצה על אישור למטה, אני (הלקוח) מצהיר ומתחייב כי:
        </p>

        <ul className="mt-6 space-y-5">
          {ONLINE_LIABILITY_COMMITMENTS.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <h2 className="text-sm font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          לידיעתך: מערכת האתר והטופס מתעדים את זמן האישור (ובטופס גם כתובת IP)
          לצורך הגנה משפטית. שליחת חומרים לא חוקיים או הפרת זכויות יוצרים הינה
          באחריות השולח בלבד.
        </p>

        <p className="mt-6 text-sm text-muted-foreground">
          המשך לשליחת הקבצים בוואטסאפ מהווה חתימה דיגיטלית מחייבת על הצהרה זו.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={ONLINE_LIABILITY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            מילוי טופס אישור רשמי ←
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            שליחת קבצים בוואטסאפ (לאחר אישור)
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/terms" className="text-brand-red hover:underline">
            תנאי שימוש
          </Link>
          {" · "}
          <Link href="/privacy" className="text-brand-red hover:underline">
            מדיניות פרטיות
          </Link>
        </p>

        <div className="mt-8 flex justify-center">
          <ShareButton title="אישור תנאים לפני שליחת קבצים | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
