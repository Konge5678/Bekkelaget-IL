import { AdminToast } from "@/components/admin/admin-toast";
import { MembersPanel } from "@/components/admin/members-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminMembersPage({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/members");
  }

  const sp = (await searchParams) ?? {};
  const toastRaw = sp.toast;
  const toastTypeRaw = sp.toastType;
  const toastMessage = typeof toastRaw === "string" ? toastRaw : null;
  const toastType =
    toastTypeRaw === "success" ||
    toastTypeRaw === "error" ||
    toastTypeRaw === "info" ||
    toastTypeRaw === "warning"
      ? toastTypeRaw
      : null;

  const qRaw = sp.q;
  const q = typeof qRaw === "string" ? qRaw.trim() : "";

  let query = supabase
    .from("members")
    .select(
      "id,name,email,phone,has_paid_contingent,due_date,created_at",
    )
    .order("created_at", { ascending: false });

  if (q) {
    const escaped = q.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.or(
      `name.ilike.%${escaped}%,email.ilike.%${escaped}%,phone.ilike.%${escaped}%`,
    );
  }

  const { data: members, error } = await query;

  if (error) {
    redirect(
      `/admin/members?toastType=error&toast=${encodeURIComponent(error.message)}`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminToast message={toastMessage} type={toastType} />

      <div>
        <h1 className="text-2xl font-semibold">Medlemsregister</h1>
        <p className="text-sm text-muted-foreground">
          Oversikt over medlemmer og kontingentstatus.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <form className="flex flex-1 items-center gap-2" action="/admin/members" method="get">
          <Input
            name="q"
            placeholder="Søk på navn, e-post eller telefon..."
            defaultValue={q}
          />
          <Button type="submit" variant="outline">
            Søk
          </Button>
          {q ? (
            <Button asChild type="button" variant="ghost">
              <Link href="/admin/members">Nullstill</Link>
            </Button>
          ) : null}
        </form>

        <Button asChild variant="outline">
          <Link href="/admin">Tilbake til dashboard</Link>
        </Button>
      </div>

      <MembersPanel members={members ?? []} />
    </div>
  );
}
