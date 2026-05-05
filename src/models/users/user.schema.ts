import { z } from 'zod';

export const UserRoleSchema = z.enum(['user', 'admin']);

export const UserSchema = z.object({
	id: z.number().int(),
	name: z.string().max(100),
	email: z.string().email().max(255),
	password_hash: z.string(),
	avatar_url: z.string().nullable(),
	xp_total: z.number().int(),
	streak_days: z.number().int(),
	rank: z.string().max(100),
	level: z.number().int(),
	specialization: z.string().max(100).nullable(),
	role: UserRoleSchema,
	created_at: z.date(),
});

export const UserResponseSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	email: z.string(),
	avatar_url: z.string().nullable(),
	xp_total: z.number().int(),
	streak_days: z.number().int(),
	rank: z.string(),
	level: z.number().int(),
	specialization: z.string().nullable(),
	role: UserRoleSchema,
});

export const StreakHistoryItemSchema = z.object({
	start_date: z.string(),
	end_date: z.string(),
	duration: z.number().int(),
});

export const StreakSchema = z.object({
	current_streak: z.number().int(),
	longest_streak: z.number().int(),
	history: z.array(StreakHistoryItemSchema),
});

export const MeResponseSchema = UserResponseSchema.extend({
	streak: StreakSchema,
});

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
