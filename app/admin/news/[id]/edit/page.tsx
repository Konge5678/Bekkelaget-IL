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
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { updateNews } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminNewsEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("news")
    .select("id,title,excerpt,content,category")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    redirect(`/admin/news?toastType=error&toast=${encodeURIComponent(error.message)}`);
  }

  if (!data) {
    redirect("/admin/news?toastType=error&toast=Fant%20ikke%20nyheten");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rediger nyhet</h1>
          <p className="text-sm text-muted-foreground">
            Oppdater innholdet og lagre endringer.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/news">Tilbake</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Innhold</CardTitle>
          <CardDescription>Endre feltene under og lagre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateNews} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={data.id} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Tittel">
                <Input
                  name="title"
                  placeholder="Tittel"
                  defaultValue={data.title ?? ""}
                  required
                />
              </FormField>
              <FormField label="Kategori">
                <Input
                  name="category"
                  placeholder="F.eks. Fotball, Dugnad"
                  defaultValue={data.category ?? ""}
                />
              </FormField>
            </div>

            <FormField label="Ingress">
              <Textarea
                name="excerpt"
                className="min-h-[90px]"
                placeholder="Kort ingress (valgfritt)"
                defaultValue={data.excerpt ?? ""}
              />
            </FormField>

            <FormField label="Innhold">
              <Textarea
                name="content"
                required
                className="min-h-[220px]"
                placeholder="Skriv nyheten her..."
                defaultValue={data.content ?? ""}
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
