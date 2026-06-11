import { headers } from "next/headers";
import {
  breadcrumbListJsonLd,
  buildBreadcrumbTrail,
} from "@/lib/breadcrumbs/build-trail";

/** Server-rendered BreadcrumbList JSON-LD for crawlers (initial HTML). */
export default async function BreadcrumbJsonLd() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const trail = buildBreadcrumbTrail(pathname);
  const jsonLd = breadcrumbListJsonLd(trail);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
