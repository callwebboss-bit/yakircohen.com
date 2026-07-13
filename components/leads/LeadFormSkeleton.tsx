export default function LeadFormSkeleton() {
  return (
    <div
      className="animate-pulse space-y-4 rounded-2xl border border-border bg-surface p-6"
      style={{ minHeight: 280 }}
      aria-hidden
    >
      <div className="h-2 w-full rounded bg-muted" />
      <div className="h-4 w-1/3 rounded bg-muted" />
      <div className="h-11 w-full rounded-xl bg-muted" />
      <div className="h-11 w-full rounded-xl bg-muted" />
      <div className="h-24 w-full rounded-xl bg-muted" />
      <div className="h-12 w-full rounded-xl bg-muted" />
    </div>
  );
}
