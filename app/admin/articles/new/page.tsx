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
import { createArticle } from "../actions";

export default function AdminArticlesNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ny infoside</h1>
          <p className="text-sm text-muted-foreground">
            Opprett en ny infoside for klubben.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/articles">Tilbake</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Innhold</CardTitle>
          <CardDescription>Fyll inn feltene under og lagre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createArticle} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Tittel">
                <Input name="title" placeholder="Tittel" required />
              </FormField>
              <FormField label="Kontaktperson">
                <Input name="contact_person" placeholder="Navn (valgfritt)" />
              </FormField>
            </div>

            <FormField label="Kontakt e-post">
              <Input
                name="contact_email"
                placeholder="E-post (valgfritt)"
                type="email"
              />
            </FormField>

            <FormField label="Innhold">
              <Textarea
                name="content"
                required
                className="min-h-[240px]"
                placeholder="Skriv innhold her..."
              />
            </FormField>

            <div className="flex gap-2">
              <Button type="submit">Lagre</Button>
              <Button asChild variant="outline">
                <Link href="/admin/articles">Avbryt</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
