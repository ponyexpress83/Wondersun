import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresh della sessione Supabase ad ogni richiesta + protezione route.
 * Chiamato da middleware.ts in radice.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se Supabase non è configurato (modalità mock) consentiamo tutto:
  // le pagine protette renderizzeranno il proprio fallback "configura Supabase".
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    const requiresAuth =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/fornitore") ||
      pathname.startsWith("/admin");

    if (requiresAuth && !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return redirectKeepingSession(loginUrl, response);
    }

    // Protezione admin: solo il ruolo admin entra in /admin.
    if (pathname.startsWith("/admin") && user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      // Si reindirizza SOLO se il ruolo è stato letto davvero e non è admin.
      // Se la lettura fallisce (latenza, sessione in fase di rinnovo) non si
      // deve buttare l'utente nell'area cliente: la pagina è comunque protetta
      // da requireRole().
      if (!error && profile && profile.role !== "admin") {
        return redirectKeepingSession(new URL("/dashboard", request.url), response);
      }
    }
  } catch (err) {
    // Supabase irraggiungibile / mal configurato: NON far cadere l'intera app
    // (il middleware gira su ogni route, home inclusa → un throw = 503 ovunque).
    // Degradiamo "fail-open": le pagine protette restano comunque protette da
    // requireProfile(), che reindirizza a /login quando il profilo è null.
    console.warn("[middleware] Supabase non raggiungibile, degrado fail-open:", err);
    return response;
  }

  return response;
}

/**
 * Esegue un redirect conservando i cookie di sessione aggiornati.
 *
 * Supabase rinnova il token durante updateSession scrivendo i cookie sulla
 * response corrente: creando una nuova response di redirect quei cookie
 * andrebbero persi e l'utente si ritroverebbe scollegato (o rimbalzato in
 * un'altra area) a ogni cambio pagina.
 */
function redirectKeepingSession(url: URL, from: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}
