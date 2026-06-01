import { ListFilters } from "@/components/public/list-filters";
import { HomeEventsFeed } from "@/components/public/home-feed";
import { getEventCategories, getEventsList } from "@/lib/public/events";
import { searchParam } from "@/lib/public/search-params";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ArrangementerPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const q = searchParam(sp.q);
  const kategori = searchParam(sp.kategori);

  const [categories, { events, error }] = await Promise.all([
    getEventCategories(),
    getEventsList(q, kategori || undefined),
  ]);

  const emptyMessage =
    q || kategori
      ? "Ingen arrangementer matcher søket ditt."
      : "Ingen kommende arrangementer akkurat nå.";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Arrangementer</h1>
        <p className="mt-2 text-muted-foreground">
          Kommende treninger, kamper og dugnader i Bekkelaget IL.
        </p>
      </div>

      <div className="mb-8">
        <ListFilters
          basePath="/arrangementer"
          searchPlaceholder="Søk i arrangementer..."
          searchLabel="Søk i arrangementer"
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
          Kunne ikke laste arrangementer. Prøv å laste siden på nytt.
        </p>
      ) : events.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <HomeEventsFeed items={events} />
      )}
    </div>
  );
}
