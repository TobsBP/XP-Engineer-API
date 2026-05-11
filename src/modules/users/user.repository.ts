import type { Pool } from 'pg';
import type { CreateUserData, IUserRepository, UpdateUserData, UserPagination, UserRow } from '@/models/users/user.repository.interface.js';

export class UserRepository implements IUserRepository {
	constructor(private readonly pool: Pool) {}

	async findById(id: number): Promise<UserRow | null> {
		const { rows } = await this.pool.query<UserRow>(
			`SELECT id, name, email, password_hash, avatar_url, xp_total, streak_days, rank, level, specialization, role, created_at
			FROM users WHERE id = $1`,
			[id],
		);
		return rows[0] ?? null;
	}

	async findByEmail(email: string): Promise<UserRow | null> {
		const { rows } = await this.pool.query<UserRow>(
			`SELECT id, name, email, password_hash, avatar_url, xp_total, streak_days, rank, level, specialization, role, created_at
			FROM users WHERE email = $1`,
			[email],
		);
		return rows[0] ?? null;
	}

	async findAll({ page, pageSize }: UserPagination): Promise<{ items: UserRow[]; total: number }> {
		const offset = (page - 1) * pageSize;
		const [itemsResult, totalResult] = await Promise.all([
			this.pool.query<UserRow>(
				`SELECT id, name, email, password_hash, avatar_url, xp_total, streak_days, rank, level, specialization, role, created_at
				FROM users
				ORDER BY id
				LIMIT $1 OFFSET $2`,
				[pageSize, offset],
			),
			this.pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM users'),
		]);
		return { items: itemsResult.rows, total: Number(totalResult.rows[0]?.count ?? 0) };
	}

	async create(data: CreateUserData): Promise<UserRow> {
		const { rows } = await this.pool.query<UserRow>(
			`INSERT INTO users (name, email, password_hash, avatar_url, specialization)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, name, email, password_hash, avatar_url, xp_total, streak_days, rank, level, specialization, role, created_at`,
			[data.name, data.email, data.password_hash, data.avatar_url ?? null, data.specialization ?? null],
		);
		return rows[0];
	}

	async update(id: number, data: UpdateUserData): Promise<UserRow | null> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) return this.findById(id);

		const set = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
		const { rows } = await this.pool.query<UserRow>(
			`UPDATE users SET ${set}
			WHERE id = $1
			RETURNING id, name, email, password_hash, avatar_url, xp_total, streak_days, rank, level, specialization, role, created_at`,
			[id, ...entries.map(([, v]) => v)],
		);
		return rows[0] ?? null;
	}

	async delete(id: number): Promise<boolean> {
		const { rowCount } = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
		return (rowCount ?? 0) > 0;
	}
}
