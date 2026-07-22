import { getBlogPostBySlug } from "@/lib/data/blog";
import {
  EVENTS_SERVICES,
  PHOTOGRAPHY_SERVICES,
  STUDIO_SERVICES,
  VIDEO_SERVICES,
  VOICEOVER_SERVICES,
  type ServiceEntity,
} from "@/lib/data/services";
import { absoluteUrl } from "@/lib/site-url";
import {
  BREADCRUMB_PATH_OVERRIDES,
  BREADCRUMB_SEGMENT_LABELS,
} from "@/lib/breadcrumbs/segment-labels";

export type BreadcrumbItem = {
  href: string;
  label: string;
};

const HOME: BreadcrumbItem = { href: "/", label: "בית" };

let serviceBySlug: Map<string, string> | null = null;

function getServiceTitleMap(): Map<string, string> {
  if (serviceBySlug) return serviceBySlug;
  const entities: ServiceEntity[] = [
    ...Object.values(STUDIO_SERVICES),
    ...Object.values(VOICEOVER_SERVICES),
    ...Object.values(EVENTS_SERVICES),
    ...Object.values(VIDEO_SERVICES),
    ...Object.values(PHOTOGRAPHY_SERVICES),
  ];
  serviceBySlug = new Map(entities.map((s) => [s.slug, s.title]));
  return serviceBySlug;
}

function labelForPath(path: string): string {
  const override = BREADCRUMB_PATH_OVERRIDES[path];
  if (override) return override;

  const serviceTitle = getServiceTitleMap().get(path.replace(/^\//, ""));
  if (serviceTitle) return serviceTitle;

  const segments = path.replace(/^\//, "").split("/");
  const last = segments[segments.length - 1] ?? "";
  if (BREADCRUMB_SEGMENT_LABELS[last]) {
    return BREADCRUMB_SEGMENT_LABELS[last];
  }

  return last.replace(/-/g, " ").trim() || path;
}

/**
 * Builds breadcrumb trail for a pathname (no trailing slash except root).
 * Returns empty for homepage.
 */
export function buildBreadcrumbTrail(pathname: string): BreadcrumbItem[] {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") return [];

  const override = BREADCRUMB_PATH_OVERRIDES[normalized];
  const segments = normalized.split("/").filter(Boolean);

  if (segments[0] === "blog" && segments.length === 2) {
    const post = getBlogPostBySlug(segments[1]);
    return [
      HOME,
      { href: "/blog", label: BREADCRUMB_SEGMENT_LABELS.blog },
      {
        href: normalized,
        label: post?.title ?? labelForPath(normalized),
      },
    ];
  }

  const trail: BreadcrumbItem[] = [HOME];
  let acc = "";

  for (let i = 0; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    const isLast = i === segments.length - 1;
    trail.push({
      href: acc,
      label: isLast && override ? override : labelForPath(acc),
    });
  }

  return trail;
}

export function breadcrumbListJsonLd(trail: BreadcrumbItem[]) {
  if (trail.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href === "/" ? "" : item.href.replace(/^\//, "")),
    })),
  };
}
