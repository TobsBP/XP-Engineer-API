import { z } from 'zod';
import {
	LoginSchema,
	RegisterSchema,
	UpdateMeSchema,
} from '@/models/auth/auth.schema.js';
import {
	MeResponseSchema,
	UserResponseSchema,
} from '@/models/users/user.schema.js';

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
		200: MeResponseSchema,
		401: z.object({
			message: z.string(),
		}),
	},
};

export const updateMeSchema = {
	tags: ['Auth'],
	description: 'Atualiza os dados do usuário logado (nome, email, senha).',
	body: UpdateMeSchema,
	response: {
		200: UserResponseSchema,
		400: z.object({
			message: z.string(),
		}),
		401: z.object({
			message: z.string(),
		}),
		409: z.object({
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

export type UpdateMeRequest = {
	Body: z.infer<typeof updateMeSchema.body>;
};
