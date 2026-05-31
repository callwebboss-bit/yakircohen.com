export type BlessingsSectionHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export default function BlessingsSectionHeader({
  id,
  eyebrow,
  title,
  description,
  className = "",
}: BlessingsSectionHeaderProps) {
  return (
    <header className={`mx-auto max-w-2xl text-center ${className}`.trim()}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
