import type { FastifyInstance } from 'fastify';
import {
	type CreateModuleRequest,
	createModuleSchema,
	type DeleteModuleRequest,
	deleteModuleSchema,
	type GetModuleRequest,
	getModuleSchema,
	listModulesSchema,
	type UpdateModuleRequest,
	updateModuleSchema,
} from '@/models/modules/module.routes.js';

export const moduleRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('moduleController');

	app.get('/modules', { preHandler: app.authenticate, schema: listModulesSchema }, controller.list);
	app.get<GetModuleRequest>('/module/:moduleId', { preHandler: app.authenticate, schema: getModuleSchema }, controller.get);
	app.post<CreateModuleRequest>('/module', { preHandler: app.requireAdmin, schema: createModuleSchema }, controller.create);
	app.patch<UpdateModuleRequest>('/module/:moduleId', { preHandler: app.requireAdmin, schema: updateModuleSchema }, controller.update);
	app.delete<DeleteModuleRequest>('/module/:moduleId', { preHandler: app.requireAdmin, schema: deleteModuleSchema }, controller.remove);
};
