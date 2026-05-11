import { z } from 'zod';
import { ApplicationItemSchema } from '@/models/lessons/application-item.schema.js';
import { ConceptExampleSchema, ConceptItemSchema } from '@/models/lessons/concept-example.schema.js';
import { LessonContentSchema, LessonSchema } from '@/models/lessons/lesson.schema.js';

export const getLessonSchema = {
	tags: ['Lessons'],
	description: 'Retorna todas as lições de um módulo.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	response: {
		200: z.array(LessonContentSchema),
	},
};

export const getSingleLessonSchema = {
	tags: ['Lessons'],
	description: 'Retorna o conteúdo de uma página específica de um módulo.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
		page: z.coerce.number().int().positive('Número da página é obrigatório'),
	}),
	response: {
		200: LessonContentSchema,
	},
};

export const createLessonSchema = {
	tags: ['Lessons'],
	description: 'Cria uma nova página (lição) dentro de um módulo.',
	params: z.object({
		moduleId: z.string().min(1, 'ID do módulo é obrigatório'),
	}),
	body: z.object({
		title: z.string().min(1, 'Título é obrigatório').max(200),
		intro: z.string().min(1, 'Introdução é obrigatória'),
		hero_caption: z.string().max(300).optional(),
		concepts_title: z.string().max(200).default('Conceitos Chave'),
		applications_title: z.string().max(200).default('Aplicações'),
		footer_cta: z.string().max(200).default('PRÓXIMA PÁGINA'),
	}),
	response: {
		201: LessonSchema,
	},
};

export const createConceptItemSchema = {
	tags: ['Lessons'],
	description: 'Adiciona um item de conceito a uma lição.',
	params: z.object({
		lessonId: z.coerce.number().int().positive('ID da lição é obrigatório'),
	}),
	body: z.object({
		title: z.string().min(1, 'Título é obrigatório').max(200),
		description: z.string().min(1, 'Descrição é obrigatória'),
		latex: z.string().optional(),
		code: z.string().optional(),
		code_language: z.string().max(50).optional(),
	}),
	response: {
		201: ConceptItemSchema,
	},
};

export const createConceptExampleSchema = {
	tags: ['Lessons'],
	description: 'Adiciona um exemplo de conceito a uma lição.',
	params: z.object({
		lessonId: z.coerce.number().int().positive('ID da lição é obrigatório'),
	}),
	body: z.object({
		label: z.string().min(1, 'Label é obrigatória').max(200),
		latex: z.string().min(1, 'LaTeX é obrigatório'),
		code: z.string().optional(),
		code_language: z.string().max(50).optional(),
	}),
	response: {
		201: ConceptExampleSchema,
	},
};

export const createApplicationItemSchema = {
	tags: ['Lessons'],
	description: 'Adiciona um item de aplicação a uma lição.',
	params: z.object({
		lessonId: z.coerce.number().int().positive('ID da lição é obrigatório'),
	}),
	body: z.object({
		title: z.string().min(1, 'Título é obrigatório').max(200),
		description: z.string().min(1, 'Descrição é obrigatória'),
		latex: z.string().optional(),
		code: z.string().optional(),
		code_language: z.string().max(50).optional(),
	}),
	response: {
		201: ApplicationItemSchema,
	},
};

export type GetAllLessonsRequest = {
	Params: z.infer<typeof getLessonSchema.params>;
};

export type GetLessonRequest = {
	Params: z.infer<typeof getSingleLessonSchema.params>;
};

export type CreateLessonRequest = {
	Params: z.infer<typeof createLessonSchema.params>;
	Body: z.infer<typeof createLessonSchema.body>;
};

export type CreateConceptItemRequest = {
	Params: z.infer<typeof createConceptItemSchema.params>;
	Body: z.infer<typeof createConceptItemSchema.body>;
};

export type CreateConceptExampleRequest = {
	Params: z.infer<typeof createConceptExampleSchema.params>;
	Body: z.infer<typeof createConceptExampleSchema.body>;
};

export type CreateApplicationItemRequest = {
	Params: z.infer<typeof createApplicationItemSchema.params>;
	Body: z.infer<typeof createApplicationItemSchema.body>;
};

const lessonIdParam = z.object({
	lessonId: z.coerce.number().int().positive('ID da lição é obrigatório'),
});
const itemIdParam = z.object({
	itemId: z.string().uuid('ID do item deve ser um UUID válido'),
});
const requireOneField = (d: Record<string, unknown>) => Object.keys(d).length > 0;
const requireOneFieldMessage = {
	message: 'Envie ao menos um campo para atualizar',
};

export const updateLessonSchema = {
	tags: ['Lessons'],
	description: 'Atualiza uma lição. Restrito a administradores.',
	params: lessonIdParam,
	body: z
		.object({
			page_number: z.number().int().positive().optional(),
			title: z.string().min(1).max(200).optional(),
			intro: z.string().min(1).optional(),
			hero_caption: z.string().max(300).nullable().optional(),
			concepts_title: z.string().max(200).optional(),
			applications_title: z.string().max(200).optional(),
			footer_cta: z.string().max(200).optional(),
		})
		.refine(requireOneField, requireOneFieldMessage),
	response: {
		200: LessonSchema,
		404: z.object({ message: z.string() }),
	},
};

export const deleteLessonSchema = {
	tags: ['Lessons'],
	description: 'Remove uma lição. Restrito a administradores.',
	params: lessonIdParam,
	response: {
		204: z.null(),
		404: z.object({ message: z.string() }),
	},
};

export const updateConceptItemSchema = {
	tags: ['Lessons'],
	description: 'Atualiza um item de conceito. Restrito a administradores.',
	params: itemIdParam,
	body: z
		.object({
			title: z.string().min(1).max(200).optional(),
			description: z.string().min(1).optional(),
			latex: z.string().nullable().optional(),
			code: z.string().nullable().optional(),
			code_language: z.string().max(50).nullable().optional(),
			order_index: z.number().int().min(0).optional(),
		})
		.refine(requireOneField, requireOneFieldMessage),
	response: {
		200: ConceptItemSchema,
		404: z.object({ message: z.string() }),
	},
};

export const deleteConceptItemSchema = {
	tags: ['Lessons'],
	description: 'Remove um item de conceito. Restrito a administradores.',
	params: itemIdParam,
	response: {
		204: z.null(),
		404: z.object({ message: z.string() }),
	},
};

export const updateConceptExampleSchema = {
	tags: ['Lessons'],
	description: 'Atualiza um exemplo de conceito. Restrito a administradores.',
	params: itemIdParam,
	body: z
		.object({
			label: z.string().min(1).max(200).optional(),
			latex: z.string().min(1).optional(),
			code: z.string().nullable().optional(),
			code_language: z.string().max(50).nullable().optional(),
			order_index: z.number().int().min(0).optional(),
		})
		.refine(requireOneField, requireOneFieldMessage),
	response: {
		200: ConceptExampleSchema,
		404: z.object({ message: z.string() }),
	},
};

export const deleteConceptExampleSchema = {
	tags: ['Lessons'],
	description: 'Remove um exemplo de conceito. Restrito a administradores.',
	params: itemIdParam,
	response: {
		204: z.null(),
		404: z.object({ message: z.string() }),
	},
};

export const updateApplicationItemSchema = {
	tags: ['Lessons'],
	description: 'Atualiza um item de aplicação. Restrito a administradores.',
	params: itemIdParam,
	body: z
		.object({
			title: z.string().min(1).max(200).optional(),
			description: z.string().min(1).optional(),
			latex: z.string().nullable().optional(),
			code: z.string().nullable().optional(),
			code_language: z.string().max(50).nullable().optional(),
			order_index: z.number().int().min(0).optional(),
		})
		.refine(requireOneField, requireOneFieldMessage),
	response: {
		200: ApplicationItemSchema,
		404: z.object({ message: z.string() }),
	},
};

export const deleteApplicationItemSchema = {
	tags: ['Lessons'],
	description: 'Remove um item de aplicação. Restrito a administradores.',
	params: itemIdParam,
	response: {
		204: z.null(),
		404: z.object({ message: z.string() }),
	},
};

export type UpdateLessonRequest = {
	Params: z.infer<typeof updateLessonSchema.params>;
	Body: z.infer<typeof updateLessonSchema.body>;
};
export type DeleteLessonRequest = {
	Params: z.infer<typeof deleteLessonSchema.params>;
};
export type UpdateConceptItemRequest = {
	Params: z.infer<typeof updateConceptItemSchema.params>;
	Body: z.infer<typeof updateConceptItemSchema.body>;
};
export type DeleteConceptItemRequest = {
	Params: z.infer<typeof deleteConceptItemSchema.params>;
};
export type UpdateConceptExampleRequest = {
	Params: z.infer<typeof updateConceptExampleSchema.params>;
	Body: z.infer<typeof updateConceptExampleSchema.body>;
};
export type DeleteConceptExampleRequest = {
	Params: z.infer<typeof deleteConceptExampleSchema.params>;
};
export type UpdateApplicationItemRequest = {
	Params: z.infer<typeof updateApplicationItemSchema.params>;
	Body: z.infer<typeof updateApplicationItemSchema.body>;
};
export type DeleteApplicationItemRequest = {
	Params: z.infer<typeof deleteApplicationItemSchema.params>;
};
