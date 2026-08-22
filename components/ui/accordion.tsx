"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import {
  ChevronDownIcon,
} from "@/components/layout/footer-category-icons"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border",
        className
      )}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b data-open:bg-muted/50", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "touch-target group/accordion-trigger flex flex-1 items-center justify-between gap-4 border border-transparent px-4 py-4 text-start text-sm font-semibold transition-colors outline-none hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:pointer-events-none disabled:opacity-50 sm:px-5 sm:text-base",
          className
        )}
        {...props}
      >
        <span className="min-w-0 flex-1 leading-snug">{children}</span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-[transform,background-color,border-color,color] duration-normal ease-luxury motion-reduce:transition-none group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger:border-brand-red/40 group-aria-expanded/accordion-trigger:bg-brand-red/10 group-aria-expanded/accordion-trigger:text-brand-red"
          aria-hidden="true"
        >
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="grid overflow-hidden transition-[grid-template-rows] duration-normal ease-luxury motion-reduce:transition-none data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
      {...props}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
            className
          )}
        >
          {children}
        </div>
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
