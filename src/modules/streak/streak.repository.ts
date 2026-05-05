import type { Pool } from 'pg';
import type {
	IStreakRepository,
	StreakHistoryRow,
} from '@/types/interfaces/streak/streak.repository.interface.js';

export class StreakRepository implements IStreakRepository {
	constructor(private readonly pool: Pool) {}

	async registerActivity(userId: number, date: string): Promise<boolean> {
		const { rowCount } = await this.pool.query(
			`INSERT INTO streak_activities (user_id, activity_date)
			VALUES ($1, $2)
			ON CONFLICT (user_id, activity_date) DO NOTHING`,
			[userId, date],
		);
		return (rowCount ?? 0) > 0;
	}

	async getLastActivityDate(userId: number): Promise<string | null> {
		const { rows } = await this.pool.query<{ activity_date: string }>(
			`SELECT activity_date::text FROM streak_activities
			WHERE user_id = $1
			ORDER BY activity_date DESC
			LIMIT 1`,
			[userId],
		);
		return rows[0]?.activity_date ?? null;
	}

	async getCurrentStreakStart(userId: number): Promise<string | null> {
		const { rows } = await this.pool.query<{ streak_start: string }>(
			`WITH consecutive AS (
				SELECT activity_date,
					activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date))::int AS grp
				FROM streak_activities
				WHERE user_id = $1
			)
			SELECT MIN(activity_date)::text AS streak_start
			FROM consecutive
			WHERE grp = (
				SELECT activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date))::int
				FROM streak_activities
				WHERE user_id = $1
				ORDER BY activity_date DESC
				LIMIT 1
			)`,
			[userId],
		);
		return rows[0]?.streak_start ?? null;
	}

	async saveStreakHistory(
		userId: number,
		startDate: string,
		endDate: string,
		duration: number,
	): Promise<void> {
		await this.pool.query(
			`INSERT INTO streak_history (user_id, start_date, end_date, duration)
			VALUES ($1, $2, $3, $4)`,
			[userId, startDate, endDate, duration],
		);
	}

	async getStreakHistory(userId: number): Promise<StreakHistoryRow[]> {
		const { rows } = await this.pool.query<StreakHistoryRow>(
			`SELECT id, user_id, start_date::text AS start_date, end_date::text AS end_date, duration
			FROM streak_history
			WHERE user_id = $1
			ORDER BY end_date DESC`,
			[userId],
		);
		return rows;
	}

	async updateUserStreak(userId: number, streakDays: number): Promise<void> {
		await this.pool.query(`UPDATE users SET streak_days = $2 WHERE id = $1`, [
			userId,
			streakDays,
		]);
	}

	async getUserStreakDays(userId: number): Promise<number> {
		const { rows } = await this.pool.query<{ streak_days: number }>(
			`SELECT COALESCE(streak_days, 0)::int AS streak_days FROM users WHERE id = $1`,
			[userId],
		);
		return rows[0]?.streak_days ?? 0;
	}
}
