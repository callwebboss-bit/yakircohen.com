import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import {
  STUDIO_NEARBY_FOOTNOTE,
  STUDIO_NEARBY_GROUPS,
  STUDIO_NEARBY_HEADING,
  STUDIO_NEARBY_INTRO,
  STUDIO_NEARBY_PLACES,
  nearbyPlaceMapsUrl,
} from "@/lib/data/studio-nearby-places";

export default function StudioNearbyPlaces() {
  return (
    <section aria-labelledby="nearby-places-heading" className="space-y-5">
      <div>
        <h2
          id="nearby-places-heading"
          className="text-center text-lg font-semibold text-foreground"
        >
          {STUDIO_NEARBY_HEADING}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {STUDIO_NEARBY_INTRO} שימושי אם מגיעים מוקדם לסשן או נשארים אחרי. פרטים
          על{" "}
          <InlineServiceLink href="/studio">
            אולפן הקלטות במודיעין
          </InlineServiceLink>
          .
        </p>
      </div>

      <div className="space-y-6">
        {STUDIO_NEARBY_GROUPS.map((group) => {
          const places = STUDIO_NEARBY_PLACES.filter(
            (place) => place.group === group.id,
          );
          return (
            <div key={group.id}>
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {places.map((place) => (
                  <li key={place.id}>
                    <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-4">
                      <p className="text-xs font-semibold tracking-wide text-brand-red">
                        {place.kindLabel}
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {place.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {place.area} - {place.address}
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {place.distance}
                      </p>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {place.note}
                      </p>
                      <a
                        href={nearbyPlaceMapsUrl(place)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
                        aria-label={`ניווט ל${place.name} במפות`}
                      >
                        ניווט במפות
                      </a>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {STUDIO_NEARBY_FOOTNOTE}
      </p>
    </section>
  );
}
