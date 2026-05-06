import { z } from 'zod';
import {
	LessonCompleteResponseSchema,
	ModuleCompleteResponseSchema,
	UserProgressSchema,
	UserProgressSummarySchema,
} from '@/models/progress/progress.schema.js';

export const getProgressSchema = {
	tags: ['Progress'],
	description: 'Retorna o progresso geral do usuário em todos os módulos.',
	response: {
		200: UserProgressSummarySchema,
	},
};

export const getModuleProgressSchema = {
	tags: ['Progress'],
	description: 'Retorna o progresso do usuário em um módulo específico.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	response: {
		200: UserProgressSchema,
	},
};

export const completeLessonSchema = {
	tags: ['Progress'],
	description: 'Marca uma lição como concluída e atualiza o progresso do módulo.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
		page: z.coerce.number().int().positive('Número da página é obrigatório'),
	}),
	response: {
		200: LessonCompleteResponseSchema,
	},
};

export const completeModuleSchema = {
	tags: ['Progress'],
	description: 'Finaliza um módulo após aprovação no quiz (>= 80%) e concede XP.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	body: z.object({
		answers: z
			.array(
				z.object({
					question_id: z.number().int().positive(),
					option_id: z.number().int().positive(),
				}),
			)
			.min(1, 'É necessário enviar pelo menos uma resposta'),
	}),
	response: {
		200: ModuleCompleteResponseSchema,
		400: z.object({
			message: z.string(),
			score: z.number().min(0).max(100),
		}),
	},
};

export type GetModuleProgressRequest = {
	Params: z.infer<typeof getModuleProgressSchema.params>;
};

export type CompleteLessonRequest = {
	Params: z.infer<typeof completeLessonSchema.params>;
};

export type CompleteModuleRequest = {
	Params: z.infer<typeof completeModuleSchema.params>;
	Body: z.infer<typeof completeModuleSchema.body>;
};
