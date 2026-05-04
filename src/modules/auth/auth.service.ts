import bcrypt from 'bcryptjs';
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	UpdateMeRequest,
} from '@/types/interfaces/auth/auth.service.interface.js';
import type {
	IUserRepository,
	UserRow,
} from '@/types/interfaces/users/user.repository.interface.js';
import type { UserResponse } from '@/types/schemas/user.js';

export class UserAlreadyExistsError extends Error {
	constructor(email: string) {
		super(`Usuário com email '${email}' já existe`);
		this.name = 'UserAlreadyExistsError';
	}
}

export class InvalidCredentialsError extends Error {
	constructor() {
		super('Email ou senha inválidos');
		this.name = 'InvalidCredentialsError';
	}
}

interface JWTService {
	sign(payload: object): string;
}

export class AuthService {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly jwt: JWTService,
	) {}

	async register(data: RegisterRequest): Promise<AuthResponse> {
		const existingUser = await this.userRepository.findByEmail(data.email);
		if (existingUser) {
			throw new UserAlreadyExistsError(data.email);
		}

		const passwordHash = await bcrypt.hash(data.password, 10);

		const userRow = await this.userRepository.create({
			name: data.name,
			email: data.email,
			password_hash: passwordHash,
			avatar_url: data.avatar_url,
			specialization: data.specialization,
		});

		const user = this.toResponse(userRow);
		const token = this.jwt.sign({ sub: user.id });

		return { user, token };
	}

	async updateMe(userId: number, data: UpdateMeRequest): Promise<UserResponse> {
		const userRow = await this.userRepository.findById(userId);
		if (!userRow) {
			throw new InvalidCredentialsError();
		}

		if (data.new_password) {
			if (!data.current_password) {
				throw new InvalidCredentialsError();
			}
			const isValid = await bcrypt.compare(
				data.current_password,
				userRow.password_hash,
			);
			if (!isValid) {
				throw new InvalidCredentialsError();
			}
		}

		if (data.email && data.email !== userRow.email) {
			const existing = await this.userRepository.findByEmail(data.email);
			if (existing) {
				throw new UserAlreadyExistsError(data.email);
			}
		}

		const updateData: Record<string, string> = {};
		if (data.name) updateData.name = data.name;
		if (data.email) updateData.email = data.email;
		if (data.new_password) {
			updateData.password_hash = await bcrypt.hash(data.new_password, 10);
		}

		const updated = await this.userRepository.update(userId, updateData);
		if (!updated) {
			throw new InvalidCredentialsError();
		}

		return this.toResponse(updated);
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		const userRow = await this.userRepository.findByEmail(data.email);
		if (!userRow) {
			throw new InvalidCredentialsError();
		}

		const isPasswordValid = await bcrypt.compare(
			data.password,
			userRow.password_hash,
		);
		if (!isPasswordValid) {
			throw new InvalidCredentialsError();
		}

		const user = this.toResponse(userRow);
		const token = this.jwt.sign({ sub: user.id });

		return { user, token };
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
