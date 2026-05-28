"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { newsSchema } from "./schema";

function toastRedirect(type: "success" | "error", message: string) {
  redirect(
    `/admin/news?toastType=${encodeURIComponent(type)}&toast=${encodeURIComponent(
      message,
    )}`,
  );
}

function getValuesOrRedirect<T>(
  parsed: { success: true; data: T } | { success: false; error: unknown },
): T {
  if (!parsed.success) {
    const msg =
      typeof parsed.error === "object" && parsed.error && "issues" in parsed.error
        ? 
          ((parsed.error as any).issues?.[0]?.message as string | undefined)
        : undefined;
    toastRedirect("error", msg ?? "Ugyldig skjema");
  }
  return (parsed as { success: true; data: T }).data;
}

export async function createNews(formData: FormData) {
  const parsed = newsSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
  });

  const values = getValuesOrRedirect(parsed);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/news");
  }

  const { error } = await supabase.from("news").insert({
    title: values.title,
    excerpt: values.excerpt || null,
    content: values.content,
    category: values.category || null,
    author_id: user.id,
  });

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Nyhet opprettet");
}

export async function updateNews(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    toastRedirect("error", "Mangler id");
  }

  const parsed = newsSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
  });

  const values = getValuesOrRedirect(parsed);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("news")
    .update({
      title: values.title,
      excerpt: values.excerpt || null,
      content: values.content,
      category: values.category || null,
    })
    .eq("id", id);

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Nyhet oppdatert");
}

export async function deleteNews(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    toastRedirect("error", "Mangler id");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Nyhet slettet");
}

