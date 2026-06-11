import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
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
    <Section
      padding="sm"
      className={cn("border-y border-border bg-surface", className)}
      ariaLabelledby="studio-clients-heading"
    >
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            מהאולפן
          </p>
          <h2
            id="studio-clients-heading"
            className="mt-3 font-serif text-section-title font-semibold text-foreground"
          >
            מי הקליט אצלנו
          </h2>
          <p className="text-lead mt-4 text-muted-foreground">
            אמנים, יזמים, משפחות ועסקים - כולם באים לאותו מקום: אולפן שקט
            במודיעין עם צוות שמלווה עד לקובץ מוכן.
          </p>
        </header>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {STUDIO_CLIENT_HIGHLIGHTS.map((item) => (
            <li
              key={item.id}
              className="group overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-[box-shadow,border-color] duration-normal ease-luxury hover:border-brand-red/30 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="group-hover-scale-md object-cover motion-reduce:transform-none"
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
            className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-red transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            קראו עלינו עוד
          </Link>
          <span className="hidden text-muted-foreground sm:inline" aria-hidden>
            ·
          </span>
          <Button
            as="a"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            className="text-sm font-semibold"
          >
            רוצים להקליט? דברו איתנו בוואטסאפ
          </Button>
        </div>
      </Container>
    </Section>
  );
}
