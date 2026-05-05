import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { LeaderboardController } from '@/modules/leaderboard/leaderboard.controller.js';
import { LeaderboardRepository } from '@/modules/leaderboard/leaderboard.repository.js';
import { LeaderboardService } from '@/modules/leaderboard/leaderboard.service.js';
import { listLeaderboardSchema } from '@/types/routes/leaderboard.js';

export const leaderboardRoutes = async (
	app: FastifyInstance,
): Promise<void> => {
	const repository = new LeaderboardRepository(pool);
	const service = new LeaderboardService(repository);
	const controller = new LeaderboardController(service);

	app.get(
		'/leaderboard',
		{ preHandler: app.authenticate, schema: listLeaderboardSchema },
		controller.list,
	);
};
