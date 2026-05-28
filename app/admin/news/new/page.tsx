import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createNews } from "../actions";

export default function AdminNewsNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ny nyhet</h1>
          <p className="text-sm text-muted-foreground">
            Opprett en nyhet som vises på forsiden.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/news">Tilbake</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Innhold</CardTitle>
          <CardDescription>Fyll inn feltene under og lagre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createNews} className="flex flex-col gap-4">
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

            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Ingress</span>
              <textarea
                name="excerpt"
                className="min-h-[90px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm"
                placeholder="Kort ingress (valgfritt)"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Innhold</span>
              <textarea
                name="content"
                required
                className="min-h-[220px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm"
                placeholder="Skriv nyheten her..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Lagre</Button>
              <Button asChild variant="outline">
                <Link href="/admin/news">Avbryt</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

