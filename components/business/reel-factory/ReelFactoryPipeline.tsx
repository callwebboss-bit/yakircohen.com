import ProcessSteps from "@/components/marketing/ProcessSteps";
import { PIPELINE_STEPS } from "@/lib/data/reel-factory";

export default function ReelFactoryPipeline() {
  return (
    <ProcessSteps
      steps={PIPELINE_STEPS}
      heading="פס ייצור ל-Promos ב-24 שעות"
      subheading="The Reel Factory"
    />
  );
}
