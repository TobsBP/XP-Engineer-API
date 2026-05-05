import type { FastifyInstance } from 'fastify';
import type { UpdateMeRequest } from '@/models/auth/auth.routes.js';
import {
	getMeSchema,
	loginSchema,
	registerSchema,
	updateMeSchema,
} from '@/models/auth/auth.routes.js';

export async function authRoutes(fastify: FastifyInstance) {
	const controller = fastify.container.resolve('authController');

	fastify.post(
		'/register',
		{
			schema: registerSchema,
		},
		controller.register,
	);

	fastify.post(
		'/login',
		{
			schema: loginSchema,
		},
		controller.login,
	);

	fastify.patch<UpdateMeRequest>(
		'/me',
		{
			preHandler: fastify.authenticate,
			schema: updateMeSchema,
		},
		controller.updateMe,
	);

	fastify.get(
		'/me',
		{
			preHandler: fastify.authenticate,
			schema: getMeSchema,
		},
		controller.getMe,
	);
}
