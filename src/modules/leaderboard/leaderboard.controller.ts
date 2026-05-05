import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ILeaderboardService } from '@/types/interfaces/leaderboard/leaderboard.service.interface.js';

export class LeaderboardController {
	constructor(private readonly service: ILeaderboardService) {}

	list = async (_req: FastifyRequest, reply: FastifyReply): Promise<void> => {
		const entries = await this.service.listLeaderboard();
		reply.status(200).send(entries);
	};
}
