import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AppContainer } from '@/lib/container.js';

declare module 'fastify' {
	export interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
		container: AppContainer;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: { sub: number };
		user: { sub: number };
	}
}
