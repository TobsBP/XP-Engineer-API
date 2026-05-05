import type { FastifyInstance } from 'fastify';
import {
	type CreateModuleRequest,
	createModuleSchema,
	type GetModuleRequest,
	getModuleSchema,
	listModulesSchema,
} from '@/models/modules/module.routes.js';

export const moduleRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('moduleController');

	app.get(
		'/modules',
		{ preHandler: app.authenticate, schema: listModulesSchema },
		controller.list,
	);
	app.get<GetModuleRequest>(
		'/module/:moduleId',
		{ preHandler: app.authenticate, schema: getModuleSchema },
		controller.get,
	);
	app.post<CreateModuleRequest>(
		'/module',
		{ preHandler: app.authenticate, schema: createModuleSchema },
		controller.create,
	);
};
