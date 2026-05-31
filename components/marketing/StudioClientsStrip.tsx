import Image from "next/image";
import Link from "next/link";
import { STUDIO_CLIENT_HIGHLIGHTS } from "@/lib/data/studio-clients";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type StudioClientsStripProps = {
  className?: string;
};

export default function StudioClientsStrip({ className }: StudioClientsStripProps) {
  const whatsappHref = buildWhatsAppHref({
    text: "שלום, ראיתי באתר את האולפן ואשמח לשמוע על הקלטה.",
    utm_source: "website",
    utm_campaign: "home_clients_strip",
  });

  return (
    <section
      className={cn("border-y border-border bg-surface py-14 sm:py-16", className)}
      aria-labelledby="studio-clients-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            מהאולפן
          </p>
          <h2
            id="studio-clients-heading"
            className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מי הקליט אצלנו
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            אמנים, יזמים, משפחות ועסקים - כולם באים לאותו מקום: אולפן שקט
            במודיעין עם צוות שמלווה עד לקובץ מוכן.
          </p>
        </header>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {STUDIO_CLIENT_HIGHLIGHTS.map((item) => (
            <li key={item.id} className="group overflow-hidden rounded-xl border border-border bg-background">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-normal ease-luxury group-hover:scale-105"
                />
              </div>
              <p className="px-3 py-2.5 text-center text-xs font-semibold text-foreground sm:text-sm">
                {item.caption}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/about"
            className="text-sm font-semibold text-brand-red transition-colors hover:underline"
          >
            קראו עלינו עוד
          </Link>
          <span className="hidden text-muted-foreground sm:inline" aria-hidden>
            ·
          </span>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-foreground transition-colors hover:text-brand-red"
          >
            רוצים להקליט? דברו איתנו בוואטסאפ
          </a>
        </div>
      </div>
    </section>
  );
}
