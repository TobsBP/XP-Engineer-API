import type { Collection, Filter } from 'mongodb';
import type { AuditFilters, AuditLog, AuditPagination, IAuditRepository } from '@/models/audit/audit.repository.interface.js';

export class AuditRepository implements IAuditRepository {
	constructor(private readonly auditCollection: Collection<AuditLog>) {}

	async insert(log: AuditLog): Promise<void> {
		await this.auditCollection.insertOne(log);
	}

	async find(filters: AuditFilters, pagination: AuditPagination): Promise<{ items: AuditLog[]; total: number }> {
		const query: Filter<AuditLog> = {};
		if (filters.userId !== undefined) query.userId = filters.userId;
		if (filters.entity) query.entity = filters.entity;
		if (filters.action) query.action = filters.action;
		if (filters.from || filters.to) {
			query.createdAt = {};
			if (filters.from) query.createdAt.$gte = filters.from;
			if (filters.to) query.createdAt.$lte = filters.to;
		}

		const skip = (pagination.page - 1) * pagination.pageSize;
		const [items, total] = await Promise.all([
			this.auditCollection
				.find(query, { projection: { _id: 0 } })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(pagination.pageSize)
				.toArray(),
			this.auditCollection.countDocuments(query),
		]);

		return { items: items as AuditLog[], total };
	}
}
