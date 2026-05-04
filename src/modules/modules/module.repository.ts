import type { Pool } from 'pg';
import type {
	CreatedModuleRow,
	CreateModuleData,
	IModuleRepository,
	ModuleRow,
} from '@/types/interfaces/modules/module.repository.interface.js';

export class ModuleRepository implements IModuleRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(userId: number): Promise<ModuleRow[]> {
		const { rows } = await this.pool.query<ModuleRow>(
			`SELECT
				m.id, m.title, m.subtitle, m.order_index, m.locked_by_default,
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
				m.id, m.title, m.subtitle, m.order_index, m.locked_by_default,
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
			`INSERT INTO modules (id, title, subtitle, order_index, locked_by_default)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, title, subtitle, order_index, locked_by_default`,
			[
				data.id,
				data.title,
				data.subtitle,
				data.order_index,
				data.locked_by_default,
			],
		);
		return rows[0];
	}
}
