import type { Pool } from 'pg';
import type {
	CreatedModuleRow,
	CreateModuleData,
	IModuleRepository,
	ModuleListFilters,
	ModuleRow,
	UpdateModuleData,
} from '@/models/modules/module.repository.interface.js';

export class ModuleRepository implements IModuleRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(userId: number, filters?: ModuleListFilters): Promise<ModuleRow[]> {
		const params: unknown[] = [userId];
		const conditions: string[] = [];
		if (filters?.subjects && filters.subjects.length > 0) {
			params.push(filters.subjects);
			conditions.push(`m.subject = ANY($${params.length}::text[])`);
		}
		if (!filters?.includeHidden) {
			conditions.push('COALESCE(m.visible, true) = true');
		}
		const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
		const { rows } = await this.pool.query<ModuleRow>(
			`SELECT
				m.id, m.title, m.subtitle, m.subject, m.order_index, m.locked_by_default,
				COALESCE(m.min_xp, 0)::int AS min_xp,
				COALESCE(m.visible, true) AS visible,
				COALESCE(um.progress, 0)::int AS progress,
				COALESCE(um.status::text, CASE WHEN m.locked_by_default THEN 'locked' ELSE 'available' END) AS status,
				COALESCE(um.current_page, 1) AS current_page
			FROM modules m
			LEFT JOIN user_modules um ON m.id = um.module_id AND um.user_id = $1
			${where}
			ORDER BY m.order_index`,
			params,
		);
		return rows;
	}

	async findById(moduleId: string, userId: number, includeHidden = false): Promise<ModuleRow | null> {
		const visibilityFilter = includeHidden ? '' : ' AND COALESCE(m.visible, true) = true';
		const { rows } = await this.pool.query<ModuleRow>(
			`SELECT
				m.id, m.title, m.subtitle, m.subject, m.order_index, m.locked_by_default,
				COALESCE(m.min_xp, 0)::int AS min_xp,
				COALESCE(m.visible, true) AS visible,
				COALESCE(um.progress, 0)::int AS progress,
				COALESCE(um.status::text, CASE WHEN m.locked_by_default THEN 'locked' ELSE 'available' END) AS status,
				COALESCE(um.current_page, 1) AS current_page
			FROM modules m
			LEFT JOIN user_modules um ON m.id = um.module_id AND um.user_id = $1
			WHERE m.id = $2${visibilityFilter}`,
			[userId, moduleId],
		);
		return rows[0] ?? null;
	}

	async create(data: CreateModuleData): Promise<CreatedModuleRow> {
		const { rows } = await this.pool.query<CreatedModuleRow>(
			`INSERT INTO modules (id, title, subtitle, subject, order_index, locked_by_default, min_xp, visible)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id, title, subtitle, subject, order_index, locked_by_default, min_xp, visible`,
			[data.id, data.title, data.subtitle, data.subject, data.order_index, data.locked_by_default, data.min_xp ?? 0, data.visible ?? true],
		);
		return rows[0];
	}

	async update(moduleId: string, data: UpdateModuleData): Promise<CreatedModuleRow | null> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) {
			const { rows } = await this.pool.query<CreatedModuleRow>(
				`SELECT id, title, subtitle, subject, order_index, locked_by_default, min_xp, COALESCE(visible, true) AS visible
				FROM modules WHERE id = $1`,
				[moduleId],
			);
			return rows[0] ?? null;
		}

		const set = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
		const { rows } = await this.pool.query<CreatedModuleRow>(
			`UPDATE modules SET ${set}
			WHERE id = $1
			RETURNING id, title, subtitle, subject, order_index, locked_by_default, min_xp, COALESCE(visible, true) AS visible`,
			[moduleId, ...entries.map(([, v]) => v)],
		);
		return rows[0] ?? null;
	}

	async delete(moduleId: string): Promise<boolean> {
		const { rowCount } = await this.pool.query('DELETE FROM modules WHERE id = $1', [moduleId]);
		return (rowCount ?? 0) > 0;
	}
}
