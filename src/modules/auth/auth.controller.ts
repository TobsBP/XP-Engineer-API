import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
	LoginRequest,
	RegisterRequest,
	UpdateMeRequest,
} from '@/models/auth/auth.routes.js';
import type { IStreakService } from '@/models/streak/streak.service.interface.js';
import type { IUserRepository } from '@/models/users/user.repository.interface.js';
import { UserNotFoundError } from '@/modules/users/user.service.js';
import type { AuthService } from './auth.service.js';
import {
	InvalidCredentialsError,
	UserAlreadyExistsError,
} from './auth.service.js';

export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userRepository: IUserRepository,
		private readonly streakService: IStreakService,
	) {}

	register = async (
		req: FastifyRequest<RegisterRequest>,
		reply: FastifyReply,
	) => {
		try {
			const result = await this.authService.register(req.body);
			return reply.status(201).send(result);
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) {
				return reply.status(409).send({ message: error.message });
			}
			throw error;
		}
	};

	login = async (req: FastifyRequest<LoginRequest>, reply: FastifyReply) => {
		try {
			const result = await this.authService.login(req.body);
			return reply.send(result);
		} catch (error) {
			if (error instanceof InvalidCredentialsError) {
				return reply.status(401).send({ message: error.message });
			}
			throw error;
		}
	};

	updateMe = async (
		req: FastifyRequest<UpdateMeRequest>,
		reply: FastifyReply,
	) => {
		try {
			const userId = req.user.sub as number;
			const result = await this.authService.updateMe(userId, req.body);
			return reply.status(200).send(result);
		} catch (error) {
			if (error instanceof InvalidCredentialsError) {
				return reply.status(401).send({ message: error.message });
			}
			if (error instanceof UserAlreadyExistsError) {
				return reply.status(409).send({ message: error.message });
			}
			throw error;
		}
	};

	getMe = async (req: FastifyRequest, reply: FastifyReply) => {
		const userId = req.user.sub as number;
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new UserNotFoundError(userId);
		}

		const { password_hash, ...userResponse } = user;
		const streak = await this.streakService.getStreak(userId);

		return reply.send({
			...userResponse,
			streak,
		});
	};
}
