import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: latestNews } = await supabase
    .from("news")
    .select("title")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: latestArticle } = await supabase
    .from("articles")
    .select("title")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: latestEvent } = await supabase
    .from("events")
    .select("title")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count: membersCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Bekkelaget IL - Redaktørpanelet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Velg hva du ønsker å administrere i oversikten under
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nyheter</CardTitle>
            <CardDescription>
              Siste: {latestNews?.title ? latestNews.title : "(ingen nyheter enda)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/news">
                Administrer nyheter <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artikler</CardTitle>
            <CardDescription>
              Siste:{" "}
              {latestArticle?.title ? latestArticle.title : "(ingen infosider enda)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/articles">
                Administrer artikler <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Arrangementer</CardTitle>
            <CardDescription>
              Siste:{" "}
              {latestEvent?.title ? latestEvent.title : "(ingen arrangementer enda)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/events">
                Administrer arrangementer <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medlemsregister</CardTitle>
            <CardDescription>
              {typeof membersCount === "number"
                ? `Antall medlemmer: ${membersCount}`
                : "Oversikt over medlemmer og kontingentstatus."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/members">
                Gå til medlemsregister <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

