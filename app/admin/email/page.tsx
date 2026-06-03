import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { EMAIL_TEMPLATES, type EmailSlug } from "@/lib/email-templates";
import EmailTemplateEditor from "@/components/admin/EmailTemplateEditor";

export const metadata = { title: "Email · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminEmailPage() {
  const profile = await requireRole("admin");
  const admin = createSupabaseAdminClient();
  const { data: stored = [] } = await admin.from("email_templates").select("*");

  const items = (Object.keys(EMAIL_TEMPLATES) as EmailSlug[]).map((slug) => {
    const existing = (stored as any[]).find((p) => p.slug === slug);
    return {
      slug,
      title: EMAIL_TEMPLATES[slug].title,
      subject: existing?.subject ?? EMAIL_TEMPLATES[slug].defaultSubject,
      body_md: existing?.body_md ?? EMAIL_TEMPLATES[slug].defaultBody,
      updated_at: existing?.updated_at ?? null,
    };
  });

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title="Template email"
      subtitle="Variabili disponibili: {nomeCliente}, {titoloEsperienza}, {dataEsperienza}, {oraEsperienza}, {codicePrenotazione}, {linkAccesso}, {motivazione}."
    >
      <EmailTemplateEditor templates={items} />
    </DashboardLayout>
  );
}
