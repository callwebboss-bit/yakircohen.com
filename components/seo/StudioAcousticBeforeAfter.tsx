import Image from "next/image";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import {
  HOME_STUDIO_AFTER_IMAGE,
  HOME_STUDIO_BEFORE_IMAGE,
} from "@/lib/data/academy-home-studio-page";

const whatsappHref = buildWhatsAppHref({
  text: "היי יקיר! ראיתי את התמונות לפני/אחרי באתר - אשמח לשמוע על ייעוץ אקוסטיקה לבניית אולפן.",
  utm_source: "academy",
  utm_campaign: "home_studio_before_after",
});

export default function StudioAcousticBeforeAfter() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <header className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
          תוצאות אמיתיות
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          לפני ואחרי - טיפול אקוסטי באולפן
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          פרויקט לקוח אמיתי: מאותו חדר, עם תכנון אקוסטי נכון - ההבדל נשמע ונראה
          מיד.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              לפני
            </span>
            <p className="text-sm font-semibold text-foreground">
              לפני טיפול אקוסטי
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={HOME_STUDIO_BEFORE_IMAGE}
              alt="אולפן לפני ייעוץ אקוסטיקה - חדר ללא טיפול אקוסטי"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-brand-red/30 bg-brand-red/5">
          <div className="flex items-center gap-2 border-b border-brand-red/20 px-4 py-3">
            <span className="inline-flex items-center rounded-full bg-brand-red/15 px-2.5 py-0.5 text-xs font-semibold text-brand-red">
              אחרי
            </span>
            <p className="text-sm font-semibold text-foreground">
              אחרי תכנון וביצוע
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={HOME_STUDIO_AFTER_IMAGE}
              alt="אולפן אחרי ייעוץ אקוסטיקה - חדר עם טיפול אקוסטי מקצועי"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">
          אקוסטיקה נכונה חוסכת אלפי שקלים בציוד מיותר
        </strong>{" "}
        - ומבטיחה שההקלטות שלכם יישמעו מקצועיות מהיום הראשון.
      </p>

      <div className="mt-6 text-center">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          רוצים תוצאה כזו? דברו איתנו </a>
      </div>
    </div>
  );
}
