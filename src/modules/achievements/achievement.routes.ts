import type { FastifyInstance } from 'fastify';
import {
	type CreateAchievementRequest,
	createAchievementSchema,
	type ListUserAchievementsRequest,
	listUserAchievementsSchema,
	type UnlockAchievementRequest,
	unlockAchievementSchema,
} from '@/models/achievements/achievement.routes.js';

export const achievementRoutes = async (
	app: FastifyInstance,
): Promise<void> => {
	const controller = app.container.resolve('achievementController');

	app.get<ListUserAchievementsRequest>(
		'/achievements/:userId',
		{ preHandler: app.authenticate, schema: listUserAchievementsSchema },
		controller.listByUser,
	);
	app.patch<UnlockAchievementRequest>(
		'/achievement/:userId/:achievementId',
		{ preHandler: app.authenticate, schema: unlockAchievementSchema },
		controller.unlock,
	);
	app.post<CreateAchievementRequest>(
		'/achievement',
		{ preHandler: app.authenticate, schema: createAchievementSchema },
		controller.create,
	);
};
