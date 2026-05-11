import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidCredentialsError, UserAlreadyExistsError } from '@/models/auth/auth.errors.js';
import type { IUserRepository, UserRow } from '@/models/users/user.repository.interface.js';
import { AuthService } from '../auth.service.js';

describe('AuthService', () => {
	let authService: AuthService;
	let userRepositoryMock: IUserRepository;
	let jwtMock: { sign: (payload: object) => string };

	const mockUser: UserRow = {
		id: 1,
		name: 'Test User',
		email: 'test@example.com',
		password_hash: '', // will be set in tests
		avatar_url: null,
		xp_total: 0,
		streak_days: 0,
		rank: 'Bronze',
		level: 1,
		specialization: null,
		role: 'user',
		created_at: new Date(),
	};

	beforeEach(() => {
		userRepositoryMock = {
			findById: vi.fn(),
			findByEmail: vi.fn(),
			findAll: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		};
		jwtMock = {
			sign: vi.fn().mockReturnValue('mock-token'),
		};
		authService = new AuthService(userRepositoryMock, jwtMock);
	});

	describe('register', () => {
		it('should register a new user successfully', async () => {
			const registerData = {
				name: 'New User',
				email: 'new@example.com',
				password: 'password123',
			};

			userRepositoryMock.findByEmail = vi.fn().mockResolvedValue(null);
			userRepositoryMock.create = vi.fn().mockResolvedValue({
				...mockUser,
				name: registerData.name,
				email: registerData.email,
			});

			const result = await authService.register(registerData);

			expect(result.user.email).toBe(registerData.email);
			expect(result.token).toBe('mock-token');
			expect(userRepositoryMock.create).toHaveBeenCalledWith(
				expect.objectContaining({
					name: registerData.name,
					email: registerData.email,
					password_hash: expect.any(String),
				}),
			);
		});

		it('should throw UserAlreadyExistsError if email is already taken', async () => {
			const registerData = {
				name: 'New User',
				email: 'test@example.com',
				password: 'password123',
			};

			userRepositoryMock.findByEmail = vi.fn().mockResolvedValue(mockUser);

			await expect(authService.register(registerData)).rejects.toThrow(UserAlreadyExistsError);
		});
	});

	describe('login', () => {
		it('should login successfully with correct credentials', async () => {
			const loginData = {
				email: 'test@example.com',
				password: 'password123',
			};

			const hashedPassword = await bcrypt.hash(loginData.password, 10);
			userRepositoryMock.findByEmail = vi.fn().mockResolvedValue({
				...mockUser,
				password_hash: hashedPassword,
			});

			const result = await authService.login(loginData);

			expect(result.user.email).toBe(loginData.email);
			expect(result.token).toBe('mock-token');
		});

		it('should throw InvalidCredentialsError if user does not exist', async () => {
			const loginData = {
				email: 'nonexistent@example.com',
				password: 'password123',
			};

			userRepositoryMock.findByEmail = vi.fn().mockResolvedValue(null);

			await expect(authService.login(loginData)).rejects.toThrow(InvalidCredentialsError);
		});

		it('should throw InvalidCredentialsError if password is incorrect', async () => {
			const loginData = {
				email: 'test@example.com',
				password: 'wrongpassword',
			};

			const hashedPassword = await bcrypt.hash('password123', 10);
			userRepositoryMock.findByEmail = vi.fn().mockResolvedValue({
				...mockUser,
				password_hash: hashedPassword,
			});

			await expect(authService.login(loginData)).rejects.toThrow(InvalidCredentialsError);
		});
	});
});
