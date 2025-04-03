import { z } from "zod";

export const SessionRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters"),
  password: z
    .string()
    .trim()
    .min(4, "Password must be at least 4 characters")
    .max(100, "Password is too long")
});

export type SessionRequest = z.infer<typeof SessionRequestSchema>;

export const SessionResponseSchema = z.object({
  username: z.string(),
  token: z.string()
});

export const AuthUserSchema = z.object({
  id: z.number(),
  username: z.string()
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;

export type AuthUser = z.infer<typeof AuthUserSchema>;
