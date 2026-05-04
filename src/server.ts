import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwagger } from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { buildApp } from './app.js';

const app = buildApp();

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'XP Engineer API',
			description: 'API for learning platform',
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

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('Docs available at http://localhost:3333/docs');
});

