import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().trim().min(2, "Navn må være minst 2 tegn"),
  email: z
    .string()
    .trim()
    .min(1, "E-post er påkrevd")
    .email("Ugyldig e-post"),
  phone: z.string().trim().optional().or(z.literal("")),
  due_date: z.string().trim().optional().or(z.literal("")),
  has_paid_contingent: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v === "true" || v === "false", "Ugyldig status"),
});

export type MemberInput = z.infer<typeof memberSchema>;

