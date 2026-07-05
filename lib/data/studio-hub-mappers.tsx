import type { ReactNode } from "react";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import type { BlessingTypeCard } from "@/lib/data/blessings-hub-page";
import type { RecordingStudioOffering } from "@/lib/data/recording-studio-page";
import type { GeoStudioServiceLink } from "@/lib/data/studio-geo-page";

function emojiIcon(emoji: string): ReactNode {
  return (
    <span className="text-2xl" aria-hidden>
      {emoji}
    </span>
  );
}

export function mapGeoStudioServiceToHub(
  item: GeoStudioServiceLink,
): HubLinkItem {
  return {
    href: item.href,
    title: item.title,
    description: item.description,
    icon: emojiIcon(item.emoji),
  };
}

export function mapRecordingOfferingToHub(
  item: RecordingStudioOffering,
): HubLinkItem {
  return {
    href: item.href,
    title: item.title,
    description: item.description,
    badge: item.subtitle,
    badgeVariant: "orange",
  };
}

export function mapBlessingTypeToHub(
  card: BlessingTypeCard,
  waHref: string,
): HubLinkItem {
  if (!card.href) {
    return {
      href: waHref,
      title: card.title,
      description: card.description,
      icon: emojiIcon(card.emoji),
      external: true,
      ctaLabel: "לייעוץ בוואטסאפ",
    };
  }

  return {
    href: card.href,
    title: card.title,
    description: card.description,
    icon: emojiIcon(card.emoji),
  };
}

export function mapEmojiLinkToHub(item: {
  emoji: string;
  title: string;
  description: string;
  href: string;
}): HubLinkItem {
  return {
    href: item.href,
    title: item.title,
    description: item.description,
    icon: emojiIcon(item.emoji),
  };
}
