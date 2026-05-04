export type UserRow = {
	id: number;
	name: string;
	avatar_url: string | null;
	xp_total: number;
	streak_days: number;
	rank: string;
	level: number;
	specialization: string | null;
	created_at: Date;
};

export type CreateUserData = {
	name: string;
	avatar_url?: string;
	specialization?: string;
};

export type UpdateUserData = {
	name?: string;
	avatar_url?: string | null;
	xp_total?: number;
	streak_days?: number;
	rank?: string;
	level?: number;
	specialization?: string | null;
};

export interface IUserRepository {
	findById(id: number): Promise<UserRow | null>;
	create(data: CreateUserData): Promise<UserRow>;
	update(id: number, data: UpdateUserData): Promise<UserRow | null>;
	delete(id: number): Promise<boolean>;
}
