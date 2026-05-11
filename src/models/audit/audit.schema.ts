import { z } from 'zod';
import { AUDIT_ENTITIES } from '@/models/audit/audit.repository.interface.js';

export const auditQuerySchema = z.object({
	userId: z.coerce.number().int().positive().optional(),
	entity: z.enum(AUDIT_ENTITIES).optional(),
	action: z.enum(['create', 'update', 'delete']).optional(),
	from: z.coerce.date().optional(),
	to: z.coerce.date().optional(),
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const auditLogResponseSchema = z.object({
	userId: z.number(),
	userRole: z.string(),
	action: z.enum(['create', 'update', 'delete']),
	entity: z.enum(AUDIT_ENTITIES),
	entityId: z.string().nullish(),
	route: z.string().nullish(),
	method: z.string(),
	statusCode: z.number().nullish(),
	ip: z.string().nullish(),
	userAgent: z.string().nullish(),
	createdAt: z.date(),
});

export const auditListResponseSchema = z.object({
	items: z.array(auditLogResponseSchema),
	total: z.number(),
	page: z.number(),
	pageSize: z.number(),
});

export type AuditQuery = z.infer<typeof auditQuerySchema>;
