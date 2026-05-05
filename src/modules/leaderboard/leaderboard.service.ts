import type { ILeaderboardRepository } from '@/models/leaderboard/leaderboard.repository.interface.js';
import type { LeaderboardEntry } from '@/models/leaderboard/leaderboard.schema.js';
import type { ILeaderboardService } from '@/models/leaderboard/leaderboard.service.interface.js';

export class LeaderboardService implements ILeaderboardService {
	constructor(private readonly leaderboardRepository: ILeaderboardRepository) {}

	async listLeaderboard(): Promise<LeaderboardEntry[]> {
		return this.leaderboardRepository.findAll();
	}
}
