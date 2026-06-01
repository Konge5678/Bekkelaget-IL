import { createSupabasePublicClient } from "@/lib/supabase/public";

export type ArticleListItem = {
  id: string;
  title: string;
  content: string | null;
};

export async function getArticlesList(q?: string) {
  const supabase = createSupabasePublicClient();

  let query = supabase
    .from("articles")
    .select("id,title,content")
    .order("updated_at", { ascending: false });

  const search = q?.trim().replace(/[%_,]/g, "");
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error } = await query;
  return { articles: (data ?? []) as ArticleListItem[], error };
}

export async function getArticleById(id: string) {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,content,contact_person,contact_email")
    .eq("id", id)
    .maybeSingle();

  return { article: data, error };
}
