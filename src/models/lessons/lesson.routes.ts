import { z } from 'zod';
import { ApplicationItemSchema } from '@/models/lessons/application-item.schema.js';
import {
	ConceptExampleSchema,
	ConceptItemSchema,
} from '@/models/lessons/concept-example.schema.js';
import {
	LessonContentSchema,
	LessonSchema,
} from '@/models/lessons/lesson.schema.js';

export const getLessonSchema = {
	tags: ['Lessons'],
	description: 'Retorna o conteúdo de uma página de um módulo.',
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
		page_number: z.number().int().positive('Número da página é obrigatório'),
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
		id: z.string().min(1).max(100),
		title: z.string().min(1, 'Título é obrigatório').max(200),
		description: z.string().min(1, 'Descrição é obrigatória'),
		latex: z.string().optional(),
		order_index: z.number().int().min(0).default(0),
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
		id: z.string().min(1).max(100),
		label: z.string().min(1, 'Label é obrigatória').max(200),
		latex: z.string().min(1, 'LaTeX é obrigatório'),
		order_index: z.number().int().min(0).default(0),
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
		id: z.string().min(1).max(100),
		title: z.string().min(1, 'Título é obrigatório').max(200),
		description: z.string().min(1, 'Descrição é obrigatória'),
		latex: z.string().optional(),
		order_index: z.number().int().min(0).default(0),
	}),
	response: {
		201: ApplicationItemSchema,
	},
};

export type GetLessonRequest = {
	Params: z.infer<typeof getLessonSchema.params>;
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
