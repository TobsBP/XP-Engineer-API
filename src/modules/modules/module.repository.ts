import type { Pool } from 'pg';
import type {
	CreatedModuleRow,
	CreateModuleData,
	IModuleRepository,
	ModuleRow,
	UpdateModuleData,
} from '@/models/modules/module.repository.interface.js';

export class ModuleRepository implements IModuleRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(userId: number): Promise<ModuleRow[]> {
		const { rows } = await this.pool.query<ModuleRow>(
			`SELECT
				m.id, m.title, m.subtitle, m.subject, m.order_index, m.locked_by_default,
				COALESCE(m.min_xp, 0)::int AS min_xp,
				COALESCE(um.progress, 0)::int AS progress,
				COALESCE(um.status::text, CASE WHEN m.locked_by_default THEN 'locked' ELSE 'available' END) AS status,
				COALESCE(um.current_page, 1) AS current_page
			FROM modules m
			LEFT JOIN user_modules um ON m.id = um.module_id AND um.user_id = $1
			ORDER BY m.order_index`,
			[userId],
		);
		return rows;
	}

	async findById(moduleId: string, userId: number): Promise<ModuleRow | null> {
		const { rows } = await this.pool.query<ModuleRow>(
			`SELECT
				m.id, m.title, m.subtitle, m.subject, m.order_index, m.locked_by_default,
				COALESCE(m.min_xp, 0)::int AS min_xp,
				COALESCE(um.progress, 0)::int AS progress,
				COALESCE(um.status::text, CASE WHEN m.locked_by_default THEN 'locked' ELSE 'available' END) AS status,
				COALESCE(um.current_page, 1) AS current_page
			FROM modules m
			LEFT JOIN user_modules um ON m.id = um.module_id AND um.user_id = $1
			WHERE m.id = $2`,
			[userId, moduleId],
		);
		return rows[0] ?? null;
	}

	async create(data: CreateModuleData): Promise<CreatedModuleRow> {
		const { rows } = await this.pool.query<CreatedModuleRow>(
			`INSERT INTO modules (id, title, subtitle, subject, order_index, locked_by_default, min_xp)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, title, subtitle, subject, order_index, locked_by_default, min_xp`,
			[data.id, data.title, data.subtitle, data.subject, data.order_index, data.locked_by_default, data.min_xp ?? 0],
		);
		return rows[0];
	}

	async update(moduleId: string, data: UpdateModuleData): Promise<CreatedModuleRow | null> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) {
			const { rows } = await this.pool.query<CreatedModuleRow>(
				`SELECT id, title, subtitle, subject, order_index, locked_by_default, min_xp
				FROM modules WHERE id = $1`,
				[moduleId],
			);
			return rows[0] ?? null;
		}

		const set = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
		const { rows } = await this.pool.query<CreatedModuleRow>(
			`UPDATE modules SET ${set}
			WHERE id = $1
			RETURNING id, title, subtitle, subject, order_index, locked_by_default, min_xp`,
			[moduleId, ...entries.map(([, v]) => v)],
		);
		return rows[0] ?? null;
	}

	async delete(moduleId: string): Promise<boolean> {
		const { rowCount } = await this.pool.query('DELETE FROM modules WHERE id = $1', [moduleId]);
		return (rowCount ?? 0) > 0;
	}
}
