import Link from "next/link";
import {
  HOME_TRUST_FEATURES,
  getHomeTrustFeatureIcon,
} from "@/lib/data/home-trust-features";

export default function HomeTrustFeatureGrid() {
  return (
    <div
      className="mt-16 border-t border-border/40 pt-16"
      aria-label="יתרונות השירות"
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {HOME_TRUST_FEATURES.map((feature) => {
          const Icon = getHomeTrustFeatureIcon(feature.id);
          return (
            <Link
              key={feature.id}
              href={feature.href}
              prefetch
              className="flex min-w-[85%] snap-start items-start gap-4 rounded-xl border border-border/40 bg-background p-5 shadow-sm transition-colors hover:border-brand-red/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:min-w-0"
            >
              <div
                className="shrink-0 rounded-lg bg-brand-red/5 p-2 text-brand-red"
                aria-hidden="true"
              >
                <Icon size={22} />
              </div>
              <div className="min-w-0 text-right">
                <h4 className="text-base font-bold text-foreground">
                  {feature.title}
                </h4>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
