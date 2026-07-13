"use client";

import dynamic from "next/dynamic";
import LeadFormSkeleton from "@/components/leads/LeadFormSkeleton";

const PricingInquiryForm = dynamic(
  () => import("@/components/pricing/PricingInquiryForm"),
  { loading: () => <LeadFormSkeleton />, ssr: false },
);

export default function PricingInquiryFormLazy() {
  return <PricingInquiryForm />;
}
