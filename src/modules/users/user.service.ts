import type {
	CreateUserData,
	IUserRepository,
	UpdateUserData,
	UserRow,
} from '@/models/users/user.repository.interface.js';
import type { UserResponse } from '@/models/users/user.schema.js';
import type { IUserService } from '@/models/users/user.service.interface.js';

export class UserNotFoundError extends Error {
	constructor(id: number) {
		super(`Usuário '${id}' não encontrado`);
		this.name = 'UserNotFoundError';
	}
}

export class UserService implements IUserService {
	constructor(private readonly userRepository: IUserRepository) {}

	async getUser(id: number): Promise<UserResponse> {
		const row = await this.userRepository.findById(id);
		if (!row) throw new UserNotFoundError(id);
		return this.toResponse(row);
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
		};
	}
}
