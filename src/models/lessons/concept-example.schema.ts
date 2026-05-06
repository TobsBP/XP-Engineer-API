import { z } from 'zod';

export const ConceptExampleSchema = z.object({
	id: z.uuid(),
	lesson_id: z.number().int(),
	label: z.string().max(200),
	latex: z.string(),
	order_index: z.number().int(),
});

export const ConceptExampleResponseSchema = z.object({
	id: z.string(),
	label: z.string(),
	latex: z.string(),
});

export const ConceptItemSchema = z.object({
	id: z.uuid(),
	lesson_id: z.number().int(),
	title: z.string().max(200),
	description: z.string(),
	latex: z.string().nullable(),
	order_index: z.number().int(),
});

export const ConceptItemResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	latex: z.string().optional(),
});

export type ConceptExample = z.infer<typeof ConceptExampleSchema>;
export type ConceptExampleResponse = z.infer<typeof ConceptExampleResponseSchema>;
export type ConceptItem = z.infer<typeof ConceptItemSchema>;
export type ConceptItemResponse = z.infer<typeof ConceptItemResponseSchema>;
