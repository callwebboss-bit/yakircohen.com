import type { ComponentType } from "react";
import { SOCIAL_LINKS } from "@/lib/constants";
import type { IconProps } from "@/components/ui/Icons";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const SOCIAL_ICONS: Record<
  (typeof SOCIAL_LINKS)[number]["label"],
  ComponentType<IconProps>
> = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
};

type FooterSocialLinksProps = {
  variant?: "default" | "dark";
};

export default function FooterSocialLinks({ variant = "default" }: FooterSocialLinksProps) {
  const isDark = variant === "dark";

  return (
    <nav className="mt-6" aria-label="רשתות חברתיות">
      <h2
        className={cn(
          "text-sm font-semibold tracking-wide",
          isDark ? "text-[var(--footer-fg)]" : "text-foreground",
        )}
      >
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
                className={cn(
                  "touch-target inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-[colors,box-shadow,border-color] duration-normal ease-luxury hover:border-brand-red/40 hover:text-brand-red hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  isDark
                    ? "border-[var(--footer-border)] bg-white/5 text-[var(--footer-muted)]"
                    : "border-border bg-background text-muted-foreground",
                )}
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
