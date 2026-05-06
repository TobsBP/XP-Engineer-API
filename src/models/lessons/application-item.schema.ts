import { z } from 'zod';

export const ApplicationItemSchema = z.object({
	id: z.string().uuid(),
	lesson_id: z.number().int(),
	title: z.string().max(200),
	description: z.string(),
	latex: z.string().nullable(),
	order_index: z.number().int(),
});

export const ApplicationItemResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	latex: z.string().optional(),
});

export type ApplicationItem = z.infer<typeof ApplicationItemSchema>;
export type ApplicationItemResponse = z.infer<typeof ApplicationItemResponseSchema>;
