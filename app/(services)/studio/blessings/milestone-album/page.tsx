import type { Metadata } from "next";
import Link from "next/link";
import BlessingsProcessGrid from "@/components/blessings/BlessingsProcessGrid";
import BlessingsSectionHeader from "@/components/blessings/BlessingsSectionHeader";
import PhoneRecordingTips from "@/components/blessings/PhoneRecordingTips";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  MILESTONE_ALBUM,
  MILESTONE_ALBUM_FAQ_NOTE,
  MILESTONE_ALBUM_INCLUDES,
  MILESTONE_ALBUM_PATH,
  MILESTONE_ALBUM_STEPS,
} from "@/lib/data/milestone-album";
import { constructMetadata } from "@/lib/metadata";
import { buildServicePageEntitySchema } from "@/lib/seo/page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const META_TITLE = "אלבום ברכות מוקלטות מרחוק";
const META_DESCRIPTION =
  "אוספים ברכות ממשפחה וחברים בטלפון, ואנחנו מנקים, מסדרים ומוסיפים מוזיקת רקע ומעברים. מקבלים קובץ אחד.";

export const metadata: Metadata = constructMetadata({
  title: META_TITLE,
  description: META_DESCRIPTION,
  slug: "studio/blessings/milestone-album",
  keywords: [
    "אלבום ברכות",
    "ברכות מוקלטות ממשפחה וחברים",
    "מתנה ליום הולדת",
    "מתנה לאבן דרך",
  ],
});

const SCHEMA = buildServicePageEntitySchema({
  pagePath: MILESTONE_ALBUM_PATH,
  title: MILESTONE_ALBUM.title,
  description: META_DESCRIPTION,
});

export default function MilestoneAlbumPage() {
  const whatsappHref = buildWhatsAppHref({
    text: "שלום, מעוניין באלבום ברכות מוקלטות מרחוק",
    utm_source: "website",
    utm_campaign: "blessings_milestone_album",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(SCHEMA) }}
      />

      <Section className="border-b border-border bg-background" ariaLabelledby="album-title" padding="sm">
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            ברכות מוקלטות
          </p>
          <h1
            id="album-title"
            className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
          >
            {MILESTONE_ALBUM.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {MILESTONE_ALBUM.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button as="a" href={whatsappHref} target="_blank" rel="noopener noreferrer" className="min-w-[14rem]">
              שלחו הודעה בוואטסאפ
            </Button>
            <Button as="a" href="#how" variant="secondary" className="min-w-[14rem]">
              איך זה עובד
            </Button>
          </div>
        </Container>
      </Section>

      <Section id="how" className="bg-surface" ariaLabelledby="album-how-title" padding="sm">
        <Container>
          <BlessingsSectionHeader
            id="album-how-title"
            eyebrow="איך זה עובד"
            title="שלושה צעדים"
          />
          <BlessingsProcessGrid steps={MILESTONE_ALBUM_STEPS} />
        </Container>
      </Section>

      <Section className="bg-background" ariaLabelledby="album-includes-title" padding="sm">
        <Container className="max-w-3xl">
          <BlessingsSectionHeader
            id="album-includes-title"
            eyebrow="מה כלול"
            title="מה עושים עם ההקלטות"
            description={MILESTONE_ALBUM_FAQ_NOTE}
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {MILESTONE_ALBUM_INCLUDES.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface" ariaLabelledby="album-tips-title" padding="sm">
        <Container>
          <BlessingsSectionHeader
            id="album-tips-title"
            eyebrow="לקרובים שמקליטים"
            title="טיפים להקלטה בטלפון"
            description="אפשר להעביר את הטיפים האלה לכל מי שמקליט, או לשלוח לו דף הקלטה ייעודי שנכין עבורכם."
          />
          <PhoneRecordingTips />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            עוד על{" "}
            <Link href="/studio/blessings" className="font-semibold text-brand-red hover:underline">
              ברכות מוקלטות
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
