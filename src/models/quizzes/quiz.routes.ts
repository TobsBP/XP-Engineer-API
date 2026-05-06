import { z } from 'zod';
import { QuizAdminQuestionSchema, QuizQuestionResponseSchema, QuizQuestionTypeSchema, QuizResultSchema } from '@/models/quizzes/quiz.schema.js';

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

const optionsInput = z
	.array(
		z.object({
			text: z.string().min(1, 'Texto da opção é obrigatório'),
			is_correct: z.boolean(),
		}),
	)
	.min(2, 'Envie ao menos duas opções')
	.refine((opts) => opts.filter((o) => o.is_correct).length === 1, {
		message: 'Exatamente uma opção deve ter is_correct=true',
	});

export const createQuizQuestionSchema = {
	tags: ['Quiz'],
	description: 'Cria uma pergunta de quiz. Restrito a administradores.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	body: z.object({
		type: QuizQuestionTypeSchema,
		text: z.string().min(1, 'Texto da pergunta é obrigatório'),
		options: optionsInput,
	}),
	response: {
		201: QuizAdminQuestionSchema,
	},
};

export const updateQuizQuestionSchema = {
	tags: ['Quiz'],
	description: 'Atualiza uma pergunta de quiz. Se "options" for enviado, substitui todas. Restrito a administradores.',
	params: z.object({
		questionId: z.coerce.number().int().positive(),
	}),
	body: z
		.object({
			type: QuizQuestionTypeSchema.optional(),
			text: z.string().min(1).optional(),
			options: optionsInput.optional(),
		})
		.refine((d) => Object.keys(d).length > 0, {
			message: 'Envie ao menos um campo para atualizar',
		}),
	response: {
		200: QuizAdminQuestionSchema,
		404: z.object({ message: z.string() }),
	},
};

export const deleteQuizQuestionSchema = {
	tags: ['Quiz'],
	description: 'Remove uma pergunta de quiz. Restrito a administradores.',
	params: z.object({
		questionId: z.coerce.number().int().positive(),
	}),
	response: {
		204: z.null(),
		404: z.object({ message: z.string() }),
	},
};

export type GetQuizRequest = {
	Params: z.infer<typeof getQuizSchema.params>;
};

export type SubmitQuizRequest = {
	Params: z.infer<typeof submitQuizSchema.params>;
	Body: z.infer<typeof submitQuizSchema.body>;
};

export type CreateQuizQuestionRequest = {
	Params: z.infer<typeof createQuizQuestionSchema.params>;
	Body: z.infer<typeof createQuizQuestionSchema.body>;
};

export type UpdateQuizQuestionRequest = {
	Params: z.infer<typeof updateQuizQuestionSchema.params>;
	Body: z.infer<typeof updateQuizQuestionSchema.body>;
};

export type DeleteQuizQuestionRequest = {
	Params: z.infer<typeof deleteQuizQuestionSchema.params>;
};
