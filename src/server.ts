import { fastifyCors } from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { fastifySwagger } from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { type FastifyError, type FastifyReply, type FastifyRequest, fastify } from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';

import { registerAuditHook } from '@/lib/audit-hook.js';
import { buildContainer, registerAwilixContainer } from '@/lib/container.js';
import { connectMongo } from '@/lib/mongo.js';
import { initSentry, Sentry } from '@/lib/sentry.js';
import { AppError } from '@/models/errors.js';
import { routes } from '@/router.js';

initSentry();

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

const container = buildContainer(app);
registerAwilixContainer(app, container);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
	origin: true,
	methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
});

if (!process.env.JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined in .env');
}

app.register(multipart, {
	limits: {
		fileSize: 10 * 1024 * 1024, // 10 MB
		files: 1,
	},
});

app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET,
	sign: {
		expiresIn: '12hrs',
	},
});

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		await request.jwtVerify();
	} catch (err) {
		reply.send(err);
	}
});

app.decorate('requireAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		await request.jwtVerify();
	} catch (err) {
		return reply.send(err);
	}
	if (request.user.role !== 'admin') {
		return reply.code(403).send({ message: 'Acesso restrito a administradores' });
	}
});

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

registerAuditHook(app);

app.setErrorHandler((err: FastifyError, req, reply) => {
	if (err instanceof AppError) {
		return reply.code(err.statusCode).send({ message: err.message });
	}
	if (err.validation) {
		return reply.code(400).send({ message: err.message, issues: err.validation });
	}
	req.log.error({ err }, 'Unhandled error');
	const status = typeof err.statusCode === 'number' ? err.statusCode : 500;
	if (status >= 500) {
		Sentry.captureException(err, {
			tags: { route: req.routeOptions?.url, method: req.method },
			user: req.user ? { id: String(req.user.sub), role: req.user.role } : undefined,
		});
	}
	return reply.code(status).send({
		message: status < 500 ? err.message : 'Erro interno',
	});
});

app.register(routes);

connectMongo()
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection failed:', err));

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('Docs availablee at http://localhost:3333/docs');
});
