import Link from "next/link";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import {
  STUDIO_HUB_PATH_EXTRAS,
  STUDIO_HUB_PRIMARY_PATHS,
} from "@/lib/data/studio-hub-paths";
import { getStudioHubIcon } from "@/lib/data/studio-hub-icons";

export default function StudioHubPathSections() {
  const links = STUDIO_HUB_PRIMARY_PATHS.map((path) => ({
    ...path,
    icon: getStudioHubIcon(path.href),
  }));

  return (
    <div className="space-y-8">
      <ServiceHubLinks
        heading="מה מתאים לי?"
        subheading="ארבעה מסלולים ברורים. האולפן במודיעין - או נייד עד אליכם. מחיר עוגן לפני מע״מ."
        links={links}
        headingId="studio-paths-heading"
        columns={2}
      />

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STUDIO_HUB_PRIMARY_PATHS.map((path) => {
          const extras = STUDIO_HUB_PATH_EXTRAS[path.href] ?? [];
          if (extras.length === 0) return null;
          return (
            <li
              key={`extras-${path.href}`}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-sm"
            >
              <p className="font-semibold text-foreground">{path.title}</p>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
                {extras.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="min-h-12 inline-flex items-center font-medium text-brand-red hover:underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
