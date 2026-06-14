import type { FAQItem } from "@/components/ui/FAQAccordion";

export type BusinessTier = {
  id: string;
  name: string;
  priceNis: number;
  priceLabel: string;
  priceNote?: string;
  badge?: string;
  description: string;
  deliverables: readonly string[];
  utmCampaign: string;
};

export type BusinessProcessStep = {
  step: number;
  title: string;
  body: string;
};

export type BusinessPageConfig = {
  brand: string;
  tagline?: string;
  pageTitle: string;
  subtitle: string;
  pageFeatures: readonly string[];
  scarcityLabel?: string;
  ctaLabel?: string;
  hubWhatsappText: string;
  utmCampaign: string;
  termsVatNote?: string;
  tiers: readonly BusinessTier[];
  processSteps?: readonly BusinessProcessStep[];
  aboutParagraphs: readonly string[];
  faqs: FAQItem[];
  differentiation?: readonly { label: string; href: string; note: string }[];
  relatedLinks?: readonly { label: string; href: string }[];
};
