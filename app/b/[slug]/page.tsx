import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhoneRecordingTips from "@/components/blessings/PhoneRecordingTips";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { findAlbum, getAllAlbumSlugs } from "@/lib/blessing-albums";
import { MILESTONE_ALBUM_UPLOAD_PATH } from "@/lib/data/milestone-album";
import { formatVoucherDate } from "@/lib/gift-voucher";

/* ה-slug-ים נקראים מ-lib/data/blessing-albums.json בזמן הבנייה. slug שלא ברשימה
   מקבל 404 ולא נבנה לפי דרישה. */
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllAlbumSlugs().map((slug) => ({ slug }));
}

/* דף אישי שנשלח בקישור: לא לאינדקס. */
export const metadata: Metadata = {
  title: { absolute: "הקלטת ברכה | יקיר כהן הפקות" },
  robots: { index: false, follow: false, nocache: true },
};

export default async function BlessingAlbumLandingPage({ params }: Props) {
  const { slug } = await params;
  const album = findAlbum(slug);
  if (!album) notFound();

  return (
    <Section className="bg-background" ariaLabelledby="album-landing-title" padding="sm">
      <Container className="max-w-2xl">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            אלבום ברכות מוקלטות
          </p>
          <h1
            id="album-landing-title"
            className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
          >
            מקליטים ברכה ל{album.honoree}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {album.organizer} אוסף ברכות מוקלטות ל{album.occasion} של {album.honoree}.
            מקליטים ברכה קצרה מהטלפון ושולחים לנו, ואנחנו נחבר את כל הברכות
            לקובץ אחד.
          </p>
          {album.deadline ? (
            <p className="mt-3 text-sm font-medium text-foreground">
              כדאי לשלוח עד {formatVoucherDate(album.deadline)}.
            </p>
          ) : null}
        </header>

        <ol className="mt-10 space-y-3">
          {[
            "מקליטים ברכה אישית מהטלפון. לפי הטיפים למטה.",
            "לוחצים על הכפתור ועוברים לשליחת הקובץ.",
            "בשליחה כותבים את שמכם, ולמי הברכה.",
          ].map((text, index) => (
            <li
              key={text}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-1 text-sm text-foreground">{text}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 text-center">
          <Button as="link" href={MILESTONE_ALBUM_UPLOAD_PATH} className="min-w-[14rem]">
            העלאת קובץ
          </Button>
        </div>

        <h2 className="mt-14 text-center font-serif text-2xl font-semibold text-foreground">
          טיפים להקלטה בטלפון
        </h2>
        <PhoneRecordingTips />
      </Container>
    </Section>
  );
}
