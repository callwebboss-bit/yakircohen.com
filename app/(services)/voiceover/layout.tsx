import type { ReactNode } from "react";
import HubAccentScope from "@/components/theme/HubAccentScope";

export default function VoiceoverLayout({ children }: { children: ReactNode }) {
  return <HubAccentScope category="voiceover">{children}</HubAccentScope>;
}
