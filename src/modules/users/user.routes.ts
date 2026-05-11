import type { FastifyInstance } from 'fastify';
import {
	type CreateUserRequest,
	createUserSchema,
	type DeleteUserRequest,
	deleteUserSchema,
	type GetUserRequest,
	getUserSchema,
	type ListUsersRequest,
	listUsersSchema,
	type PatchUserRequest,
	patchUserSchema,
} from '@/models/users/user.routes.js';

export const userRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('userController');

	app.get<ListUsersRequest>('/users', { preHandler: app.requireAdmin, schema: listUsersSchema }, controller.list);
	app.get<GetUserRequest>('/user/:id', { preHandler: app.authenticate, schema: getUserSchema }, controller.get);
	app.post<CreateUserRequest>('/user', { preHandler: app.authenticate, schema: createUserSchema }, controller.create);
	app.patch<PatchUserRequest>('/user/:id', { preHandler: app.authenticate, schema: patchUserSchema }, controller.patch);
	app.delete<DeleteUserRequest>('/user/:id', { preHandler: app.authenticate, schema: deleteUserSchema }, controller.delete);
};
