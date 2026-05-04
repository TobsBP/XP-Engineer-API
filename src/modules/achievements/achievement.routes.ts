import type { FastifyInstance } from 'fastify';
import { pool } from '../../lib/db.js';
import {
	createAchievementSchema,
	listUserAchievementsSchema,
	unlockAchievementSchema,
} from '../../types/routes/achievements.js';
import { AchievementController } from './achievement.controller.js';
import { AchievementRepository } from './achievement.repository.js';
import { AchievementService } from './achievement.service.js';

export const achievementRoutes = async (
	app: FastifyInstance,
): Promise<void> => {
	const repository = new AchievementRepository(pool);
	const service = new AchievementService(repository);
	const controller = new AchievementController(service);

	app.get(
		'/user/:userId/achievements',
		{ schema: listUserAchievementsSchema },
		controller.listByUser,
	);
	app.patch(
		'/user/:userId/achievement/:achievementId',
		{ schema: unlockAchievementSchema },
		controller.unlock,
	);
	app.post(
		'/achievement',
		{ schema: createAchievementSchema },
		controller.create,
	);
};
