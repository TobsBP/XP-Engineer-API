import type { FastifyInstance } from 'fastify';
import {
	type CreateUserModuleRequest,
	createUserModuleSchema,
	type UpdateUserModuleRequest,
	updateUserModuleSchema,
} from '@/models/user-modules/user-module.routes.js';

export const userModuleRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('userModuleController');

	app.post<CreateUserModuleRequest>('/:moduleId/start', { preHandler: app.authenticate, schema: createUserModuleSchema }, controller.create);
	app.patch<UpdateUserModuleRequest>('/:moduleId/progress', { preHandler: app.authenticate, schema: updateUserModuleSchema }, controller.update);
};
