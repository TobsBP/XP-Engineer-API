import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { UserRepository } from '@/modules/users/user.repository.js';
import type { UpdateMeRequest } from '@/types/routes/auth.js';
import {
	getMeSchema,
	loginSchema,
	registerSchema,
	updateMeSchema,
} from '@/types/routes/auth.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

export async function authRoutes(fastify: FastifyInstance) {
	const userRepository = new UserRepository(pool);
	const authService = new AuthService(userRepository, fastify.jwt);
	const authController = new AuthController(authService, userRepository);

	fastify.post(
		'/register',
		{
			schema: registerSchema,
		},
		authController.register,
	);

	fastify.post(
		'/login',
		{
			schema: loginSchema,
		},
		authController.login,
	);

	fastify.patch<UpdateMeRequest>(
		'/me',
		{
			preHandler: fastify.authenticate,
			schema: updateMeSchema,
		},
		authController.updateMe,
	);

	fastify.get(
		'/me',
		{
			preHandler: fastify.authenticate,
			schema: getMeSchema,
		},
		authController.getMe,
	);
}
