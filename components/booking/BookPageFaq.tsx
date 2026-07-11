"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BOOK_PAGE_FAQ } from "@/lib/data/book-page-faq";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export default function BookPageFaq() {
  return (
    <Section className="border-t border-border bg-background">
      <Container className="max-w-3xl">
        <h2 className="mb-6 font-serif text-xl font-semibold text-foreground sm:text-2xl">
          שאלות נפוצות
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {BOOK_PAGE_FAQ.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-xl border border-border bg-surface px-4"
            >
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                <p>{item.answer}</p>
                {item.link ? (
                  <Link
                    href={item.link.href}
                    className="mt-2 inline-flex min-h-9 items-center text-sm font-medium text-brand-red hover:underline"
                  >
                    {item.link.label}
                  </Link>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
