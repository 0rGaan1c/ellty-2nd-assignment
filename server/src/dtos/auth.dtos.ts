import { z } from "zod";

export const SessionRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(100, "Password is too long")
});

export type SessionRequest = z.infer<typeof SessionRequestSchema>;

export const SessionResponseSchema = z.object({
  userId: z.number(),
  username: z.string(),
  token: z.string()
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;
