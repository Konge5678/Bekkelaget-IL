import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { updateUserRole } from "./actions";
import { AdminSettingsToast } from "./toast";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSettingsPage({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/settings");
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id,email,role,created_at")
    .order("created_at", { ascending: false });

  if (usersError) {
    redirect(`/admin/settings?error=${encodeURIComponent(usersError.message)}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminSettingsToast message={toastMessage} type={toastType} />
      <div>
        <h1 className="text-2xl font-semibold">Admininnstillinger</h1>
        <p className="text-sm text-muted-foreground">
          Administrer roller og brukere.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-post</TableHead>
            <TableHead>Rolle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(users ?? []).map((u) => (
            <TableRow key={u.id}>
              <TableCell className="max-w-[360px] truncate">
                {u.email ?? "(ingen e-post)"}
              </TableCell>
              <TableCell>
                <form action={updateUserRole} className="flex items-center gap-2">
                  <input type="hidden" name="userId" value={u.id} />
                  <select
                    name="role"
                    defaultValue={u.role}
                    className="h-9 rounded-md border-2 border-input bg-background px-3 text-sm"
                  >
                    <option value="editor">editor</option>
                    <option value="admin">admin</option>
                  </select>

                  <Button type="submit" size="sm" variant="outline">
                    Lagre
                  </Button>
                </form>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {u.id === user.id ? "Deg" : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex gap-2">
        <Button asChild variant="default">
          <Link href="/admin">Tilbake til dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

