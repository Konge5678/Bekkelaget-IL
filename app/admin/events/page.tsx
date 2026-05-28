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
import { formatOsloDateTime } from "@/lib/date";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteEvent } from "./actions";
import { AdminEventsToast } from "./toast";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminEventsPage({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/events");
  }

  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,category,date,location,created_at")
    .order("date", { ascending: true });

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
      `/admin/events?toastType=error&toast=${encodeURIComponent(error.message)}`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminEventsToast message={toastMessage} type={toastType} />
      <div>
        <h1 className="text-2xl font-semibold">Arrangementer</h1>
        <p className="text-sm text-muted-foreground">
          Opprett, rediger og slett arrangementer, og se påmeldte.
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild>
          <Link href="/admin/events/new">Nytt arrangement</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Tilbake til dashboard</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tittel</TableHead>
            <TableHead>Dato og klokkeslett</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Sted</TableHead>
            <TableHead className="text-right">Handling</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(events ?? []).map((e) => (
            <TableRow key={e.id}>
              <TableCell className="max-w-[420px] truncate">{e.title}</TableCell>
              <TableCell>
                {formatOsloDateTime(e.date)}
              </TableCell>
              <TableCell>{e.category ?? "-"}</TableCell>
              <TableCell className="max-w-[240px] truncate">
                {e.location ?? "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/events/${e.id}/edit`}>Rediger</Link>
                  </Button>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={e.id} />
                    <Button size="sm" variant="destructive" type="submit">
                      Slett
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(events ?? []).length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                Ingen arrangementer enda.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

