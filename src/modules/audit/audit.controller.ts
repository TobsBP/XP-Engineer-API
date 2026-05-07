import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ListAuditRequest } from '@/models/audit/audit.routes.js';
import type { IAuditService } from '@/models/audit/audit.service.interface.js';

export class AuditController {
	constructor(private readonly auditService: IAuditService) {}

	list = async (req: FastifyRequest<ListAuditRequest>, reply: FastifyReply): Promise<void> => {
		const result = await this.auditService.list(req.query);
		reply.status(200).send(result);
	};
}
