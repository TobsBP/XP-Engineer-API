import { z } from 'zod';
import { ModuleResponseSchema, ModuleSchema } from '@/models/modules/module.schema.js';

export const listModulesSchema = {
	tags: ['Modules'],
	description: 'Retorna todos os módulos com o progresso do usuário logado.',
	response: {
		200: z.array(ModuleResponseSchema),
	},
};

export const getModuleSchema = {
	tags: ['Modules'],
	description: 'Retorna um módulo pelo ID com o progresso do usuário logado.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	response: {
		200: ModuleResponseSchema,
	},
};

export const createModuleSchema = {
	tags: ['Modules'],
	description: 'Cria um novo módulo. Restrito a administradores.',
	body: z.object({
		id: z.string().min(1).max(20, 'ID deve ter no máximo 20 caracteres'),
		title: z.string().min(1, 'Título é obrigatório').max(200),
		subtitle: z.string().min(1, 'Subtítulo é obrigatório').max(100),
		subject: z.string().min(1, 'Matéria é obrigatória').max(100),
		order_index: z.number().int().min(0),
		locked_by_default: z.boolean().default(false),
		min_xp: z.number().int().min(0).optional(),
	}),
	response: {
		201: ModuleSchema,
	},
};

export const updateModuleSchema = {
	tags: ['Modules'],
	description: 'Atualiza um módulo. Restrito a administradores.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	body: z
		.object({
			title: z.string().min(1).max(200).optional(),
			subtitle: z.string().min(1).max(100).optional(),
			subject: z.string().min(1).max(100).optional(),
			order_index: z.number().int().min(0).optional(),
			locked_by_default: z.boolean().optional(),
			min_xp: z.number().int().min(0).optional(),
		})
		.refine((d) => Object.keys(d).length > 0, {
			message: 'Envie ao menos um campo para atualizar',
		}),
	response: {
		200: ModuleSchema,
		404: z.object({ message: z.string() }),
	},
};

export const deleteModuleSchema = {
	tags: ['Modules'],
	description: 'Remove um módulo e seu conteúdo. Restrito a administradores.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	response: {
		204: z.null(),
		404: z.object({ message: z.string() }),
	},
};

export type GetModuleRequest = {
	Params: z.infer<typeof getModuleSchema.params>;
};

export type CreateModuleRequest = {
	Body: z.infer<typeof createModuleSchema.body>;
};

export type UpdateModuleRequest = {
	Params: z.infer<typeof updateModuleSchema.params>;
	Body: z.infer<typeof updateModuleSchema.body>;
};

export type DeleteModuleRequest = {
	Params: z.infer<typeof deleteModuleSchema.params>;
};
