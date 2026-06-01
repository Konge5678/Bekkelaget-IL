import {
  HomeArticlesFeed,
  HomeEventsFeed,
  HomeNewsFeed,
} from "@/components/public/home-feed";
import { HomeHero } from "@/components/public/home-hero";
import { HomeSection } from "@/components/public/home-section";
import { getHomePageData } from "@/lib/public/home";

export default async function HomePage() {
  const { news, articles, events, errors } = await getHomePageData();

  return (
    <>
      <HomeHero />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {errors.length > 0 ? (
          <p
            className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            Kunne ikke laste alt innhold akkurat nå. Prøv å laste siden på nytt.
          </p>
        ) : null}

        <HomeSection
          title="Siste nyheter"
          href="/nyheter"
          linkLabel="Se alle nyheter"
        >
          <HomeNewsFeed items={news} />
        </HomeSection>

        <HomeSection
          title="Artikler"
          href="/artikler"
          linkLabel="Se alle artikler"
        >
          <HomeArticlesFeed items={articles} />
        </HomeSection>

        <HomeSection
          title="Kommende arrangementer"
          href="/arrangementer"
          linkLabel="Se alle arrangementer"
        >
          <HomeEventsFeed items={events} />
        </HomeSection>
      </div>
    </>
  );
}
