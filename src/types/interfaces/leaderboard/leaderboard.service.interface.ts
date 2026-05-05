import type { LeaderboardEntry } from '@/types/schemas/leaderboard.js';

export interface ILeaderboardService {
	listLeaderboard(): Promise<LeaderboardEntry[]>;
}
