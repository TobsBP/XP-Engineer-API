import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	UserNotFoundError,
	UserService,
} from '@/modules/users/user.service.js';
import type {
	IUserRepository,
	UserRow,
} from '@/types/interfaces/users/user.repository.interface.js';

describe('UserService', () => {
	let userService: UserService;
	let userRepositoryMock: IUserRepository;

	const mockUserRow: UserRow = {
		id: 1,
		name: 'Test User',
		avatar_url: 'http://avatar.com',
		xp_total: 100,
		streak_days: 5,
		rank: 'Bronze',
		level: 2,
		email: 'tobias@gmail.com',
		password_hash: 'admin123',
		specialization: 'Backend',
		created_at: new Date(),
	};

	beforeEach(() => {
		userRepositoryMock = {
			findById: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		} as unknown as IUserRepository;

		userService = new UserService(userRepositoryMock);
	});

	describe('getUser', () => {
		it('should return a user when id exists (happy path)', async () => {
			vi.mocked(userRepositoryMock.findById).mockResolvedValue(mockUserRow);

			const result = await userService.getUser(1);

			expect(userRepositoryMock.findById).toHaveBeenCalledWith(1);
			expect(result).toEqual({
				id: mockUserRow.id,
				name: mockUserRow.name,
				email: mockUserRow.email,
				avatar_url: mockUserRow.avatar_url,
				xp_total: mockUserRow.xp_total,
				streak_days: mockUserRow.streak_days,
				rank: mockUserRow.rank,
				level: mockUserRow.level,
				specialization: mockUserRow.specialization,
			});
		});

		it('should throw UserNotFoundError when user does not exist (unhappy path)', async () => {
			vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

			await expect(userService.getUser(999)).rejects.toThrow(UserNotFoundError);
			expect(userRepositoryMock.findById).toHaveBeenCalledWith(999);
		});
	});

	describe('createUser', () => {
		it('should create and return a new user (happy path)', async () => {
			const createData = {
				name: 'New User',
				email: 'new@example.com',
				password_hash: 'hashed_pw',
				specialization: 'Frontend',
			};
			vi.mocked(userRepositoryMock.create).mockResolvedValue({
				...mockUserRow,
				...createData,
			});

			const result = await userService.createUser(createData);

			expect(userRepositoryMock.create).toHaveBeenCalledWith(createData);
			expect(result.name).toBe(createData.name);
			expect(result.email).toBe(createData.email);
		});
	});

	describe('updateUser', () => {
		it('should update and return user when id exists (happy path)', async () => {
			const updateData = { name: 'Updated Name' };
			vi.mocked(userRepositoryMock.update).mockResolvedValue({
				...mockUserRow,
				...updateData,
			});

			const result = await userService.updateUser(1, updateData);

			expect(userRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
			expect(result.name).toBe(updateData.name);
		});

		it('should throw UserNotFoundError when updating non-existent user (unhappy path)', async () => {
			vi.mocked(userRepositoryMock.update).mockResolvedValue(null);

			await expect(
				userService.updateUser(999, { name: 'Fail' }),
			).rejects.toThrow(UserNotFoundError);
		});
	});

	describe('deleteUser', () => {
		it('should delete user when id exists (happy path)', async () => {
			vi.mocked(userRepositoryMock.delete).mockResolvedValue(true);

			await expect(userService.deleteUser(1)).resolves.not.toThrow();
			expect(userRepositoryMock.delete).toHaveBeenCalledWith(1);
		});

		it('should throw UserNotFoundError when deleting non-existent user (unhappy path)', async () => {
			vi.mocked(userRepositoryMock.delete).mockResolvedValue(false);

			await expect(userService.deleteUser(999)).rejects.toThrow(
				UserNotFoundError,
			);
		});
	});
});
