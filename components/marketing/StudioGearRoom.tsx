import { buildWhatsAppHref } from "@/lib/whatsapp";

const GEAR_RECORDING = [
  {
    title: "ממשק אודיו",
    detail: "UAD Apollo Twin - עיבוד DSP בזמן אמת, פלאגיני Unison",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "מיקרופוני הקלטה",
    detail: "Townsend Sphere L22 · SM75 · Electro-Voice RE20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    title: "מוניטורים ובקרה",
    detail: "KRK Rokit 8 · RCF 745 + סאב RCF 15 · BIG KNOB",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    title: "בקרים ומקלדת",
    detail: "Native Instruments Komplete Kontrol S49 + בקרי NI נוספים",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
      </svg>
    ),
  },
  {
    title: "מחשוב וסביבת עבודה",
    detail: "2 × Apple Pro · פריסת 7 מסכים · עבודה מרובת משימות",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "תוכנה ופלאגינים",
    detail: "Cubase · iZotope · UAD · Waves - עיבוד סאונד מלא",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M4 4h16v16H4z" />
        <path d="M9 9h6v6H9z" />
      </svg>
    ),
  },
] as const;

const GEAR_PODCAST_VIDEO = [
  {
    title: "מתחמי הקלטת פודקאסט",
    detail: "4 מתחמים עצמאיים - עד 4 מיקרופונים נפרדים בו זמנית",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <rect x="1" y="6" width="22" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "מצלמות צילום",
    detail: "2 × Sony ZV-E10 · DJI Osmo 4 זווית רחבה · 3 מצלמות קבועות",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M23 7 16 12l7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
  },
  {
    title: "ניהול מצלמות",
    detail: "מערכת שליטה מרכזית - מעבר חלק בין זוויות בזמן אמת",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <rect x="2" y="2" width="9" height="9" rx="1" />
        <rect x="13" y="2" width="9" height="9" rx="1" />
        <rect x="2" y="13" width="9" height="9" rx="1" />
        <rect x="13" y="13" width="9" height="9" rx="1" />
      </svg>
    ),
  },
] as const;

const GEAR_DJ_EVENTS = [
  {
    title: "מיקסרים ובקרים",
    detail: "Allen & Heath mixers · 2 × Native Instruments controllers",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    title: "הגברה לאירועים",
    detail: "RCF 745 מוגבר · 2 מוניטורי במה · 2 מיקרופונים אלחוטיים",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
  },
] as const;

const waHref = buildWhatsAppHref({
  text: "היי יקיר, מחפשים אולפן להקלטה מקצועית. נשמח לבדוק זמינות ולשמוע על הציוד.",
  utm_source: "studio",
  utm_campaign: "gear_room_cta",
});

export default function StudioGearRoom() {
  return (
    <section
      className="rounded-2xl border border-border bg-surface px-6 py-10 sm:px-10"
      aria-labelledby="gear-room-heading"
    >
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
          שקיפות חומרה
        </p>
        <h2
          id="gear-room-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          מפרט חומרה וציוד
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          שרשרת הציוד המקצועית של האולפן - המפרט המדויק שמגדיר את התוצאה.
          גיבוי חומרתי מלא לכל רכיב קריטי.
        </p>
      </div>

      {/* Recording chain */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        שרשרת הקלטה ואולפן
      </h3>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GEAR_RECORDING.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-4 rounded-xl border border-border bg-background px-5 py-5 transition-colors duration-fast hover:border-brand-red/30"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red ring-1 ring-brand-red/20">
              {item.icon}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Podcast & Video */}
      <h3 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        אולפן פודקאסט ווידאו
      </h3>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {GEAR_PODCAST_VIDEO.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-4 rounded-xl border border-border bg-background px-5 py-5 transition-colors duration-fast hover:border-brand-red/30"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red ring-1 ring-brand-red/20">
              {item.icon}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* DJ & Events */}
      <h3 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        חומרת DJ והשכרת ציוד
      </h3>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GEAR_DJ_EVENTS.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-4 rounded-xl border border-border bg-background px-5 py-5 transition-colors duration-fast hover:border-brand-red/30"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red ring-1 ring-brand-red/20">
              {item.icon}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        השכרת ציוד לאירועים כוללת התקנה, הרכבה, פירוק וליווי טכני צמוד בשטח בלבד.
      </p>

      <div className="mt-8 flex justify-center">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          aria-label="בירור זמינות לאולפן בוואטסאפ"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          אני רוצה להתחיל בוואטסאפ
        </a>
      </div>
    </section>
  );
}
