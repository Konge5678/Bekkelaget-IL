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
import Link from "next/link";
import { createEvent } from "../actions";

export default function AdminEventsNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Nytt arrangement</h1>
          <p className="text-sm text-muted-foreground">
            Opprett et nytt arrangement.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/events">Tilbake</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detaljer</CardTitle>
          <CardDescription>Fyll inn feltene under og lagre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createEvent} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Tittel</span>
                <Input name="title" placeholder="Tittel" required />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Kategori</span>
                <Input name="category" placeholder="F.eks. Fotball, Dugnad" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Dato</span>
                <Input name="date" type="date" required />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Klokkeslett</span>
                <TimeSelect name="time" defaultValue="18:00" required />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Sted</span>
                <Input name="location" placeholder="Sted (valgfritt)" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Beskrivelse</span>
              <textarea
                name="description"
                className="min-h-[140px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm"
                placeholder="Beskrivelse (valgfritt)"
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
    </div>
  );
}

