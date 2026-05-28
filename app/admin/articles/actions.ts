"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { articleSchema } from "./schema";

function toastRedirect(type: "success" | "error", message: string) {
  redirect(
    `/admin/articles?toastType=${encodeURIComponent(type)}&toast=${encodeURIComponent(
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
        ? (
            // biome-ignore lint/suspicious/noExplicitAny: parsed.error is from zod
            (parsed.error as any).issues?.[0]?.message as string | undefined
          )
        : undefined;
    toastRedirect("error", msg ?? "Ugyldig skjema");
  }
  return (parsed as { success: true; data: T }).data;
}

export async function createArticle(formData: FormData) {
  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    contact_person: formData.get("contact_person"),
    contact_email: formData.get("contact_email"),
  });

  const values = getValuesOrRedirect(parsed);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/articles");
  }

  const { error } = await supabase.from("articles").insert({
    title: values.title,
    content: values.content,
    contact_person: values.contact_person || null,
    contact_email: values.contact_email || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Infoside opprettet");
}

export async function updateArticle(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    toastRedirect("error", "Mangler id");
  }

  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    contact_person: formData.get("contact_person"),
    contact_email: formData.get("contact_email"),
  });

  const values = getValuesOrRedirect(parsed);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("articles")
    .update({
      title: values.title,
      content: values.content,
      contact_person: values.contact_person || null,
      contact_email: values.contact_email || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Infoside oppdatert");
}

export async function deleteArticle(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    toastRedirect("error", "Mangler id");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Infoside slettet");
}

