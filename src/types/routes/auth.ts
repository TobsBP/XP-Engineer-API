import { z } from 'zod';
import { LoginSchema, RegisterSchema } from '@/types/schemas/auth.js';
import { UserResponseSchema } from '@/types/schemas/user.js';

export const registerSchema = {
	tags: ['Auth'],
	description: 'Registra um novo usuário.',
	body: RegisterSchema,
	response: {
		201: z.object({
			user: UserResponseSchema,
			token: z.string(),
		}),
		409: z.object({
			message: z.string(),
		}),
	},
};

export const loginSchema = {
	tags: ['Auth'],
	description: 'Realiza o login do usuário.',
	body: LoginSchema,
	response: {
		200: z.object({
			user: UserResponseSchema,
			token: z.string(),
		}),
		401: z.object({
			message: z.string(),
		}),
	},
};

export const getMeSchema = {
	tags: ['Auth'],
	description: 'Retorna os dados do usuário logado.',
	response: {
		200: UserResponseSchema,
		401: z.object({
			message: z.string(),
		}),
	},
};

export type RegisterRequest = {
	Body: z.infer<typeof registerSchema.body>;
};

export type LoginRequest = {
	Body: z.infer<typeof loginSchema.body>;
};

export type GetMeRequest = {};
