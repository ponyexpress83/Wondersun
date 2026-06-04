import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEMO_ACCOUNTS, isDemoEnabled, provisionDemoAccount, type DemoRole } from "@/lib/demo";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isDemoEnabled()) {
    return NextResponse.json({ error: "demo_disabled" }, { status: 404 });
  }

  let role: DemoRole | undefined;
  try {
    const body = await request.json();
    role = body?.role;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!role || !(role in DEMO_ACCOUNTS)) {
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }

  const account = DEMO_ACCOUNTS[role];

  try {
    await provisionDemoAccount(role);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "provisioning_failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, redirectTo: account.redirectTo });
}
