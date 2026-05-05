import type { Pool } from 'pg';
import type {
	IProgressRepository,
	UserModuleDetailRow,
	UserModuleRow,
} from '@/models/progress/progress.repository.interface.js';

export class ProgressRepository implements IProgressRepository {
	constructor(private readonly pool: Pool) {}

	async findUserModule(
		userId: number,
		moduleId: string,
	): Promise<UserModuleRow | null> {
		const { rows } = await this.pool.query<UserModuleRow>(
			`SELECT user_id, module_id, progress, status, current_page
			FROM user_modules
			WHERE user_id = $1 AND module_id = $2`,
			[userId, moduleId],
		);
		return rows[0] ?? null;
	}

	async findAllByUser(userId: number): Promise<UserModuleDetailRow[]> {
		const { rows } = await this.pool.query<UserModuleDetailRow>(
			`SELECT
				um.module_id,
				m.title AS module_title,
				m.subject,
				um.progress,
				um.status,
				um.current_page,
				(SELECT COUNT(*)::int FROM lessons l WHERE l.module_id = um.module_id) AS total_pages
			FROM user_modules um
			JOIN modules m ON m.id = um.module_id
			WHERE um.user_id = $1
			ORDER BY m.order_index`,
			[userId],
		);
		return rows;
	}

	async findModuleDetail(
		userId: number,
		moduleId: string,
	): Promise<UserModuleDetailRow | null> {
		const { rows } = await this.pool.query<UserModuleDetailRow>(
			`SELECT
				um.module_id,
				m.title AS module_title,
				m.subject,
				um.progress,
				um.status,
				um.current_page,
				(SELECT COUNT(*)::int FROM lessons l WHERE l.module_id = um.module_id) AS total_pages
			FROM user_modules um
			JOIN modules m ON m.id = um.module_id
			WHERE um.user_id = $1 AND um.module_id = $2`,
			[userId, moduleId],
		);
		return rows[0] ?? null;
	}

	async getXpTotal(userId: number): Promise<number> {
		const { rows } = await this.pool.query<{ xp_total: number }>(
			`SELECT xp_total FROM users WHERE id = $1`,
			[userId],
		);
		return rows[0]?.xp_total ?? 0;
	}

	async updateProgress(
		userId: number,
		moduleId: string,
		data: { progress: number; status: string; current_page: number },
	): Promise<UserModuleRow | null> {
		const { rows } = await this.pool.query<UserModuleRow>(
			`UPDATE user_modules
			SET progress = $3, status = $4, current_page = $5, updated_at = NOW()
			WHERE user_id = $1 AND module_id = $2
			RETURNING user_id, module_id, progress, status, current_page`,
			[userId, moduleId, data.progress, data.status, data.current_page],
		);
		return rows[0] ?? null;
	}

	async completeModule(
		userId: number,
		moduleId: string,
	): Promise<UserModuleRow | null> {
		const { rows } = await this.pool.query<UserModuleRow>(
			`UPDATE user_modules
			SET progress = 100, status = 'completed', updated_at = NOW()
			WHERE user_id = $1 AND module_id = $2
			RETURNING user_id, module_id, progress, status, current_page`,
			[userId, moduleId],
		);
		return rows[0] ?? null;
	}

	async addXp(userId: number, xp: number): Promise<number> {
		const { rows } = await this.pool.query<{ xp_total: number }>(
			`UPDATE users
			SET xp_total = xp_total + $2
			WHERE id = $1
			RETURNING xp_total`,
			[userId, xp],
		);
		return rows[0].xp_total;
	}

	async updateLevel(userId: number, level: number): Promise<void> {
		await this.pool.query(`UPDATE users SET level = $2 WHERE id = $1`, [
			userId,
			level,
		]);
	}

	async getTotalPages(moduleId: string): Promise<number> {
		const { rows } = await this.pool.query<{ count: string }>(
			`SELECT COUNT(*)::text AS count FROM lessons WHERE module_id = $1`,
			[moduleId],
		);
		return Number.parseInt(rows[0].count, 10);
	}
}
