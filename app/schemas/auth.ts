import { z } from "zod";

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>; 