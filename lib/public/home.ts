import { getArticlesList } from "@/lib/public/articles";
import { getEventsList } from "@/lib/public/events";
import { getNewsList } from "@/lib/public/news";

const HOME_LIMIT = 3;

export async function getHomePageData() {
  const [newsResult, articlesResult, eventsResult] = await Promise.all([
    getNewsList(undefined, undefined, HOME_LIMIT),
    getArticlesList(undefined, HOME_LIMIT),
    getEventsList(undefined, undefined, HOME_LIMIT),
  ]);

  return {
    news: newsResult.news,
    articles: articlesResult.articles,
    events: eventsResult.events,
    errors: [newsResult.error, articlesResult.error, eventsResult.error].filter(
      Boolean,
    ),
  };
}
