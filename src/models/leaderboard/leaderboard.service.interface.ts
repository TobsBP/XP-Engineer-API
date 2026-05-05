import type { LeaderboardEntry } from '@/models/leaderboard/leaderboard.schema.js';

export interface ILeaderboardService {
	listLeaderboard(): Promise<LeaderboardEntry[]>;
}
