import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAuditRepository } from '@/models/audit/audit.repository.interface.js';
import { AuditService } from '@/modules/audit/audit.service.js';

describe('AuditService', () => {
	let auditService: AuditService;
	let auditRepositoryMock: IAuditRepository;

	beforeEach(() => {
		auditRepositoryMock = {
			insert: vi.fn(),
			find: vi.fn(),
		} as unknown as IAuditRepository;

		auditService = new AuditService(auditRepositoryMock);
	});

	describe('log', () => {
		it('persists the audit entry with createdAt and the provided fields', async () => {
			vi.mocked(auditRepositoryMock.insert).mockResolvedValue();

			await auditService.log({
				userId: 7,
				userRole: 'admin',
				action: 'update',
				entity: 'user',
				entityId: '42',
				route: '/user/:id',
				method: 'PATCH',
				statusCode: 200,
				ip: '127.0.0.1',
				userAgent: 'vitest',
			});

			expect(auditRepositoryMock.insert).toHaveBeenCalledTimes(1);
			const inserted = vi.mocked(auditRepositoryMock.insert).mock.calls[0][0];
			expect(inserted.userId).toBe(7);
			expect(inserted.action).toBe('update');
			expect(inserted.entity).toBe('user');
			expect(inserted.entityId).toBe('42');
			expect(inserted.createdAt).toBeInstanceOf(Date);
		});

		it('never throws when repository fails (fail-safe)', async () => {
			vi.mocked(auditRepositoryMock.insert).mockRejectedValue(new Error('mongo down'));
			const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			await expect(
				auditService.log({
					userId: 1,
					userRole: 'admin',
					action: 'delete',
					entity: 'lesson',
					method: 'DELETE',
				}),
			).resolves.toBeUndefined();

			expect(errSpy).toHaveBeenCalled();
			errSpy.mockRestore();
		});
	});

	describe('list', () => {
		it('forwards filters and pagination to repository and returns page metadata', async () => {
			vi.mocked(auditRepositoryMock.find).mockResolvedValue({
				items: [
					{
						userId: 1,
						userRole: 'admin',
						action: 'create',
						entity: 'module',
						method: 'POST',
						createdAt: new Date('2026-05-01'),
					},
				],
				total: 1,
			});

			const result = await auditService.list({
				userId: 1,
				entity: 'module',
				action: 'create',
				page: 2,
				pageSize: 10,
			});

			expect(auditRepositoryMock.find).toHaveBeenCalledWith({ userId: 1, entity: 'module', action: 'create' }, { page: 2, pageSize: 10 });
			expect(result.total).toBe(1);
			expect(result.page).toBe(2);
			expect(result.pageSize).toBe(10);
			expect(result.items).toHaveLength(1);
		});

		it('applies default pagination when not provided', async () => {
			vi.mocked(auditRepositoryMock.find).mockResolvedValue({ items: [], total: 0 });

			const result = await auditService.list({});

			expect(auditRepositoryMock.find).toHaveBeenCalledWith({}, { page: 1, pageSize: 20 });
			expect(result.page).toBe(1);
			expect(result.pageSize).toBe(20);
		});
	});
});
