import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().trim().min(3, "Tittel må være minst 3 tegn"),
  excerpt: z.string().trim().optional().or(z.literal("")),
  content: z.string().trim().min(10, "Innhold må være minst 10 tegn"),
  category: z.string().trim().optional().or(z.literal("")),
});

export type NewsInput = z.infer<typeof newsSchema>;

