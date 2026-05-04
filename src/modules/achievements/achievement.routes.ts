import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { AchievementController } from '@/modules/achievements/achievement.controller.js';
import { AchievementRepository } from '@/modules/achievements/achievement.repository.js';
import { AchievementService } from '@/modules/achievements/achievement.service.js';
import {
	type CreateAchievementRequest,
	createAchievementSchema,
	type ListUserAchievementsRequest,
	listUserAchievementsSchema,
	type UnlockAchievementRequest,
	unlockAchievementSchema,
} from '@/types/routes/achievements.js';

export const achievementRoutes = async (
	app: FastifyInstance,
): Promise<void> => {
	const repository = new AchievementRepository(pool);
	const service = new AchievementService(repository);
	const controller = new AchievementController(service);

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
