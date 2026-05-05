import type { FastifyInstance } from 'fastify';
import {
	type CreateApplicationItemRequest,
	type CreateConceptExampleRequest,
	type CreateConceptItemRequest,
	type CreateLessonRequest,
	createApplicationItemSchema,
	createConceptExampleSchema,
	createConceptItemSchema,
	createLessonSchema,
	type GetLessonRequest,
	getLessonSchema,
} from '@/models/lessons/lesson.routes.js';

export const lessonRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('lessonController');

	app.get<GetLessonRequest>(
		'/:moduleId/:page',
		{ preHandler: app.authenticate, schema: getLessonSchema },
		controller.get,
	);

	app.post<CreateLessonRequest>(
		'/:moduleId',
		{ preHandler: app.authenticate, schema: createLessonSchema },
		controller.create,
	);

	app.post<CreateConceptItemRequest>(
		'/:lessonId/concept-item',
		{ preHandler: app.authenticate, schema: createConceptItemSchema },
		controller.createConceptItem,
	);

	app.post<CreateConceptExampleRequest>(
		'/:lessonId/concept-example',
		{ preHandler: app.authenticate, schema: createConceptExampleSchema },
		controller.createConceptExample,
	);

	app.post<CreateApplicationItemRequest>(
		'/:lessonId/application-item',
		{ preHandler: app.authenticate, schema: createApplicationItemSchema },
		controller.createApplicationItem,
	);
};
