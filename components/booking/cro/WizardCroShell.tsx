"use client";

import WizardExitIntentModal from "@/components/booking/WizardExitIntentModal";
import WizardIdleHelpBubble from "@/components/booking/WizardIdleHelpBubble";
import type { WizardCroConfig } from "@/lib/book-wizard-cro/types";

type WizardCroShellProps = {
  config: Pick<WizardCroConfig, "exitIntent" | "idleHelp">;
  exitIntentOpen: boolean;
  packageLabel: string;
  totalExVat: number;
  onContinueExit: () => void;
  onCloseExit: () => void;
  idleVisible: boolean;
  escapeWaHref: string;
  onDismissIdle: () => void;
};

/** exit intent + idle help - config-driven per category */
export function WizardCroShell({
  config,
  exitIntentOpen,
  packageLabel,
  totalExVat,
  onContinueExit,
  onCloseExit,
  idleVisible,
  escapeWaHref,
  onDismissIdle,
}: WizardCroShellProps) {
  return (
    <>
      <WizardIdleHelpBubble
        visible={idleVisible && !!escapeWaHref}
        waHref={escapeWaHref}
        onDismiss={onDismissIdle}
        message={config.idleHelp.message}
        cta={config.idleHelp.cta}
        dismiss={config.idleHelp.dismiss}
      />
      <WizardExitIntentModal
        open={exitIntentOpen}
        packageLabel={packageLabel}
        totalExVat={totalExVat}
        onContinue={onContinueExit}
        onClose={onCloseExit}
        title={config.exitIntent.title}
        body={config.exitIntent.body}
        continueCta={config.exitIntent.cta}
        dismissCta={config.exitIntent.dismiss}
      />
    </>
  );
}
