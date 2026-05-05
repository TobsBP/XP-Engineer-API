import { z } from 'zod';

export const listExerciseListsSchema = {
	tags: ['Exercise Lists'],
	description: 'Retorna as listas de exercícios. Filtro opcional por matéria.',
	querystring: z.object({
		subject: z.string().optional(),
	}),
	response: {
		200: z.array(
			z.object({
				id: z.string(),
				title: z.string(),
				subject: z.string(),
				description: z.string().nullable(),
				questions_count: z.number().int(),
				difficulty: z.enum(['easy', 'medium', 'hard']),
				pdf_url: z.url(),
			}),
		),
	},
};

export type ListExerciseListsRequest = {
	Querystring: z.infer<typeof listExerciseListsSchema.querystring>;
};
