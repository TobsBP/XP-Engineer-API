import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { UserModuleController } from '@/modules/user-modules/user-module.controller.js';
import { UserModuleRepository } from '@/modules/user-modules/user-module.repository.js';
import { UserModuleService } from '@/modules/user-modules/user-module.service.js';
import {
	type CreateUserModuleRequest,
	createUserModuleSchema,
	type UpdateUserModuleRequest,
	updateUserModuleSchema,
} from '@/types/routes/user-modules.js';

export const userModuleRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new UserModuleRepository(pool);
	const service = new UserModuleService(repository);
	const controller = new UserModuleController(service);

	app.post<CreateUserModuleRequest>(
		'/module/:moduleId/start',
		{ preHandler: app.authenticate, schema: createUserModuleSchema },
		controller.create,
	);
	app.patch<UpdateUserModuleRequest>(
		'/module/:moduleId/progress',
		{ preHandler: app.authenticate, schema: updateUserModuleSchema },
		controller.update,
	);
};
