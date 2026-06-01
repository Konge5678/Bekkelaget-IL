import { HomeNewsFeed } from "@/components/public/home-feed";
import { NewsFilters } from "@/components/public/news-filters";
import { getNewsCategories, getNewsList } from "@/lib/public/news";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function NyheterPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const q = param(sp.q);
  const kategori = param(sp.kategori);

  const [categories, { news, error }] = await Promise.all([
    getNewsCategories(),
    getNewsList(q, kategori || undefined),
  ]);

  const emptyMessage =
    q || kategori
      ? "Ingen nyheter matcher søket ditt."
      : "Ingen nyheter publisert ennå.";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nyheter</h1>
        <p className="mt-2 text-muted-foreground">
          Nyheter og oppdateringer fra Bekkelaget IL.
        </p>
      </div>

      <div className="mb-8">
        <NewsFilters
          defaultQ={q}
          defaultKategori={kategori}
          categories={categories}
        />
      </div>

      {error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          Kunne ikke laste nyheter. Prøv å laste siden på nytt.
        </p>
      ) : news.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <HomeNewsFeed items={news} />
      )}
    </div>
  );
}
