export type UserRole = 'user' | 'admin';

export type UserRow = {
	id: number;
	name: string;
	email: string;
	password_hash: string;
	avatar_url: string | null;
	xp_total: number;
	streak_days: number;
	rank: string;
	level: number;
	specialization: string | null;
	role: UserRole;
	created_at: Date;
};

export type CreateUserData = {
	name: string;
	email: string;
	password_hash: string;
	avatar_url?: string;
	specialization?: string;
};

export type UpdateUserData = {
	name?: string;
	email?: string;
	password_hash?: string;
	avatar_url?: string | null;
	xp_total?: number;
	streak_days?: number;
	rank?: string;
	level?: number;
	specialization?: string | null;
	role?: UserRole;
};

export type UserPagination = {
	page: number;
	pageSize: number;
};

export interface IUserRepository {
	findById(id: number): Promise<UserRow | null>;
	findByEmail(email: string): Promise<UserRow | null>;
	findAll(pagination: UserPagination): Promise<{ items: UserRow[]; total: number }>;
	create(data: CreateUserData): Promise<UserRow>;
	update(id: number, data: UpdateUserData): Promise<UserRow | null>;
	delete(id: number): Promise<boolean>;
}
