import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().trim().min(3, "Tittel må være minst 3 tegn"),
  content: z.string().trim().min(10, "Innhold må være minst 10 tegn"),
  contact_person: z.string().trim().optional().or(z.literal("")),
  contact_email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v.includes("@"), "Kontakt e-post må være en gyldig e-post"),
});

export type ArticleInput = z.infer<typeof articleSchema>;

