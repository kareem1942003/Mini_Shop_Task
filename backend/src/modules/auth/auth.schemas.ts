import { z } from 'zod';


const emailField = z
  .string()
  .email({ message: 'Invalid email address' })
  .transform((v) => v.trim().toLowerCase());

const passwordField = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' });


export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).trim(),
  
  
});

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
