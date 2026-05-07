import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildAuditHookHandler, deriveAction, deriveEntity } from '@/lib/audit-hook.js';
import type { IAuditService } from '@/models/audit/audit.service.interface.js';

describe('audit hook helpers', () => {
	describe('deriveAction', () => {
		it.each([
			['POST', 'create'],
			['PATCH', 'update'],
			['PUT', 'update'],
			['DELETE', 'delete'],
		])('maps %s to %s', (method, expected) => {
			expect(deriveAction(method)).toBe(expected);
		});

		it('returns null for non-mutation methods', () => {
			expect(deriveAction('GET')).toBeNull();
			expect(deriveAction('OPTIONS')).toBeNull();
		});
	});

	describe('deriveEntity', () => {
		it.each([
			['/module', 'module'],
			['/module/:moduleId', 'module'],
			['/lesson/:moduleId', 'lesson'],
			['/lesson/:lessonId/concept-item', 'lesson'],
			['/quiz/:moduleId/question', 'quiz'],
			['/exercise-lists', 'exercise-lists'],
			['/exercise-lists/:id', 'exercise-lists'],
			['/admin/pdf-import', 'pdf-import'],
			['/user/:id', 'user'],
			['/achievement', 'achievement'],
		])('maps %s to %s', (route, expected) => {
			expect(deriveEntity(route)).toBe(expected);
		});

		it('returns null when route does not map to a known entity', () => {
			expect(deriveEntity('/unknown')).toBeNull();
			expect(deriveEntity('/upload')).toBeNull();
			expect(deriveEntity('')).toBeNull();
			expect(deriveEntity('/')).toBeNull();
		});
	});
});

describe('buildAuditHookHandler', () => {
	let auditServiceMock: IAuditService;
	let handler: ReturnType<typeof buildAuditHookHandler>;

	beforeEach(() => {
		auditServiceMock = {
			log: vi.fn().mockResolvedValue(undefined),
			list: vi.fn(),
		};
		handler = buildAuditHookHandler(() => auditServiceMock);
	});

	const baseRequest = {
		method: 'PATCH',
		user: { sub: 5, role: 'admin' as const },
		params: { moduleId: '42' },
		ip: '10.0.0.1',
		headers: { 'user-agent': 'test-agent' },
		routeOptions: { url: '/module/:moduleId' },
	};
	const baseReply = { statusCode: 200 };

	it('logs admin mutations with canonical entity', async () => {
		await handler(baseRequest as never, baseReply as never);

		expect(auditServiceMock.log).toHaveBeenCalledTimes(1);
		const arg = vi.mocked(auditServiceMock.log).mock.calls[0][0];
		expect(arg.entity).toBe('module');
		expect(arg.action).toBe('update');
	});

	it('uses canonical entity for /admin/pdf-import (not "admin")', async () => {
		await handler(
			{
				...baseRequest,
				method: 'POST',
				params: {},
				routeOptions: { url: '/admin/pdf-import' },
			} as never,
			baseReply as never,
		);

		expect(auditServiceMock.log).toHaveBeenCalledTimes(1);
		const arg = vi.mocked(auditServiceMock.log).mock.calls[0][0];
		expect(arg.entity).toBe('pdf-import');
	});

	it('skips when route does not map to a known entity', async () => {
		await handler({ ...baseRequest, routeOptions: { url: '/upload' } } as never, baseReply as never);
		expect(auditServiceMock.log).not.toHaveBeenCalled();
	});

	it('skips non-mutating methods', async () => {
		await handler({ ...baseRequest, method: 'GET' } as never, baseReply as never);
		expect(auditServiceMock.log).not.toHaveBeenCalled();
	});

	it('skips when user is not admin', async () => {
		await handler({ ...baseRequest, user: { sub: 1, role: 'user' as const } } as never, baseReply as never);
		expect(auditServiceMock.log).not.toHaveBeenCalled();
	});

	it('skips when no authenticated user', async () => {
		await handler({ ...baseRequest, user: undefined } as never, baseReply as never);
		expect(auditServiceMock.log).not.toHaveBeenCalled();
	});

	it('skips on error responses (>=400)', async () => {
		await handler(baseRequest as never, { statusCode: 404 } as never);
		expect(auditServiceMock.log).not.toHaveBeenCalled();
	});
});
