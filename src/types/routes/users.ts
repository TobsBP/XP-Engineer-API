import { z } from 'zod';
import { UserResponseSchema } from '@/types/schemas/user.js';

export const getUserSchema = {
	tags: ['Users'],
	description: 'Retorna o perfil de um usuário pelo ID.',
	params: z.object({
		id: z.coerce.number().int().positive('ID do usuário é obrigatório'),
	}),
	response: {
		200: UserResponseSchema,
	},
};

export const createUserSchema = {
	tags: ['Users'],
	description: 'Cria um novo usuário.',
	body: z.object({
		name: z.string().min(1, 'Nome é obrigatório').max(100),
		avatar_url: z.url().optional(),
		specialization: z.string().max(100).optional(),
	}),
	response: {
		201: UserResponseSchema,
	},
};

export const patchUserSchema = {
	tags: ['Users'],
	description: 'Atualiza dados de um usuário.',
	params: z.object({
		id: z.coerce.number().int().positive('ID do usuário é obrigatório'),
	}),
	body: z.object({
		name: z.string().min(1).max(100).optional(),
		avatar_url: z.url().nullable().optional(),
		xp_total: z.number().int().min(0).optional(),
		streak_days: z.number().int().min(0).optional(),
		rank: z.string().max(100).optional(),
		level: z.number().int().positive().optional(),
		specialization: z.string().max(100).nullable().optional(),
	}),
	response: {
		200: UserResponseSchema,
	},
};

export const deleteUserSchema = {
	tags: ['Users'],
	description: 'Remove um usuário.',
	params: z.object({
		id: z.coerce.number().int().positive('ID do usuário é obrigatório'),
	}),
	response: {
		204: z.null(),
	},
};

export type GetUserRequest = {
	Params: z.infer<typeof getUserSchema.params>;
};

export type CreateUserRequest = {
	Body: z.infer<typeof createUserSchema.body>;
};

export type PatchUserRequest = {
	Params: z.infer<typeof patchUserSchema.params>;
	Body: z.infer<typeof patchUserSchema.body>;
};

export type DeleteUserRequest = {
	Params: z.infer<typeof deleteUserSchema.params>;
};
