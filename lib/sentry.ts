/**
 * Sentry scaffold (Allegato A § 1.1).
 *
 * Attivazione plug-and-play: imposta `SENTRY_DSN` in env e Sentry SDK viene
 * inizializzato al primo `captureException`. Senza DSN tutto è no-op.
 *
 * Per attivare in produzione:
 *   npm i @sentry/nextjs
 *   poi sostituire `tryImportSentry` con import statico e wrappare
 *   l'app con `withSentryConfig` in next.config.mjs.
 */

let sentryReady = false;

async function tryImportSentry(): Promise<any | null> {
  if (!process.env.SENTRY_DSN) return null;
  try {
    // @ts-expect-error — pacchetto opzionale, da installare al go-live
    const Sentry = await import("@sentry/nextjs");
    if (!sentryReady) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
        environment: process.env.VERCEL_ENV ?? "development",
      });
      sentryReady = true;
    }
    return Sentry;
  } catch {
    return null;
  }
}

export async function captureException(error: unknown, context?: Record<string, unknown>): Promise<void> {
  const Sentry = await tryImportSentry();
  if (Sentry) {
    Sentry.captureException(error, { extra: context });
    return;
  }
  console.error("[wondersun]", error, context);
}

export async function captureMessage(message: string, level: "info" | "warning" | "error" = "info"): Promise<void> {
  const Sentry = await tryImportSentry();
  if (Sentry) {
    Sentry.captureMessage(message, level);
    return;
  }
  if (level === "error") console.error("[wondersun]", message);
  else if (level === "warning") console.warn("[wondersun]", message);
}
