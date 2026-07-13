/**
 * CJS/ESM interop-safe Sentry capture for API routes.
 * `import * as Sentry` can leave captureException only on `.default`
 * (Node/Vercel), which throws TypeError at runtime.
 */
import * as SentryModule from "@sentry/nextjs";

type SentryCapture = {
  captureException: (
    exception: unknown,
    captureContext?: Record<string, unknown>,
  ) => string;
};

function resolveSentry(): SentryCapture | null {
  const mod = SentryModule as typeof SentryModule & {
    default?: SentryCapture;
    captureException?: SentryCapture["captureException"];
  };

  if (typeof mod.captureException === "function") {
    return { captureException: mod.captureException.bind(mod) };
  }

  if (typeof mod.default?.captureException === "function") {
    return {
      captureException: mod.default.captureException.bind(mod.default),
    };
  }

  return null;
}

export function captureException(
  exception: unknown,
  captureContext?: Record<string, unknown>,
): string | undefined {
  const sentry = resolveSentry();
  if (!sentry) {
    console.error("[sentry] captureException unavailable", exception);
    return undefined;
  }

  try {
    return sentry.captureException(exception, captureContext);
  } catch (err) {
    console.error("[sentry] captureException failed", err);
    return undefined;
  }
}
