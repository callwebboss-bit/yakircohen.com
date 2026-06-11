import dynamic from "next/dynamic";
import BlockSkeleton from "@/components/ui/BlockSkeleton";

function wizardSkeleton(height = "min-h-[24rem]") {
  return <BlockSkeleton className={height} />;
}

export const FilterGateLazy = dynamic(
  () => import("@/components/marketing/FilterGate"),
  { loading: () => wizardSkeleton() },
);

// IMPROVED: defer heavy booking wizards from /book initial bundle
export const PodcastBookingWizardLazy = dynamic(
  () => import("@/components/marketing/PodcastBookingWizard"),
  { loading: () => wizardSkeleton() },
);

export const EventsBookingWizardLazy = dynamic(
  () => import("@/components/marketing/EventsBookingWizard"),
  { loading: () => wizardSkeleton("min-h-[28rem]") },
);

export const SingerAmplificationBookingWizardLazy = dynamic(
  () => import("@/components/marketing/SingerAmplificationBookingWizard"),
  { loading: () => wizardSkeleton() },
);

export const AcademyBookingWizardLazy = dynamic(
  () => import("@/components/marketing/AcademyBookingWizard"),
  { loading: () => wizardSkeleton() },
);

export const ClipsBookingFormLazy = dynamic(
  () => import("@/components/marketing/ClipsBookingForm"),
  { loading: () => wizardSkeleton("min-h-[20rem]") },
);

export const OnlineRestoreBookingPanelLazy = dynamic(
  () => import("@/components/marketing/OnlineRestoreBookingPanel"),
  { loading: () => wizardSkeleton() },
);
