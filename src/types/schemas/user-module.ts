import { z } from 'zod';
import { ModuleStatusSchema } from './module.js';

export const UserModuleSchema = z.object({
	user_id: z.number().int(),
	module_id: z.string().max(10),
	progress: z.number().int().min(0).max(100),
	status: ModuleStatusSchema,
	current_page: z.number().int(),
	updated_at: z.date(),
});

export const UserAchievementSchema = z.object({
	user_id: z.number().int(),
	achievement_id: z.string().max(100),
	unlocked_at: z.date().nullable(),
});

export type UserModule = z.infer<typeof UserModuleSchema>;
export type UserAchievement = z.infer<typeof UserAchievementSchema>;
