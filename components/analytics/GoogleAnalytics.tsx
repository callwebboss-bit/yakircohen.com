import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

export const GA_MEASUREMENT_ID = "G-PVW4GMPNS4";

// OPTIMIZED: official @next/third-parties loader — non-blocking vs next/script afterInteractive
export default function GoogleAnalytics() {
  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
