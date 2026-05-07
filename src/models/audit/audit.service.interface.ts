import type { AuditFilters, AuditListResult, AuditLogInput } from '@/models/audit/audit.repository.interface.js';

export type AuditListInput = AuditFilters & {
	page?: number;
	pageSize?: number;
};

export interface IAuditService {
	log(input: AuditLogInput): Promise<void>;
	list(input: AuditListInput): Promise<AuditListResult>;
}
