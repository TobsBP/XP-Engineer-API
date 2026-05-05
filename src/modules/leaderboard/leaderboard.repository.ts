import type { Pool } from 'pg';
import type {
	ILeaderboardRepository,
	LeaderboardRow,
} from '@/types/interfaces/leaderboard/leaderboard.repository.interface.js';

export class LeaderboardRepository implements ILeaderboardRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(): Promise<LeaderboardRow[]> {
		const { rows } = await this.pool.query<LeaderboardRow>(
			`SELECT id, name, avatar_url, xp_total, streak_days, rank, level
			FROM users
			ORDER BY xp_total DESC`,
		);
		return rows;
	}
}
