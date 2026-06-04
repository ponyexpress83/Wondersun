import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit, rateLimitKeyFromRequest, RATE_LIMITS } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  // Rate limit globale lasco sulle API per protezione anti-abuso (Allegato A § 5.2).
  // I limiti più stretti (chatbot, upload, auth) sono applicati nei singoli handler.
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const rl = checkRateLimit(rateLimitKeyFromRequest(request, "global"), RATE_LIMITS.api_default);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra qualche istante." },
        { status: 429, headers: { "retry-after": String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match tutte le richieste eccetto:
     * - _next/static, _next/image, favicon
     * - file con estensione (immagini, font, ecc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
