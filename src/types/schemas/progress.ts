import { z } from 'zod';

export const UserProgressSchema = z.object({
	module_id: z.string(),
	module_title: z.string(),
	subject: z.string(),
	progress: z.number().int().min(0).max(100),
	status: z.string(),
	current_page: z.number().int(),
	total_pages: z.number().int(),
});

export const UserProgressSummarySchema = z.object({
	xp_total: z.number().int(),
	modules_completed: z.number().int(),
	modules_in_progress: z.number().int(),
	modules: z.array(UserProgressSchema),
});

export const LessonCompleteResponseSchema = z.object({
	module_id: z.string(),
	current_page: z.number().int(),
	progress: z.number().int().min(0).max(100),
	status: z.string(),
});

export const ModuleCompleteResponseSchema = z.object({
	module_id: z.string(),
	status: z.string(),
	score: z.number().min(0).max(100),
	xp_earned: z.number().int(),
	xp_total: z.number().int(),
});

export type UserProgress = z.infer<typeof UserProgressSchema>;
export type UserProgressSummary = z.infer<typeof UserProgressSummarySchema>;
export type LessonCompleteResponse = z.infer<
	typeof LessonCompleteResponseSchema
>;
export type ModuleCompleteResponse = z.infer<
	typeof ModuleCompleteResponseSchema
>;
