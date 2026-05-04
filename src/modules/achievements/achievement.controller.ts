import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IAchievementService } from '../../types/interfaces/achievements/achievement.service.interface.js';
import type {
	CreateAchievementRequest,
	ListUserAchievementsRequest,
	UnlockAchievementRequest,
} from '../../types/routes/achievements.js';

export class AchievementController {
	constructor(private readonly service: IAchievementService) {}

	create = async (
		req: FastifyRequest<CreateAchievementRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const achievement = await this.service.createAchievement(req.body);
		reply.status(201).send(achievement);
	};

	listByUser = async (
		req: FastifyRequest<ListUserAchievementsRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const achievements = await this.service.listByUser(req.params.userId);
		reply.status(200).send(achievements);
	};

	unlock = async (
		req: FastifyRequest<UnlockAchievementRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		await this.service.unlock(req.params.userId, req.params.achievementId);
		reply.status(204).send();
	};
}
