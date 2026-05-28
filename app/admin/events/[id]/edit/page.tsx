import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TimeSelect } from "@/components/admin/time-select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatOsloDateTime, isoToOsloDateAndTime } from "@/lib/date";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { updateEvent } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEventsEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id,title,description,date,location,category")
    .eq("id", id)
    .maybeSingle();

  if (eventError) {
    redirect(
      `/admin/events?toastType=error&toast=${encodeURIComponent(eventError.message)}`,
    );
  }

  if (!event) {
    redirect("/admin/events?toastType=error&toast=Fant%20ikke%20arrangementet");
  }

  const { data: registrations, error: regError } = await supabase
    .from("event_registrations")
    .select("id,name,email,phone,created_at")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  if (regError) {
    redirect(
      `/admin/events?toastType=error&toast=${encodeURIComponent(regError.message)}`,
    );
  }

  const eventDate = isoToOsloDateAndTime(event.date ?? null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rediger arrangement</h1>
          <p className="text-sm text-muted-foreground">
            Oppdater arrangementet og se påmeldte under.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/events">Tilbake</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detaljer</CardTitle>
          <CardDescription>Endre feltene under og lagre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateEvent} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={event.id} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Tittel</span>
                <Input
                  name="title"
                  placeholder="Tittel"
                  defaultValue={event.title ?? ""}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Kategori</span>
                <Input
                  name="category"
                  placeholder="F.eks. Fotball, Dugnad"
                  defaultValue={event.category ?? ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Dato</span>
                <Input
                  name="date"
                  type="date"
                  required
                  defaultValue={eventDate.date}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Klokkeslett</span>
                <TimeSelect
                  name="time"
                  defaultValue={eventDate.time || "18:00"}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Sted</span>
                <Input
                  name="location"
                  placeholder="Sted (valgfritt)"
                  defaultValue={event.location ?? ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Beskrivelse</span>
              <textarea
                name="description"
                className="min-h-[140px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm"
                placeholder="Beskrivelse (valgfritt)"
                defaultValue={event.description ?? ""}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Lagre</Button>
              <Button asChild variant="outline">
                <Link href="/admin/events">Avbryt</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Påmeldte</CardTitle>
          <CardDescription>Oversikt over hvem som har meldt seg på.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Påmeldt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(registrations ?? []).map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[260px] truncate">{r.name}</TableCell>
                  <TableCell className="max-w-[280px] truncate">{r.email}</TableCell>
                  <TableCell>{r.phone ?? "-"}</TableCell>
                  <TableCell>
                    {formatOsloDateTime(r.created_at)}
                  </TableCell>
                </TableRow>
              ))}
              {(registrations ?? []).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Ingen påmeldte enda.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

