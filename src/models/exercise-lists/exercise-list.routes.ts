import { z } from 'zod';

export const ExerciseListResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	subject: z.string(),
	description: z.string().nullable(),
	questions_count: z.number().int(),
	difficulty: z.enum(['easy', 'medium', 'hard']),
	pdf_url: z.url(),
});

export const ExerciseListBodyFieldsSchema = z.object({
	title: z.string().min(1, 'Título é obrigatório').max(200),
	subject: z.string().min(1, 'Matéria é obrigatória').max(100),
	description: z.string().optional(),
	questions_count: z.coerce.number().int().min(0),
	difficulty: z.enum(['easy', 'medium', 'hard']),
	module_id: z.string().min(1).max(10).optional(),
});

export const listExerciseListsSchema = {
	tags: ['Exercise Lists'],
	description: 'Retorna as listas de exercícios. Filtro opcional por matéria.',
	querystring: z.object({
		subject: z.string().optional(),
	}),
	response: {
		200: z.array(ExerciseListResponseSchema),
	},
};

export const createExerciseListSchema = {
	tags: ['Exercise Lists'],
	summary: 'Cria uma lista de exercícios com PDF.',
	description:
		'Envie como `multipart/form-data`: campos title, subject, description (opcional), questions_count, difficulty, module_id (opcional) e o arquivo `pdf`. Restrito a administradores.',
	consumes: ['multipart/form-data'],
	response: {
		201: ExerciseListResponseSchema,
		400: z.object({ message: z.string() }),
	},
};

export const updateExerciseListSchema = {
	tags: ['Exercise Lists'],
	description:
		'Atualiza metadados de uma lista de exercícios (sem trocar PDF). Restrito a administradores.',
	params: z.object({
		id: z.string().min(1, 'ID é obrigatório'),
	}),
	body: z
		.object({
			title: z.string().min(1).max(200).optional(),
			subject: z.string().min(1).max(100).optional(),
			description: z.string().nullable().optional(),
			questions_count: z.number().int().min(0).optional(),
			difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
			module_id: z.string().min(1).max(10).nullable().optional(),
		})
		.refine((d) => Object.keys(d).length > 0, {
			message: 'Envie ao menos um campo para atualizar',
		}),
	response: {
		200: ExerciseListResponseSchema,
		404: z.object({ message: z.string() }),
	},
};

export const deleteExerciseListSchema = {
	tags: ['Exercise Lists'],
	description:
		'Remove uma lista de exercícios e seu PDF do storage. Restrito a administradores.',
	params: z.object({
		id: z.string().min(1, 'ID é obrigatório'),
	}),
	response: {
		204: z.null(),
		404: z.object({ message: z.string() }),
	},
};

export type ListExerciseListsRequest = {
	Querystring: z.infer<typeof listExerciseListsSchema.querystring>;
};

export type CreateExerciseListRequest = Record<string, never>;

export type UpdateExerciseListRequest = {
	Params: z.infer<typeof updateExerciseListSchema.params>;
	Body: z.infer<typeof updateExerciseListSchema.body>;
};

export type DeleteExerciseListRequest = {
	Params: z.infer<typeof deleteExerciseListSchema.params>;
};
