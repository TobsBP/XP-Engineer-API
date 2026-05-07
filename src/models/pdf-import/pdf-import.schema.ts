import { z } from 'zod';

export const ImportedModuleSchema = z.object({
	id: z.string(),
	title: z.string(),
	subtitle: z.string(),
	subject: z.string(),
	order_index: z.number().int(),
	locked_by_default: z.boolean(),
	min_xp: z.number().int(),
});

export const ImportedConceptItemSchema = z.object({
	id: z.string().uuid(),
	lesson_id: z.number().int(),
	title: z.string(),
	description: z.string(),
	latex: z.string().nullable(),
	order_index: z.number().int(),
});

export const ImportedConceptExampleSchema = z.object({
	id: z.string().uuid(),
	lesson_id: z.number().int(),
	label: z.string(),
	latex: z.string(),
	order_index: z.number().int(),
});

export const ImportedApplicationItemSchema = z.object({
	id: z.string().uuid(),
	lesson_id: z.number().int(),
	title: z.string(),
	description: z.string(),
	latex: z.string().nullable(),
	order_index: z.number().int(),
});

export const ImportedLessonSchema = z.object({
	id: z.number().int(),
	module_id: z.string(),
	page_number: z.number().int(),
	title: z.string(),
	intro: z.string(),
	hero_caption: z.string().nullable(),
	concepts_title: z.string(),
	applications_title: z.string(),
	footer_cta: z.string(),
	concept_items: z.array(ImportedConceptItemSchema),
	concept_examples: z.array(ImportedConceptExampleSchema),
	application_items: z.array(ImportedApplicationItemSchema),
});

export const ImportedQuizOptionSchema = z.object({
	id: z.number().int(),
	question_id: z.number().int(),
	text: z.string(),
	is_correct: z.boolean(),
});

export const ImportedQuizQuestionSchema = z.object({
	id: z.number().int(),
	module_id: z.string(),
	type: z.enum(['multiple_choice', 'true_false']),
	text: z.string(),
	options: z.array(ImportedQuizOptionSchema),
});

export const PdfImportResultSchema = z.object({
	module: ImportedModuleSchema,
	lessons: z.array(ImportedLessonSchema),
	quiz_questions: z.array(ImportedQuizQuestionSchema),
});

export type ImportedModule = z.infer<typeof ImportedModuleSchema>;
export type ImportedLesson = z.infer<typeof ImportedLessonSchema>;
export type ImportedQuizQuestion = z.infer<typeof ImportedQuizQuestionSchema>;
export type PdfImportResult = z.infer<typeof PdfImportResultSchema>;
