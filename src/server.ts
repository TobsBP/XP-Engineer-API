import { fastifyCors } from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { type FastifyReply, type FastifyRequest, fastify } from 'fastify';
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { routes } from '@/router.js';

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
	origin: true,
	methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
});

if (!process.env.JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined in .env');
}

app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET,
	sign: {
		expiresIn: '12hrs',
	},
});

app.decorate(
	'authenticate',
	async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	},
);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: '',
			description: '',
			version: '1.0.0',
		},
		security: [{ bearerAuth: [] }],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
	routePrefix: '/docs',
});

app.register(routes);

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('Docs availablee at http://localhost:3333/docs');
});
