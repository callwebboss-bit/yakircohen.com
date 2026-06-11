export default function FilterGateSkeleton() {
  return (
    <div
      className="mx-auto max-w-xl animate-pulse space-y-8 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      aria-busy="true"
      aria-label="טוען שאלון"
    >
      <div className="space-y-4">
        <div className="h-3 w-24 rounded bg-border" />
        <div className="h-5 w-3/4 rounded bg-border" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 rounded-xl bg-border" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-3 w-24 rounded bg-border" />
        <div className="h-5 w-2/3 rounded bg-border" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-32 rounded-xl bg-border" />
          ))}
        </div>
      </div>
      <div className="h-12 w-full rounded-xl bg-border" />
    </div>
  );
}
