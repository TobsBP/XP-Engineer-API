import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AUDIT_ENTITIES, type AuditAction, type AuditEntity } from '@/models/audit/audit.repository.interface.js';
import type { IAuditService } from '@/models/audit/audit.service.interface.js';

export function deriveAction(method: string): AuditAction | null {
	switch (method.toUpperCase()) {
		case 'POST':
			return 'create';
		case 'PATCH':
		case 'PUT':
			return 'update';
		case 'DELETE':
			return 'delete';
		default:
			return null;
	}
}

const SKIPPED_PREFIX_SEGMENTS = new Set(['admin']);

export function deriveEntity(routeUrl: string): AuditEntity | null {
	if (!routeUrl) return null;
	const segments = routeUrl
		.split('/')
		.filter(Boolean)
		.filter((s) => !s.startsWith(':'));
	const candidate = segments.find((s) => !SKIPPED_PREFIX_SEGMENTS.has(s));
	if (!candidate) return null;
	return (AUDIT_ENTITIES as readonly string[]).includes(candidate) ? (candidate as AuditEntity) : null;
}

export function buildAuditHookHandler(getAuditService: () => IAuditService) {
	return async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
		const user = req.user as { sub: number; role: string } | undefined;
		if (!user || user.role !== 'admin') return;
		const action = deriveAction(req.method);
		if (!action) return;
		if (reply.statusCode >= 400) return;

		const routeUrl = req.routeOptions?.url ?? req.url;
		const entity = deriveEntity(routeUrl);
		if (!entity) return;
		const params = (req.params ?? {}) as Record<string, unknown>;
		const rawId = params.id ?? params.moduleId ?? params.lessonId ?? params.questionId;
		const entityId = rawId !== undefined ? String(rawId) : undefined;

		await getAuditService().log({
			userId: user.sub,
			userRole: user.role as 'admin',
			action,
			entity,
			entityId,
			route: routeUrl,
			method: req.method,
			statusCode: reply.statusCode,
			ip: req.ip,
			userAgent: req.headers?.['user-agent'] as string | undefined,
		});
	};
}

export function registerAuditHook(app: FastifyInstance): void {
	const handler = buildAuditHookHandler(() => app.container.resolve('auditService'));
	app.addHook('onResponse', handler);
}
