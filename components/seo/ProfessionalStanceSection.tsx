import { getProfessionalStance } from "@/lib/data/professional-stance";

type Props = {
  pathname: string;
  className?: string;
};

export default function ProfessionalStanceSection({ pathname, className }: Props) {
  const stance = getProfessionalStance(pathname);

  if (!stance) {
    return null;
  }

  return (
    <section
      aria-labelledby="professional-stance-heading"
      className={className}
    >
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
          {stance.byline}
        </p>
        <h2
          id="professional-stance-heading"
          className="mt-3 font-serif text-section-title font-semibold text-foreground"
        >
          העמדה המקצועית שלנו
        </h2>
        <div className="mt-6 border-s-[3px] border-brand-red/40 ps-4">
          <p className="text-sm font-semibold text-foreground sm:text-base">
            אני מאמין ש:
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {stance.believe}
          </p>
        </div>
        <div className="mt-6 border-s-[3px] border-brand-red/20 ps-4">
          <p className="text-sm font-semibold text-foreground sm:text-base">
            ולכן אני ממליץ ללקוחות שלי:
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {stance.recommend}
          </p>
        </div>
        {stance.closer ? (
          <p className="mt-6 text-sm text-muted-foreground">{stance.closer}</p>
        ) : null}
      </div>
    </section>
  );
}
