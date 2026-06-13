import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="podcast">{children}</HubAccentScope>;
}
