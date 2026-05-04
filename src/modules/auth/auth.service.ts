import bcrypt from 'bcryptjs';
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
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
