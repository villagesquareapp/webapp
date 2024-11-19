import { z } from "zod";

export const loginSchema = z.object({
    email_or_username: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    login_type: z.string().default("password")
});

export type LoginFormValues = z.infer<typeof loginSchema>; 