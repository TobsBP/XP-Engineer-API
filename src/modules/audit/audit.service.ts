import type { AuditListResult, AuditLogInput, IAuditRepository } from '@/models/audit/audit.repository.interface.js';
import type { AuditListInput, IAuditService } from '@/models/audit/audit.service.interface.js';

export class AuditService implements IAuditService {
	constructor(private readonly auditRepository: IAuditRepository) {}

	async log(input: AuditLogInput): Promise<void> {
		try {
			await this.auditRepository.insert({ ...input, createdAt: new Date() });
		} catch (err) {
			console.error('[audit] failed to persist log entry:', err);
		}
	}

	async list(input: AuditListInput): Promise<AuditListResult> {
		const { page = 1, pageSize = 20, ...filters } = input;
		const { items, total } = await this.auditRepository.find(filters, { page, pageSize });
		return { items, total, page, pageSize };
	}
}
