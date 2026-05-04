import { z } from 'zod';
import { ModuleResponseSchema, ModuleSchema } from '@/types/schemas/module.js';

export const listModulesSchema = {
	tags: ['Modules'],
	description: 'Retorna todos os módulos com o progresso do usuário.',
	querystring: z.object({
		userId: z.coerce.number().int().positive('ID do usuário é obrigatório'),
	}),
	response: {
		200: z.array(ModuleResponseSchema),
	},
};

export const getModuleSchema = {
	tags: ['Modules'],
	description: 'Retorna um módulo pelo ID com o progresso do usuário.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	querystring: z.object({
		userId: z.coerce.number().int().positive('ID do usuário é obrigatório'),
	}),
	response: {
		200: ModuleResponseSchema,
	},
};

export const createModuleSchema = {
	tags: ['Modules'],
	description: 'Cria um novo módulo.',
	body: z.object({
		id: z.string().min(1).max(10, 'ID deve ter no máximo 10 caracteres'),
		title: z.string().min(1, 'Título é obrigatório').max(200),
		subtitle: z.string().min(1, 'Subtítulo é obrigatório').max(100),
		order_index: z.number().int().min(0),
		locked_by_default: z.boolean().default(false),
	}),
	response: {
		201: ModuleSchema,
	},
};

export type ListModulesRequest = {
	Querystring: z.infer<typeof listModulesSchema.querystring>;
};

export type GetModuleRequest = {
	Params: z.infer<typeof getModuleSchema.params>;
	Querystring: z.infer<typeof getModuleSchema.querystring>;
};

export type CreateModuleRequest = {
	Body: z.infer<typeof createModuleSchema.body>;
};
