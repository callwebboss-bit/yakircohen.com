"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import {
  FOOTER_CATEGORY_TREE,
  type FooterCategoryGroup,
  type FooterCategoryId,
} from "@/lib/footer-category-tree";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FooterCategoryIcon,
} from "@/components/layout/footer-category-icons";

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

function CategoryAccordionItem({
  category,
  isOpen,
}: {
  category: FooterCategoryGroup;
  isOpen: boolean;
}) {
  return (
    <AccordionItem
      value={category.id}
      className="border-[var(--footer-border)] data-open:bg-white/5"
    >
      <AccordionPrimitive.Header className="flex items-stretch">
        <Link
          href={category.hubHref}
          title={category.hubTitle}
          className="flex flex-1 min-w-0 items-center gap-2.5 px-3 py-3 text-sm font-medium text-[var(--footer-fg)] hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          <FooterCategoryIcon id={category.id} />
          <span className="truncate">{category.label}</span>
        </Link>
        <AccordionPrimitive.Trigger
          aria-label={`הצגת קישורי ${category.label}`}
          className="flex shrink-0 items-center justify-center w-10 text-[var(--footer-muted)] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red group/chevron"
        >
          <ChevronDownIcon className="h-4 w-4 pointer-events-none group-aria-expanded/chevron:hidden" />
          <ChevronUpIcon className="hidden h-4 w-4 pointer-events-none group-aria-expanded/chevron:inline" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      {/* forceMount: Radix מפרק תוכן סגור, ואז 95 קישורי הפוטר נעדרים מה-HTML
          שהסורק מקבל. מותקן תמיד = נסרק תמיד, כולל ב-SSR שבו openIds ריק.
          inert מונע מהמקלדת להיכנס לקישורים שמקופלים לגובה אפס. גישת ה-inert
          זהה ל-FAQAccordion, אבל מנגנון ההרכבה שונה: שם זה div ידני בלי Radix,
          וזה ה-forceMount היחיד בקוד. */}
      <AccordionContent className="px-3 pb-3" forceMount inert={!isOpen}>
        <CategoryLinks links={category.links} />
      </AccordionContent>
    </AccordionItem>
  );
}

function subscribeDesktop(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getDesktopSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getDesktopServerSnapshot() {
  return false;
}

export default function FooterCategorySitemap() {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot,
  );

  /* נשלט ולא uncontrolled, כדי שנדע איזה פאנל פתוח ונוכל להחיל inert. */
  const [openIds, setOpenIds] = useState<string[]>([]);
  const touchedRef = useRef(false);

  /* ברירת מחדל לפי רוחב המסך, אבל רק עד שהמשתמש נגע. בלי הדגל, סיבוב מכשיר
     או שינוי גודל חלון היה סוגר בחזרה כל מה שהוא פתח. */
  useEffect(() => {
    if (touchedRef.current) return;
    setOpenIds(isDesktop ? ["studio"] : []);
  }, [isDesktop]);

  const handleValueChange = (next: string[]) => {
    touchedRef.current = true;
    setOpenIds(next);
  };

  return (
    <nav className="footer-zone" aria-label="שירותים לפי קטגוריה">
      <h2 className="text-sm font-semibold text-[var(--footer-fg)]">שירותים</h2>
      <Accordion
        type="multiple"
        value={openIds}
        onValueChange={handleValueChange}
        className={cn(
          "mt-4 rounded-xl border-[var(--footer-border)] bg-white/[0.03]",
        )}
      >
        {FOOTER_CATEGORY_TREE.map((category) => (
          <CategoryAccordionItem
            key={category.id}
            category={category}
            isOpen={openIds.includes(category.id)}
          />
        ))}
      </Accordion>
    </nav>
  );
}
