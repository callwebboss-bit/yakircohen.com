"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FOOTER_CATEGORY_TREE,
  type FooterCategoryGroup,
  type FooterCategoryId,
} from "@/lib/footer-category-tree";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Mic2,
  Podcast,
  Sparkles,
  Music2,
  Video,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<FooterCategoryId, LucideIcon> = {
  studio: Mic2,
  podcast: Podcast,
  ai: Sparkles,
  events: Music2,
  video: Video,
  academy: GraduationCap,
};

function CategoryLinks({ links }: { links: FooterCategoryGroup["links"] }) {
  return (
    <ul className="space-y-1">
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            title={item.title}
            className="inline-flex min-h-11 items-center text-xs text-[var(--footer-muted)] transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CategoryAccordionItem({ category }: { category: FooterCategoryGroup }) {
  const Icon = CATEGORY_ICONS[category.id];

  return (
    <AccordionItem
      value={category.id}
      className="border-[var(--footer-border)] data-open:bg-white/5"
    >
      <AccordionTrigger className="gap-3 px-3 py-3 text-[var(--footer-fg)] hover:no-underline hover:bg-white/5 [&>svg]:text-[var(--footer-muted)]">
        <span className="flex min-w-0 flex-1 items-center gap-2.5">
          <Icon className="h-4 w-4 shrink-0 text-brand-red" aria-hidden />
          <Link
            href={category.hubHref}
            title={category.hubTitle}
            className="truncate text-sm font-medium hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            onClick={(e) => e.stopPropagation()}
          >
            {category.label}
          </Link>
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3">
        <CategoryLinks links={category.links} />
      </AccordionContent>
    </AccordionItem>
  );
}

export default function FooterCategorySitemap() {
  return (
    <nav className="footer-zone" aria-label="שירותים לפי קטגוריה">
      <h2 className="text-sm font-semibold text-[var(--footer-fg)]">שירותים</h2>
      <Accordion
        type="multiple"
        className={cn(
          "mt-4 rounded-xl border-[var(--footer-border)] bg-white/[0.03]",
        )}
      >
        {FOOTER_CATEGORY_TREE.map((category) => (
          <CategoryAccordionItem key={category.id} category={category} />
        ))}
      </Accordion>
    </nav>
  );
}
