import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { UserController } from '@/modules/users/user.controller.js';
import { UserRepository } from '@/modules/users/user.repository.js';
import { UserService } from '@/modules/users/user.service.js';
import {
	type CreateUserRequest,
	createUserSchema,
	type DeleteUserRequest,
	deleteUserSchema,
	type GetUserRequest,
	getUserSchema,
	type PatchUserRequest,
	patchUserSchema,
} from '@/types/routes/users.js';

export const userRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new UserRepository(pool);
	const service = new UserService(repository);
	const controller = new UserController(service);

	app.get<GetUserRequest>(
		'/user/:id',
		{ preHandler: app.authenticate, schema: getUserSchema },
		controller.get,
	);
	app.post<CreateUserRequest>(
		'/user',
		{ preHandler: app.authenticate, schema: createUserSchema },
		controller.create,
	);
	app.patch<PatchUserRequest>(
		'/user/:id',
		{ preHandler: app.authenticate, schema: patchUserSchema },
		controller.patch,
	);
	app.delete<DeleteUserRequest>(
		'/user/:id',
		{ preHandler: app.authenticate, schema: deleteUserSchema },
		controller.delete,
	);
};
