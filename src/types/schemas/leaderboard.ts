import { z } from 'zod';

export const LeaderboardEntrySchema = z.object({
	id: z.number().int(),
	name: z.string(),
	avatar_url: z.string().nullable(),
	xp_total: z.number().int(),
	streak_days: z.number().int(),
	rank: z.string(),
	level: z.number().int(),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
