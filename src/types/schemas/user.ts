import { z } from 'zod';

export const UserSchema = z.object({
	id: z.number().int(),
	name: z.string().max(100),
	avatar_url: z.string().nullable(),
	xp_total: z.number().int(),
	streak_days: z.number().int(),
	rank: z.string().max(100),
	level: z.number().int(),
	specialization: z.string().max(100).nullable(),
	created_at: z.date(),
});

export const UserResponseSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	avatar_url: z.string().nullable(),
	xp_total: z.number().int(),
	streak_days: z.number().int(),
	rank: z.string(),
	level: z.number().int(),
	specialization: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
