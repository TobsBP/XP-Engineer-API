import type { FastifyInstance } from 'fastify';
import { listLeaderboardSchema } from '@/models/leaderboard/leaderboard.routes.js';

export const leaderboardRoutes = async (
	app: FastifyInstance,
): Promise<void> => {
	const controller = app.container.resolve('leaderboardController');

	app.get(
		'/leaderboard',
		{ preHandler: app.authenticate, schema: listLeaderboardSchema },
		controller.list,
	);
};
