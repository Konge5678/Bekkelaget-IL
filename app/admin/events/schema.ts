import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().trim().min(3, "Tittel må være minst 3 tegn"),
  description: z.string().trim().optional().or(z.literal("")),
  date: z.string().trim().min(1, "Dato er påkrevd"),
  location: z.string().trim().optional().or(z.literal("")),
  category: z.string().trim().optional().or(z.literal("")),
});

export type EventInput = z.infer<typeof eventSchema>;

