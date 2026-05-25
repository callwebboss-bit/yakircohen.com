import type { ComponentType } from "react";
import { SOCIAL_LINKS } from "@/lib/constants";
import type { IconProps } from "@/components/ui/Icons";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/ui/Icons";

const SOCIAL_ICONS: Record<
  (typeof SOCIAL_LINKS)[number]["label"],
  ComponentType<IconProps>
> = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
};

export default function FooterSocialLinks() {
  return (
    <nav className="mt-6" aria-label="רשתות חברתיות">
      <h2 className="text-sm font-semibold tracking-wide text-foreground">
        עקבו אחרינו
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {SOCIAL_LINKS.map((item) => {
          const Icon = SOCIAL_ICONS[item.label];
          return (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:border-brand-red/40 hover:text-brand-red"
                aria-label={item.label}
              >
                <Icon size={20} />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
