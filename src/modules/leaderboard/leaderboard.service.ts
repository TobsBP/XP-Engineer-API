import type { ILeaderboardRepository } from '@/types/interfaces/leaderboard/leaderboard.repository.interface.js';
import type { ILeaderboardService } from '@/types/interfaces/leaderboard/leaderboard.service.interface.js';
import type { LeaderboardEntry } from '@/types/schemas/leaderboard.js';

export class LeaderboardService implements ILeaderboardService {
	constructor(private readonly repository: ILeaderboardRepository) {}

	async listLeaderboard(): Promise<LeaderboardEntry[]> {
		return this.repository.findAll();
	}
}
