import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ILeaderboardService } from '@/models/leaderboard/leaderboard.service.interface.js';

export class LeaderboardController {
	constructor(private readonly leaderboardService: ILeaderboardService) {}

	list = async (_req: FastifyRequest, reply: FastifyReply): Promise<void> => {
		const entries = await this.leaderboardService.listLeaderboard();
		reply.status(200).send(entries);
	};
}
