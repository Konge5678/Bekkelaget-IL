import { Button } from "@/components/ui/button";
import { logout } from "@/app/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen">
      <header className="border-b bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="font-semibold">
            Redaktørpanel
          </Link>

          <nav className="flex items-center gap-2">
            {isAdmin ? (
              <Button asChild variant="ghost">
                <Link href="/admin/settings">Admin</Link>
              </Button>
            ) : null}

            <Button asChild variant="ghost">
              <Link href="/">Forside</Link>
            </Button>

            <form action={logout}>
              <Button type="submit" variant="ghost">
                Logg ut
              </Button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

