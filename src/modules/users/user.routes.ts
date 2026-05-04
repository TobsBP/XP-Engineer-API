import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { UserController } from '@/modules/users/user.controller.js';
import { UserRepository } from '@/modules/users/user.repository.js';
import { UserService } from '@/modules/users/user.service.js';
import {
	createUserSchema,
	deleteUserSchema,
	getUserSchema,
	patchUserSchema,
} from '@/types/routes/users.js';

export const userRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new UserRepository(pool);
	const service = new UserService(repository);
	const controller = new UserController(service);

	app.get('/user/:id', { schema: getUserSchema }, controller.get);
	app.post('/user', { schema: createUserSchema }, controller.create);
	app.patch('/user/:id', { schema: patchUserSchema }, controller.patch);
	app.delete('/user/:id', { schema: deleteUserSchema }, controller.delete);
};
