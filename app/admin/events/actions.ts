"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fromZonedTime } from "date-fns-tz";
import { redirect } from "next/navigation";
import { eventSchema } from "./schema";

function toastRedirect(type: "success" | "error", message: string) {
  redirect(
    `/admin/events?toastType=${encodeURIComponent(type)}&toast=${encodeURIComponent(
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

function toIsoFromOsloDateAndTime(date: string, time: string) {
  const combined = `${date}T${time}`;
  const utc = fromZonedTime(combined, "Europe/Oslo");
  if (Number.isNaN(utc.getTime())) return null;
  return utc.toISOString();
}

export async function createEvent(formData: FormData) {
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    category: formData.get("category"),
  });

  const values = getValuesOrRedirect(parsed);
  const time = String(formData.get("time") ?? "18:00");
  const isoDate = toIsoFromOsloDateAndTime(values.date, time);
  if (!isoDate) {
    toastRedirect("error", "Ugyldig dato");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/events");
  }

  const { error } = await supabase.from("events").insert({
    title: values.title,
    description: values.description || null,
    date: isoDate,
    location: values.location || null,
    category: values.category || null,
  });

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Arrangement opprettet");
}

export async function updateEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) toastRedirect("error", "Mangler id");

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    category: formData.get("category"),
  });

  const values = getValuesOrRedirect(parsed);
  const time = String(formData.get("time") ?? "18:00");
  const isoDate = toIsoFromOsloDateAndTime(values.date, time);
  if (!isoDate) {
    toastRedirect("error", "Ugyldig dato");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("events")
    .update({
      title: values.title,
      description: values.description || null,
      date: isoDate,
      location: values.location || null,
      category: values.category || null,
    })
    .eq("id", id);

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Arrangement oppdatert");
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) toastRedirect("error", "Mangler id");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    toastRedirect("error", error.message);
  }

  toastRedirect("success", "Arrangement slettet");
}

