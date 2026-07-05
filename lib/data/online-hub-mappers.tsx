import type { ReactNode } from "react";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import type {
  OnlineFeaturedService,
  OnlineServiceItem,
} from "@/lib/data/online-page";

function emojiIcon(emoji: string): ReactNode {
  return (
    <span className="text-2xl" aria-hidden>
      {emoji}
    </span>
  );
}

export function mapOnlineFeaturedToHub(
  services: readonly OnlineFeaturedService[],
): HubLinkItem[] {
  return services.map((svc) => ({
    href: svc.href,
    title: svc.title,
    description: svc.intro,
    descriptionFull: `כולל: ${svc.includes}. מתאים ל: ${svc.suited}.`,
    icon: emojiIcon(svc.icon),
    isAiService: true,
  }));
}

export function mapOnlineServiceToHub(
  service: OnlineServiceItem,
  fallbackWaHref: string,
): HubLinkItem {
  const href = service.href ?? fallbackWaHref;
  return {
    href,
    title: service.title,
    description: service.summary,
    icon: emojiIcon(service.icon),
    badge: service.tag,
    badgeVariant: service.tag ? "red" : undefined,
    isAiService: true,
    external: !service.href,
    ctaLabel: service.href ? "לפרטים ותיאום" : "בקשו התאמה אישית",
  };
}

export function mapOnlineQuickLinksToHub(
  links: readonly { href: string; label: string; desc: string }[],
): HubLinkItem[] {
  return links.map((link) => ({
    href: link.href,
    title: link.label,
    description: link.desc,
    isAiService: true,
  }));
}
