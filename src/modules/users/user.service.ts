import { UserNotFoundError } from '@/models/users/user.errors.js';
import type { CreateUserData, IUserRepository, UpdateUserData, UserPagination, UserRow } from '@/models/users/user.repository.interface.js';
import type { UserResponse } from '@/models/users/user.schema.js';
import type { IUserService, ListUsersResult } from '@/models/users/user.service.interface.js';

export class UserService implements IUserService {
	constructor(private readonly userRepository: IUserRepository) {}

	async getUser(id: number): Promise<UserResponse> {
		const row = await this.userRepository.findById(id);
		if (!row) throw new UserNotFoundError(id);
		return this.toResponse(row);
	}

	async listUsers(pagination: UserPagination): Promise<ListUsersResult> {
		const { items, total } = await this.userRepository.findAll(pagination);
		return {
			items: items.map((row) => this.toResponse(row)),
			total,
			page: pagination.page,
			pageSize: pagination.pageSize,
		};
	}

	async createUser(data: CreateUserData): Promise<UserResponse> {
		const row = await this.userRepository.create(data);
		return this.toResponse(row);
	}

	async updateUser(id: number, data: UpdateUserData): Promise<UserResponse> {
		const row = await this.userRepository.update(id, data);
		if (!row) throw new UserNotFoundError(id);
		return this.toResponse(row);
	}

	async upgradeToAdmin(id: number): Promise<UserResponse> {
		const row = await this.userRepository.update(id, { role: 'admin' });
		if (!row) throw new UserNotFoundError(id);
		return this.toResponse(row);
	}

	async deleteUser(id: number): Promise<void> {
		const deleted = await this.userRepository.delete(id);
		if (!deleted) throw new UserNotFoundError(id);
	}

	private toResponse(row: UserRow): UserResponse {
		return {
			id: row.id,
			name: row.name,
			email: row.email,
			avatar_url: row.avatar_url,
			xp_total: row.xp_total,
			streak_days: row.streak_days,
			rank: row.rank,
			level: row.level,
			specialization: row.specialization,
			role: row.role,
		};
	}
}
