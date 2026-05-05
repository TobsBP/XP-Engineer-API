import { z } from 'zod';
import {
	QuizQuestionResponseSchema,
	QuizResultSchema,
} from '@/models/quizzes/quiz.schema.js';

export const getQuizSchema = {
	tags: ['Quiz'],
	description: 'Retorna as perguntas do quiz de um módulo.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	response: {
		200: z.array(QuizQuestionResponseSchema),
	},
};

export const submitQuizSchema = {
	tags: ['Quiz'],
	description: 'Envia as respostas do quiz e retorna o resultado.',
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
		200: QuizResultSchema,
	},
};

export type GetQuizRequest = {
	Params: z.infer<typeof getQuizSchema.params>;
};

export type SubmitQuizRequest = {
	Params: z.infer<typeof submitQuizSchema.params>;
	Body: z.infer<typeof submitQuizSchema.body>;
};
