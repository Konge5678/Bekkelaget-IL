import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { updateArticle } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminArticlesEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id,title,content,contact_person,contact_email")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    redirect(
      `/admin/articles?toastType=error&toast=${encodeURIComponent(error.message)}`,
    );
  }

  if (!data) {
    redirect("/admin/articles?toastType=error&toast=Fant%20ikke%20infosiden");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rediger infoside</h1>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/articles">Tilbake</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Innhold</CardTitle>
          <CardDescription>Endre feltene under og lagre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateArticle} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={data.id} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Tittel</span>
                <Input
                  name="title"
                  placeholder="Tittel"
                  defaultValue={data.title ?? ""}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Kontaktperson</span>
                <Input
                  name="contact_person"
                  placeholder="Navn (valgfritt)"
                  defaultValue={data.contact_person ?? ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Kontakt e-post</span>
              <Input
                name="contact_email"
                placeholder="E-post (valgfritt)"
                type="email"
                defaultValue={data.contact_email ?? ""}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Innhold</span>
              <textarea
                name="content"
                required
                className="min-h-[240px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm"
                placeholder="Skriv innhold her..."
                defaultValue={data.content ?? ""}
              />
            </div>

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

