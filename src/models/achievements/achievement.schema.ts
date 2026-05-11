import { z } from 'zod';

export const AchievementSchema = z.object({
	id: z.string().max(100),
	title: z.string().max(200),
	description: z.string().max(300),
	icon: z.string().max(100),
	module_id: z.string().max(20).nullable(),
});

export const AchievementResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	icon: z.string(),
	module_id: z.string().nullable(),
	unlocked_at: z.string().datetime().nullable(),
});

export type Achievement = z.infer<typeof AchievementSchema>;
export type AchievementResponse = z.infer<typeof AchievementResponseSchema>;
