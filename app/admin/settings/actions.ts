"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateUserRole(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId) {
    redirect("/admin/settings?toastType=error&toast=Mangler%20brukerId");
  }

  if (role !== "admin" && role !== "editor") {
    redirect("/admin/settings?toastType=error&toast=Ugyldig%20rolle");
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/settings");
  }

  // Prevent self-demotion 
  if (user.id === userId && role !== "admin") {
    redirect(
      "/admin/settings?toastType=error&toast=Du%20kan%20ikke%20fjerne%20admin-rollen%20fra%20deg%20selv",
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    redirect(
      `/admin/settings?toastType=error&toast=${encodeURIComponent(error.message)}`,
    );
  }

  redirect("/admin/settings?toastType=success&toast=Rolle%20oppdatert");
}

