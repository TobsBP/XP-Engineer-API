import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	ModuleNotFoundError,
	ModuleService,
} from '@/modules/modules/module.service.js';
import type {
	IModuleRepository,
	ModuleRow,
} from '@/types/interfaces/modules/module.repository.interface.js';

describe('ModuleService', () => {
	let moduleService: ModuleService;
	let moduleRepositoryMock: IModuleRepository;

	const mockModuleRow: ModuleRow = {
		id: 'mod-1',
		title: 'Module 1',
		subtitle: 'Subtitle 1',
		subject: 'JavaScript',
		progress: 50,
		status: 'active',
		current_page: 2,
		order_index: 0,
		locked_by_default: true,
		min_xp: 0,
	};

	beforeEach(() => {
		moduleRepositoryMock = {
			findAll: vi.fn(),
			findById: vi.fn(),
			create: vi.fn(),
		} as unknown as IModuleRepository;

		moduleService = new ModuleService(moduleRepositoryMock);
	});

	describe('listModules', () => {
		it('should return all modules for a user (happy path)', async () => {
			vi.mocked(moduleRepositoryMock.findAll).mockResolvedValue([
				mockModuleRow,
			]);

			const result = await moduleService.listModules(1);

			expect(moduleRepositoryMock.findAll).toHaveBeenCalledWith(1);
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('mod-1');
			expect(result[0].link).toBe('/module/mod-1/lesson/2');
		});
	});

	describe('getModule', () => {
		it('should return a module when id exists (happy path)', async () => {
			vi.mocked(moduleRepositoryMock.findById).mockResolvedValue(mockModuleRow);

			const result = await moduleService.getModule('mod-1', 1);

			expect(moduleRepositoryMock.findById).toHaveBeenCalledWith('mod-1', 1);
			expect(result.id).toBe('mod-1');
		});

		it('should throw ModuleNotFoundError when module not found (unhappy path)', async () => {
			vi.mocked(moduleRepositoryMock.findById).mockResolvedValue(null);

			await expect(moduleService.getModule('non-existent', 1)).rejects.toThrow(
				ModuleNotFoundError,
			);
		});
	});

	describe('createModule', () => {
		it('should create a module (happy path)', async () => {
			const data = {
				id: 'mod-2',
				title: 'New',
				subtitle: 'New Sub',
				subject: 'TypeScript',
				order_index: 1,
				locked_by_default: false,
			};
			vi.mocked(moduleRepositoryMock.create).mockResolvedValue({
				...data,
				min_xp: 0,
			});

			const result = await moduleService.createModule(data);

			expect(moduleRepositoryMock.create).toHaveBeenCalledWith(data);
			expect(result.id).toBe('mod-2');
		});
	});
});
