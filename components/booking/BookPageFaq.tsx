"use client";

import { useState } from "react";
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
  /* נשלט ולא uncontrolled, כדי שנדע איזה פריט פתוח ונוכל להחיל inert על
     השאר. אותו דפוס כמו FooterCategorySitemap. */
  const [openId, setOpenId] = useState("");
  return (
    <Section className="border-t border-border bg-background">
      <Container className="max-w-3xl">
        <h2 className="mb-6 font-serif text-xl font-semibold text-foreground sm:text-2xl">
          שאלות נפוצות
        </h2>
        <Accordion
          type="single"
          collapsible
          value={openId}
          onValueChange={setOpenId}
          className="space-y-2"
        >
          {BOOK_PAGE_FAQ.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-xl border border-border bg-surface px-4"
            >
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              {/* forceMount: התשובה נכתבת ל-HTML גם כשהפריט סגור. בלעדיו הסכמה
                  (FAQPage) הצהירה על תשובות שאף סורק לא ראה.
                  inert כשסגור: הפאנל מקופל לגובה אפס ב-CSS בלבד, ובלי inert הקישור
                  שבתוך התשובה הרביעית קיבל מיקוד מקלדת בלתי נראה וקורא המסך קרא
                  את כל התשובות. הגרסה הקודמת ניסתה data-[state=closed]:hidden, אבל
                  className של AccordionContent נוחת על div פנימי בלי data-state,
                  ולכן הכלל לא חל מעולם. נמצא בסבב ביקורת 16.9.2026. */}
              <AccordionContent
                forceMount
                inert={openId !== item.id}
                className="text-sm leading-relaxed text-muted-foreground"
              >
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
