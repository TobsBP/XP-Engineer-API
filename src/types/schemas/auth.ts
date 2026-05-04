import { z } from 'zod';

export const RegisterSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.email().max(255),
	password: z.string().min(6),
	avatar_url: z.url().optional().or(z.literal('')),
	specialization: z.string().max(100).optional().or(z.literal('')),
});

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

export type RegisterData = z.infer<typeof RegisterSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
