import { z } from 'zod';

export const QuizQuestionTypeSchema = z.enum(['multiple_choice', 'true_false']);

export const QuizOptionSchema = z.object({
	id: z.number().int(),
	text: z.string(),
});

export const QuizQuestionSchema = z.object({
	id: z.number().int(),
	module_id: z.string(),
	type: QuizQuestionTypeSchema,
	text: z.string(),
	options: z.array(QuizOptionSchema),
});

export const QuizQuestionResponseSchema = z.object({
	id: z.number().int(),
	type: QuizQuestionTypeSchema,
	text: z.string(),
	options: z.array(QuizOptionSchema),
});

export const QuizAnswerResultSchema = z.object({
	question_id: z.number().int(),
	correct: z.boolean(),
	correct_option_id: z.number().int(),
});

export const QuizResultSchema = z.object({
	total: z.number().int(),
	correct: z.number().int(),
	score: z.number().min(0).max(100),
	results: z.array(QuizAnswerResultSchema),
});

export const QuizAdminOptionSchema = z.object({
	id: z.number().int(),
	text: z.string(),
	is_correct: z.boolean(),
});

export const QuizAdminQuestionSchema = z.object({
	id: z.number().int(),
	module_id: z.string(),
	type: QuizQuestionTypeSchema,
	text: z.string(),
	options: z.array(QuizAdminOptionSchema),
});

export type QuizQuestionType = z.infer<typeof QuizQuestionTypeSchema>;
export type QuizOption = z.infer<typeof QuizOptionSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizQuestionResponse = z.infer<typeof QuizQuestionResponseSchema>;
export type QuizAnswerResult = z.infer<typeof QuizAnswerResultSchema>;
export type QuizResult = z.infer<typeof QuizResultSchema>;
export type QuizAdminOption = z.infer<typeof QuizAdminOptionSchema>;
export type QuizAdminQuestion = z.infer<typeof QuizAdminQuestionSchema>;
