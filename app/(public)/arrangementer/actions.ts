"use server";

import { createSupabasePublicClient } from "@/lib/supabase/public";
import { redirect } from "next/navigation";
import { eventRegistrationSchema } from "./schema";

function redirectWithMessage(
  eventId: string,
  type: "success" | "error",
  message: string,
) {
  const key = type === "success" ? "påmeldt" : "feil";
  redirect(
    `/arrangementer/${eventId}?${key}=${encodeURIComponent(message)}`,
  );
}

function registrationErrorMessage(error: { message: string; code?: string }) {
  if (
    error.code === "23505" ||
    error.message.includes("event_registrations_unique")
  ) {
    return "Du er allerede påmeldt dette arrangementet med denne e-postadressen.";
  }

  return "Kunne ikke fullføre påmeldingen. Prøv igjen.";
}

export async function registerForEvent(formData: FormData) {
  const parsed = eventRegistrationSchema.safeParse({
    event_id: formData.get("event_id"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    const eventId = String(formData.get("event_id") ?? "");
    const msg = parsed.error.issues[0]?.message ?? "Ugyldig skjema";
    if (!eventId) redirect("/arrangementer");
    redirectWithMessage(eventId, "error", msg);
    return;
  }

  const { event_id, name, email, phone } = parsed.data;
  const supabase = createSupabasePublicClient();

  const { data: event } = await supabase
    .from("events")
    .select("id,date")
    .eq("id", event_id)
    .maybeSingle();

  if (!event) {
    redirectWithMessage(event_id, "error", "Fant ikke arrangementet");
    return;
  }

  if (new Date(event.date) < new Date()) {
    redirectWithMessage(
      event_id,
      "error",
      "Påmelding er stengt for dette arrangementet",
    );
    return;
  }

  const { error } = await supabase.from("event_registrations").insert({
    event_id,
    name,
    email,
    phone: phone || null,
  });

  if (error) {
    redirectWithMessage(event_id, "error", registrationErrorMessage(error));
    return;
  }

  redirectWithMessage(event_id, "success", "ok");
}
