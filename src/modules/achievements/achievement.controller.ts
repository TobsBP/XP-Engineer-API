import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
	CreateAchievementRequest,
	ListAchievementsRequest,
	ListUserAchievementsRequest,
	UnlockAchievementRequest,
} from '@/models/achievements/achievement.routes.js';
import type { IAchievementService } from '@/models/achievements/achievement.service.interface.js';

export class AchievementController {
	constructor(private readonly achievementService: IAchievementService) {}

	create = async (req: FastifyRequest<CreateAchievementRequest>, reply: FastifyReply): Promise<void> => {
		const achievement = await this.achievementService.createAchievement(req.body);
		reply.status(201).send(achievement);
	};

	listAll = async (req: FastifyRequest<ListAchievementsRequest>, reply: FastifyReply): Promise<void> => {
		const result = await this.achievementService.listAll({ page: req.query.page, pageSize: req.query.pageSize });
		reply.status(200).send(result);
	};

	listByUser = async (req: FastifyRequest<ListUserAchievementsRequest>, reply: FastifyReply): Promise<void> => {
		const achievements = await this.achievementService.listByUser(req.params.userId);
		reply.status(200).send(achievements);
	};

	unlock = async (req: FastifyRequest<UnlockAchievementRequest>, reply: FastifyReply): Promise<void> => {
		await this.achievementService.unlock(req.params.userId, req.params.achievementId);
		reply.status(204).send();
	};
}
