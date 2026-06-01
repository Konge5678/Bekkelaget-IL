import { uniqueCategories, sanitizeSearch } from "@/lib/public/categories";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export type EventListItem = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  category: string | null;
};

export async function getEventCategories() {
  const supabase = createSupabasePublicClient();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("events")
    .select("category")
    .gte("date", now)
    .not("category", "is", null);

  return uniqueCategories(data);
}

export async function getEventsList(q?: string, kategori?: string, limit?: number) {
  const supabase = createSupabasePublicClient();
  const now = new Date().toISOString();

  let query = supabase
    .from("events")
    .select("id,title,date,location,category")
    .gte("date", now)
    .order("date", { ascending: true });

  if (kategori) {
    query = query.eq("category", kategori);
  }

  const search = sanitizeSearch(q);
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`,
    );
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  return { events: (data ?? []) as EventListItem[], error };
}

export async function getEventById(id: string) {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,title,description,date,location,category")
    .eq("id", id)
    .maybeSingle();

  return { event: data, error };
}
