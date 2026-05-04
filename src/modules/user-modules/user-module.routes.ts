import type { FastifyInstance } from 'fastify';
import { pool } from '../../lib/db.js';
import {
	createUserModuleSchema,
	updateUserModuleSchema,
} from '../../types/routes/user-modules.js';
import { UserModuleController } from './user-module.controller.js';
import { UserModuleRepository } from './user-module.repository.js';
import { UserModuleService } from './user-module.service.js';

export const userModuleRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new UserModuleRepository(pool);
	const service = new UserModuleService(repository);
	const controller = new UserModuleController(service);

	app.post(
		'/user/:userId/module/:moduleId',
		{ schema: createUserModuleSchema },
		controller.create,
	);
	app.patch(
		'/user/:userId/module/:moduleId',
		{ schema: updateUserModuleSchema },
		controller.update,
	);
};
