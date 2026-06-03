/**
 * Rate limiter in-memory per route API (Allegato A § 5.2).
 *
 * Funziona per worker singolo (Vercel serverless function). Per protezione
 * distribuita su scale > 1 worker conviene Upstash Redis: TODO Sprint 4.
 */
type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function checkRateLimit(key: string, opts: RateLimitOptions): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  if (bucket.count >= opts.max) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }
  bucket.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

export function rateLimitKeyFromRequest(request: Request, scope = "default"): string {
  const fwd = request.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anon";
  return `${scope}:${ip}`;
}

export const RATE_LIMITS = {
  // Default lasco per API generiche
  api_default: { windowMs: 60_000, max: 60 },
  // Operazioni costose o sensibili
  auth: { windowMs: 60_000, max: 10 },
  // Chatbot Sole — costo per chiamata Anthropic
  chatbot: { windowMs: 60 * 60_000, max: 30 },
  // Upload file
  upload: { windowMs: 60_000, max: 10 },
} as const;
