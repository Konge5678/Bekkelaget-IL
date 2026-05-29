"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { memberSchema } from "./schema";

function toastRedirect(type: "success" | "error", message: string) {
  redirect(
    `/admin/members?toastType=${encodeURIComponent(type)}&toast=${encodeURIComponent(
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

function toNullableDate(value: string | null | undefined) {
  const v = (value ?? "").trim();
  if (!v) return null;
  return v;
}

export async function createMember(formData: FormData) {
  const parsed = memberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    due_date: formData.get("due_date"),
    has_paid_contingent: formData.get("has_paid_contingent"),
  });

  const values = getValuesOrRedirect(parsed);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/members");
  }

  const paid =
    String(values.has_paid_contingent ?? "").trim() === "true" ? true : false;

  const { error } = await supabase.from("members").insert({
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    due_date: toNullableDate(values.due_date) ?? null,
    has_paid_contingent: paid,
  });

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Medlem opprettet");
}

export async function updateMember(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) toastRedirect("error", "Mangler id");

  const parsed = memberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    due_date: formData.get("due_date"),
    has_paid_contingent: formData.get("has_paid_contingent"),
  });

  const values = getValuesOrRedirect(parsed);
  const paid =
    String(values.has_paid_contingent ?? "").trim() === "true" ? true : false;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("members")
    .update({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      due_date: toNullableDate(values.due_date) ?? null,
      has_paid_contingent: paid,
    })
    .eq("id", id);

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Medlem oppdatert");
}

export async function deleteMember(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) toastRedirect("error", "Mangler id");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Medlem slettet");
}

