import dynamic from "next/dynamic";
import BlockSkeleton from "@/components/ui/BlockSkeleton";

const calcLoading = (height = "min-h-[14rem]") => (
  <BlockSkeleton className={height} />
);

export const PodcastCalculatorLazy = dynamic(
  () => import("@/components/calculators/PodcastCalculator"),
  { loading: () => calcLoading() },
);

export const DjEventsCalculatorLazy = dynamic(
  () => import("@/components/calculators/DjEventsCalculator"),
  { loading: () => calcLoading("min-h-[18rem]") },
);

export const AttractionsCalculatorLazy = dynamic(
  () => import("@/components/calculators/AttractionsCalculator"),
  { loading: () => calcLoading("min-h-[16rem]") },
);

export const PhotographyCalculatorLazy = dynamic(
  () => import("@/components/calculators/PhotographyCalculator"),
  { loading: () => calcLoading() },
);

export const TimeSaverRoiSliderLazy = dynamic(
  () => import("@/components/calculators/TimeSaverRoiSlider"),
  { loading: () => calcLoading("min-h-[20rem]") },
);
