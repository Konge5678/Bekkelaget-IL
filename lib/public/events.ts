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

  const categories = [
    ...new Set(
      (data ?? [])
        .map((row) => row.category?.trim())
        .filter((c): c is string => Boolean(c)),
    ),
  ].sort((a, b) => a.localeCompare(b, "nb"));

  return categories;
}

export async function getEventsList(q?: string, kategori?: string) {
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

  const search = q?.trim().replace(/[%_,]/g, "");
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`,
    );
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
