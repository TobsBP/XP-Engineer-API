import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AppContainer } from '@/lib/container.js';
import type { UserRole } from '@/models/users/user.repository.interface.js';

declare module 'fastify' {
	export interface FastifyInstance {
		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		container: AppContainer;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: { sub: number; role: UserRole };
		user: { sub: number; role: UserRole };
	}
}
