"use client";

import { Suspense } from "react";
import BookPageFaq from "@/components/booking/BookPageFaq";
import BookPageSections from "@/components/booking/BookPageSections";
import BookQuickIntakeSection from "@/components/booking/BookQuickIntakeSection";
import { BookPageLayoutProvider } from "@/components/booking/BookPageLayoutContext";
import SmartFormKoalendarBootstrap from "@/components/booking/smart-form/SmartFormKoalendarBootstrap";
import type { BookUtmBoostOptions } from "@/hooks/useBookUtmBoost";

type BookPageClientProps = {
  pkgParam?: string | null;
  itemParam?: string | null;
  catalogParam?: string | null;
  couponParam?: string | null;
  routeParam?: string | null;
  qualParam?: string | null;
} & BookUtmBoostOptions;

export default function BookPageClient({
  pkgParam = null,
  itemParam = null,
  catalogParam = null,
  couponParam = null,
  routeParam = null,
  qualParam = null,
  utmCampaign = null,
  utmContent = null,
}: BookPageClientProps) {
  return (
    <BookPageLayoutProvider>
      <BookPageSections
        pkgParam={pkgParam}
        itemParam={itemParam}
        catalogParam={catalogParam}
        couponParam={couponParam}
        routeParam={routeParam}
        qualParam={qualParam}
        utmCampaign={utmCampaign}
        utmContent={utmContent}
      />
      <BookQuickIntakeSection />
      <BookPageFaq />
      <Suspense fallback={null}>
        <SmartFormKoalendarBootstrap />
      </Suspense>
    </BookPageLayoutProvider>
  );
}
