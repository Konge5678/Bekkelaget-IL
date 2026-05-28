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
import { deleteArticle } from "./actions";
import { AdminArticlesToast } from "./toast";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminArticlesPage({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/articles");
  }

  const { data: articles, error } = await supabase
    .from("articles")
    .select("id,title,updated_at")
    .order("updated_at", { ascending: false });

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
    redirect(
      `/admin/articles?toastType=error&toast=${encodeURIComponent(error.message)}`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminArticlesToast message={toastMessage} type={toastType} />
      <div>
        <h1 className="text-2xl font-semibold">Artikler</h1>
        <p className="text-sm text-muted-foreground">
          Opprett og rediger infosider som «Om klubben» og «Kontakt».
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild>
          <Link href="/admin/articles/new">Ny infoside</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Tilbake til dashboard</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tittel</TableHead>
            <TableHead>Sist oppdatert</TableHead>
            <TableHead className="text-right">Handling</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(articles ?? []).map((a) => (
            <TableRow key={a.id}>
              <TableCell className="max-w-[520px] truncate">{a.title}</TableCell>
              <TableCell>
                {a.updated_at ? new Date(a.updated_at).toLocaleString("no-NO") : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/articles/${a.id}/edit`}>Rediger</Link>
                  </Button>
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={a.id} />
                    <Button size="sm" variant="destructive" type="submit">
                      Slett
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(articles ?? []).length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                Ingen infosider enda.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

