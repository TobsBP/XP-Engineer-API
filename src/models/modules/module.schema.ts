import { z } from 'zod';

export const ModuleStatusSchema = z.enum([
	'available',
	'in_progress',
	'completed',
	'locked',
]);

export const ModuleSchema = z.object({
	id: z.string().max(10),
	title: z.string().max(200),
	subtitle: z.string().max(100),
	subject: z.string().max(100),
	order_index: z.number().int(),
	locked_by_default: z.boolean(),
	min_xp: z.number().int().min(0),
});

export const ModuleResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	subtitle: z.string(),
	subject: z.string(),
	progress: z.number().int().min(0).max(100),
	status: ModuleStatusSchema,
	link: z.string().nullable(),
	locked: z.boolean().optional(),
});

export type Module = z.infer<typeof ModuleSchema>;
export type ModuleResponse = z.infer<typeof ModuleResponseSchema>;
export type ModuleStatus = z.infer<typeof ModuleStatusSchema>;
