import type { FastifyInstance } from 'fastify';
import { type ListAuditRequest, listAuditSchema } from '@/models/audit/audit.routes.js';

export const auditRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('auditController');

	app.get<ListAuditRequest>(
		'',
		{
			preHandler: app.requireAdmin,
			schema: listAuditSchema,
		},
		controller.list,
	);
};
