import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Tittel">
                <Input name="title" placeholder="Tittel" required />
              </FormField>
              <FormField label="Kategori">
                <Input name="category" placeholder="F.eks. Fotball, Dugnad" />
              </FormField>
            </div>

            <FormField label="Ingress">
              <Textarea
                name="excerpt"
                className="min-h-[90px]"
                placeholder="Kort ingress (valgfritt)"
              />
            </FormField>

            <FormField label="Innhold">
              <Textarea
                name="content"
                required
                className="min-h-[220px]"
                placeholder="Skriv nyheten her..."
              />
            </FormField>

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
