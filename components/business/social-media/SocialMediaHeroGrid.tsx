import {
  HERO_EXPERTISE,
  SOCIAL_MEDIA_BRAND,
} from "@/lib/data/social-media";
import {
  MicIcon,
  RadioIcon,
  SparklesIcon,
  VideoIcon,
} from "@/components/ui/Icons";
import type { ComponentType } from "react";
import type { IconProps } from "@/components/ui/Icons";

const ICON_MAP: Record<
  (typeof HERO_EXPERTISE)[number]["icon"],
  ComponentType<IconProps>
> = {
  video: VideoIcon,
  radio: RadioIcon,
  mic: MicIcon,
  sparkles: SparklesIcon,
};

export default function SocialMediaHeroGrid() {
  return (
    <section
      className="border-b border-border bg-surface py-12 sm:py-14"
      aria-labelledby="social-expertise-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h2
            id="social-expertise-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה {SOCIAL_MEDIA_BRAND}?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            שילוב של יצירת תוכן, שיווק מדויק וניסיון מעולמות הרדיו, הפודקאסט וההנחיה.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_EXPERTISE.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <li
                key={item.title}
                className="flex flex-col rounded-2xl border border-border bg-background p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-red/30 bg-brand-red/8 text-brand-red">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
