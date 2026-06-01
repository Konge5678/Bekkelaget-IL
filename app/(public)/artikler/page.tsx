import { ArticleSearch } from "@/components/public/article-search";
import { HomeArticlesFeed } from "@/components/public/home-feed";
import { getArticlesList } from "@/lib/public/articles";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function ArtiklerPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const q = param(sp.q);

  const { articles, error } = await getArticlesList(q);

  const emptyMessage = q
    ? "Ingen artikler matcher søket ditt."
    : "Ingen artikler publisert ennå.";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Artikler</h1>
        <p className="mt-2 text-muted-foreground">
          Artikler og informasjon fra Bekkelaget IL.
        </p>
      </div>

      <div className="mb-8">
        <ArticleSearch defaultQ={q} />
      </div>

      {error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          Kunne ikke laste artikler. Prøv å laste siden på nytt.
        </p>
      ) : articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <HomeArticlesFeed items={articles} />
      )}
    </div>
  );
}
