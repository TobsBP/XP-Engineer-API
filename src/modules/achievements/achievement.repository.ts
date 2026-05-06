import type { Pool } from 'pg';
import type { AchievementRow, CreateAchievementData, IAchievementRepository } from '@/models/achievements/achievement.repository.interface.js';

export class AchievementRepository implements IAchievementRepository {
	constructor(private readonly pool: Pool) {}

	async create(data: CreateAchievementData): Promise<CreateAchievementData> {
		await this.pool.query(
			`
      INSERT INTO achievements (id, title, description, icon)
      VALUES ($1, $2, $3, $4)
      `,
			[data.id, data.title, data.description, data.icon],
		);

		return data;
	}

	async findAllByUser(userId: number): Promise<AchievementRow[]> {
		const { rows } = await this.pool.query<AchievementRow>(
			`SELECT
				a.id, a.title, a.description, a.icon,
				ua.unlocked_at
			FROM achievements a
			LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
			ORDER BY ua.unlocked_at ASC NULLS LAST, a.id`,
			[userId],
		);
		return rows;
	}

	async unlock(userId: number, achievementId: string): Promise<void> {
		await this.pool.query(
			`INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
			VALUES ($1, $2, NOW())
			ON CONFLICT (user_id, achievement_id) DO UPDATE SET unlocked_at = NOW()`,
			[userId, achievementId],
		);
	}
}
