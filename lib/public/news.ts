import { createSupabasePublicClient } from "@/lib/supabase/public";

export type NewsListItem = {
  id: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  created_at: string;
};

export async function getNewsCategories() {
  const supabase = createSupabasePublicClient();
  const { data } = await supabase
    .from("news")
    .select("category")
    .not("category", "is", null);

  const categories = [
    ...new Set(
      (data ?? [])
        .map((row) => row.category?.trim())
        .filter((c): c is string => Boolean(c)),
    ),
  ].sort((a, b) => a.localeCompare(b, "nb"));

  return categories;
}

export async function getNewsList(q?: string, kategori?: string) {
  const supabase = createSupabasePublicClient();

  let query = supabase
    .from("news")
    .select("id,title,excerpt,category,created_at")
    .order("created_at", { ascending: false });

  if (kategori) {
    query = query.eq("category", kategori);
  }

  const search = q?.trim().replace(/[%_,]/g, "");
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  const { data, error } = await query;
  return { news: (data ?? []) as NewsListItem[], error };
}

export async function getNewsById(id: string) {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("news")
    .select("id,title,excerpt,content,category,created_at")
    .eq("id", id)
    .maybeSingle();

  return { news: data, error };
}
