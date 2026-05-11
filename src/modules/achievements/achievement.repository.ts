import type { Pool } from 'pg';
import type {
	AchievementCatalogRow,
	AchievementPagination,
	AchievementRow,
	CreateAchievementData,
	CreatedAchievementRow,
	IAchievementRepository,
} from '@/models/achievements/achievement.repository.interface.js';

export class AchievementRepository implements IAchievementRepository {
	constructor(private readonly pool: Pool) {}

	async create(data: CreateAchievementData): Promise<CreatedAchievementRow> {
		const { rows } = await this.pool.query<CreatedAchievementRow>(
			`INSERT INTO achievements (title, description, icon, module_id)
			VALUES ($1, $2, $3, $4)
			RETURNING id, title, description, icon, module_id`,
			[data.title, data.description, data.icon, data.module_id ?? null],
		);
		return rows[0];
	}

	async findAllByUser(userId: number): Promise<AchievementRow[]> {
		const { rows } = await this.pool.query<AchievementRow>(
			`SELECT
				a.id, a.title, a.description, a.icon, a.module_id,
				ua.unlocked_at
			FROM achievements a
			LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
			ORDER BY ua.unlocked_at ASC NULLS LAST, a.id`,
			[userId],
		);
		return rows;
	}

	async findIdsByModule(moduleId: string): Promise<string[]> {
		const { rows } = await this.pool.query<{ id: string }>(`SELECT id FROM achievements WHERE module_id = $1`, [moduleId]);
		return rows.map((r) => r.id);
	}

	async findAll({ page, pageSize }: AchievementPagination): Promise<{ items: AchievementCatalogRow[]; total: number }> {
		const offset = (page - 1) * pageSize;
		const [itemsResult, totalResult] = await Promise.all([
			this.pool.query<AchievementCatalogRow>(
				`SELECT id, title, description, icon, module_id
				FROM achievements
				ORDER BY id
				LIMIT $1 OFFSET $2`,
				[pageSize, offset],
			),
			this.pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM achievements'),
		]);
		return { items: itemsResult.rows, total: Number(totalResult.rows[0]?.count ?? 0) };
	}

	async existsById(achievementId: string): Promise<boolean> {
		const { rowCount } = await this.pool.query(`SELECT 1 FROM achievements WHERE id = $1`, [achievementId]);
		return (rowCount ?? 0) > 0;
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
