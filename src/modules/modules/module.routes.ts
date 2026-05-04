import type { FastifyInstance } from 'fastify';
import { pool } from '../../lib/db.js';
import {
	createModuleSchema,
	getModuleSchema,
	listModulesSchema,
} from '../../types/routes/modules.js';
import { ModuleController } from '../modules/module.controller.js';
import { ModuleService } from '../modules/module.service.js';
import { ModuleRepository } from './module.repository.js';

export const moduleRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new ModuleRepository(pool);
	const service = new ModuleService(repository);
	const controller = new ModuleController(service);

	app.get('/modules', { schema: listModulesSchema }, controller.list);
	app.get('/module/:moduleId', { schema: getModuleSchema }, controller.get);
	app.post('/modules', { schema: createModuleSchema }, controller.create);
};
