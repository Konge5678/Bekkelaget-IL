import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatOsloDateTime } from "@/lib/date";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminToast } from "@/components/admin/admin-toast";
import { deleteNews } from "./actions";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminNewsPage({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/news");
  }

  const { data: news, error } = await supabase
    .from("news")
    .select("id,title,category,created_at")
    .order("created_at", { ascending: false });

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

  if (error) {
    redirect(`/admin/news?toastType=error&toast=${encodeURIComponent(error.message)}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminToast message={toastMessage} type={toastType} />
      <div>
        <h1 className="text-2xl font-semibold">Nyheter</h1>
        <p className="text-sm text-muted-foreground">
          Opprett, rediger og slett nyheter.
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild>
          <Link href="/admin/news/new">Ny nyhet</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Tilbake til dashboard</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tittel</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Opprettet</TableHead>
            <TableHead className="text-right">Handling</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(news ?? []).map((n) => (
            <TableRow key={n.id}>
              <TableCell className="max-w-[520px] truncate">{n.title}</TableCell>
              <TableCell>{n.category ?? "-"}</TableCell>
              <TableCell>
                {formatOsloDateTime(n.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/news/${n.id}/edit`}>Rediger</Link>
                  </Button>
                  <form action={deleteNews}>
                    <input type="hidden" name="id" value={n.id} />
                    <Button size="sm" variant="destructive" type="submit">
                      Slett
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(news ?? []).length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                Ingen nyheter enda.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

