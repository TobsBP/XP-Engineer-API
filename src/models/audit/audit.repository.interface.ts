import type { UserRole } from '@/models/users/user.repository.interface.js';

export type AuditAction = 'create' | 'update' | 'delete';

export const AUDIT_ENTITIES = ['user', 'module', 'lesson', 'quiz', 'achievement', 'exercise-lists', 'pdf-import'] as const;
export type AuditEntity = (typeof AUDIT_ENTITIES)[number];

export type AuditLogInput = {
	userId: number;
	userRole: UserRole;
	action: AuditAction;
	entity: AuditEntity;
	entityId?: string;
	route?: string;
	method: string;
	statusCode?: number;
	ip?: string;
	userAgent?: string;
};

export type AuditLog = AuditLogInput & {
	createdAt: Date;
};

export type AuditFilters = {
	userId?: number;
	entity?: AuditEntity;
	action?: AuditAction;
	from?: Date;
	to?: Date;
};

export type AuditPagination = {
	page: number;
	pageSize: number;
};

export type AuditListResult = {
	items: AuditLog[];
	total: number;
	page: number;
	pageSize: number;
};

export interface IAuditRepository {
	insert(log: AuditLog): Promise<void>;
	find(filters: AuditFilters, pagination: AuditPagination): Promise<{ items: AuditLog[]; total: number }>;
}
