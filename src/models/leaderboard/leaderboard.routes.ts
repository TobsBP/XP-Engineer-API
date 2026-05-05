import { z } from 'zod';
import { LeaderboardEntrySchema } from '@/models/leaderboard/leaderboard.schema.js';

export const listLeaderboardSchema = {
	tags: ['Leaderboard'],
	description: 'Retorna todos os usuários ordenados por XP para o ranking.',
	response: {
		200: z.array(LeaderboardEntrySchema),
	},
};
