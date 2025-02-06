import {z} from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string(),
})

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
