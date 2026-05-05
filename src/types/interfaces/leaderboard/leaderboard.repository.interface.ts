export type LeaderboardRow = {
	id: number;
	name: string;
	avatar_url: string | null;
	xp_total: number;
	streak_days: number;
	rank: string;
	level: number;
};

export interface ILeaderboardRepository {
	findAll(): Promise<LeaderboardRow[]>;
}
