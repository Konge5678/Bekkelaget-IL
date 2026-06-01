import { ListFilters } from "@/components/public/list-filters";
import { HomeNewsFeed } from "@/components/public/home-feed";
import { getNewsCategories, getNewsList } from "@/lib/public/news";
import { searchParam } from "@/lib/public/search-params";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NyheterPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const q = searchParam(sp.q);
  const kategori = searchParam(sp.kategori);

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
        <ListFilters
          basePath="/nyheter"
          searchPlaceholder="Søk i nyheter..."
          searchLabel="Søk i nyheter"
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
