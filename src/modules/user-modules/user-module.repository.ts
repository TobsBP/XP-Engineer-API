import type { Pool } from 'pg';
import type {
	IUserModuleRepository,
	UpdateUserModuleData,
} from '@/types/interfaces/user-modules/user-module.repository.interface.js';

export class UserModuleRepository implements IUserModuleRepository {
	constructor(private readonly pool: Pool) {}

	async create(userId: number, moduleId: string): Promise<void> {
		await this.pool.query(
			`INSERT INTO user_modules (user_id, module_id, progress, status, current_page)
			VALUES ($1, $2, 0, 'available', 1)
			ON CONFLICT (user_id, module_id) DO NOTHING`,
			[userId, moduleId],
		);
	}

	async update(
		userId: number,
		moduleId: string,
		data: UpdateUserModuleData,
	): Promise<boolean> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) return true;

		const set = entries.map(([col], i) => `${col} = $${i + 3}`).join(', ');
		const { rowCount } = await this.pool.query(
			`UPDATE user_modules SET ${set}, updated_at = NOW()
			WHERE user_id = $1 AND module_id = $2`,
			[userId, moduleId, ...entries.map(([, v]) => v)],
		);
		return (rowCount ?? 0) > 0;
	}

	async getModuleMinXp(moduleId: string): Promise<number> {
		const { rows } = await this.pool.query<{ min_xp: number }>(
			`SELECT COALESCE(min_xp, 0)::int AS min_xp FROM modules WHERE id = $1`,
			[moduleId],
		);
		return rows[0]?.min_xp ?? 0;
	}

	async getUserXpTotal(userId: number): Promise<number> {
		const { rows } = await this.pool.query<{ xp_total: number }>(
			`SELECT COALESCE(xp_total, 0)::int AS xp_total FROM users WHERE id = $1`,
			[userId],
		);
		return rows[0]?.xp_total ?? 0;
	}
}
