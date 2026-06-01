import { z } from "zod";

export const eventRegistrationSchema = z.object({
  event_id: z.string().trim().min(1, "Mangler arrangement"),
  name: z.string().trim().min(2, "Navn må være minst 2 tegn"),
  email: z
    .string()
    .trim()
    .min(1, "E-post er påkrevd")
    .email("Ugyldig e-post"),
  phone: z.string().trim().optional().or(z.literal("")),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
