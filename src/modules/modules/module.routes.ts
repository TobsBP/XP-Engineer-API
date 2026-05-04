import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { ModuleController } from '@/modules/modules/module.controller.js';
import { ModuleRepository } from '@/modules/modules/module.repository.js';
import { ModuleService } from '@/modules/modules/module.service.js';
import {
	createModuleSchema,
	getModuleSchema,
	listModulesSchema,
} from '@/types/routes/modules.js';

export const moduleRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new ModuleRepository(pool);
	const service = new ModuleService(repository);
	const controller = new ModuleController(service);

	app.get(
		'/modules',
		{ preHandler: app.authenticate, schema: listModulesSchema },
		controller.list,
	);
	app.get('/module/:moduleId', { schema: getModuleSchema }, controller.get);
	app.post('/module', { schema: createModuleSchema }, controller.create);
};
