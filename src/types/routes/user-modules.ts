import { z } from 'zod';
import { ModuleStatusSchema } from '../schemas/module.js';

export const createUserModuleSchema = {
	tags: ['Modules'],
	description: 'Inicializa o progresso de um módulo para um usuário.',
	params: z.object({
		userId: z.coerce.number().int().positive('ID do usuário é obrigatório'),
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	response: {
		201: z.null(),
	},
};

export const updateUserModuleSchema = {
	tags: ['Modules'],
	description: 'Atualiza o progresso e status de um módulo para um usuário.',
	params: z.object({
		userId: z.coerce.number().int().positive('ID do usuário é obrigatório'),
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	body: z.object({
		progress: z.number().int().min(0).max(100).optional(),
		status: ModuleStatusSchema.optional(),
		current_page: z.number().int().positive().optional(),
	}),
	response: {
		204: z.null(),
	},
};

export type CreateUserModuleRequest = {
	Params: z.infer<typeof createUserModuleSchema.params>;
};

export type UpdateUserModuleRequest = {
	Params: z.infer<typeof updateUserModuleSchema.params>;
	Body: z.infer<typeof updateUserModuleSchema.body>;
};
