import type { CSSProperties, ReactNode } from "react";
import {
  resolveHubGlow,
  resolveHubMesh,
  resolveServiceAccentColor,
  resolveServiceAccentInkColor,
} from "@/lib/theme/service-accent";

export type HubAccentScopeProps = {
  category?: string | null;
  children: ReactNode;
};

/**
 * Activates hub accent + atmosphere vars and lifts them to :root so Header/Footer/FABs
 * (outside this subtree) stay in sync. Mesh/glow are precomputed hex/rgba strings.
 */
export default function HubAccentScope({ category, children }: HubAccentScopeProps) {
  if (!category) return <>{children}</>;

  const accentColor = resolveServiceAccentColor(category);
  const accentInkColor = resolveServiceAccentInkColor(category);
  const hubMesh = resolveHubMesh(category);
  const hubGlow = resolveHubGlow(category);
  const accentStyle = {
    "--service-accent": accentColor,
    "--service-accent-ink": accentInkColor,
    "--hub-mesh": hubMesh,
    "--hub-glow": hubGlow,
  } as CSSProperties;

  return (
    <div style={accentStyle}>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{--service-accent:${accentColor};--service-accent-ink:${accentInkColor};--hub-glow:${hubGlow};--hub-mesh:${hubMesh}}`,
        }}
      />
      {children}
    </div>
  );
}
