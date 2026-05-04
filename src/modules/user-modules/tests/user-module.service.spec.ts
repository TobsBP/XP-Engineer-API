import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	UserModuleNotFoundError,
	UserModuleService,
} from '@/modules/user-modules/user-module.service.js';
import type { IUserModuleRepository } from '@/types/interfaces/user-modules/user-module.repository.interface.js';

describe('UserModuleService', () => {
	let userModuleService: UserModuleService;
	let userModuleRepositoryMock: IUserModuleRepository;

	beforeEach(() => {
		userModuleRepositoryMock = {
			create: vi.fn(),
			update: vi.fn(),
		} as unknown as IUserModuleRepository;

		userModuleService = new UserModuleService(userModuleRepositoryMock);
	});

	describe('createUserModule', () => {
		it('should create a user module progress entry (happy path)', async () => {
			vi.mocked(userModuleRepositoryMock.create).mockResolvedValue();

			await expect(
				userModuleService.createUserModule(1, 'mod-1'),
			).resolves.not.toThrow();
			expect(userModuleRepositoryMock.create).toHaveBeenCalledWith(1, 'mod-1');
		});
	});

	describe('updateUserModule', () => {
		it('should update user module progress (happy path)', async () => {
			const updateData = { current_page: 3 };
			vi.mocked(userModuleRepositoryMock.update).mockResolvedValue(true);

			await expect(
				userModuleService.updateUserModule(1, 'mod-1', updateData),
			).resolves.not.toThrow();
			expect(userModuleRepositoryMock.update).toHaveBeenCalledWith(
				1,
				'mod-1',
				updateData,
			);
		});

		it('should throw UserModuleNotFoundError when progress entry not found (unhappy path)', async () => {
			vi.mocked(userModuleRepositoryMock.update).mockResolvedValue(false);

			await expect(
				userModuleService.updateUserModule(1, 'mod-1', { current_page: 3 }),
			).rejects.toThrow(UserModuleNotFoundError);
		});
	});
});
