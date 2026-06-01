import { createSupabasePublicClient } from "@/lib/supabase/public";

const HOME_LIMIT = 3;

export async function getHomePageData() {
  const supabase = createSupabasePublicClient();
  const now = new Date().toISOString();

  const [newsResult, articlesResult, eventsResult] = await Promise.all([
    supabase
      .from("news")
      .select("id,title,excerpt,category,created_at")
      .order("created_at", { ascending: false })
      .limit(HOME_LIMIT),
    supabase
      .from("articles")
      .select("id,title")
      .order("updated_at", { ascending: false })
      .limit(HOME_LIMIT),
    supabase
      .from("events")
      .select("id,title,date,location,category")
      .gte("date", now)
      .order("date", { ascending: true })
      .limit(HOME_LIMIT),
  ]);

  return {
    news: newsResult.data ?? [],
    articles: articlesResult.data ?? [],
    events: eventsResult.data ?? [],
    errors: [newsResult.error, articlesResult.error, eventsResult.error].filter(
      Boolean,
    ),
  };
}
