import type { CSSProperties, ReactNode } from "react";
import {
  resolveServiceAccentColor,
  resolveServiceAccentInkColor,
} from "@/lib/theme/service-accent";

export type HubAccentScopeProps = {
  category?: string | null;
  children: ReactNode;
};

/**
 * Activates the contextual --service-accent (and derived --service-accent-ink)
 * colors for a route subtree and lifts them to :root so Header/Footer/FloatingFabs
 * (rendered outside this subtree by the root layout) sync to the same hub color - pure CSS.
 */
export default function HubAccentScope({ category, children }: HubAccentScopeProps) {
  if (!category) return <>{children}</>;

  const accentColor = resolveServiceAccentColor(category);
  const accentInkColor = resolveServiceAccentInkColor(category);
  const accentStyle = {
    "--service-accent": accentColor,
    "--service-accent-ink": accentInkColor,
  } as CSSProperties;

  return (
    <div style={accentStyle}>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{--service-accent:${accentColor};--service-accent-ink:${accentInkColor}}`,
        }}
      />
      {children}
    </div>
  );
}
