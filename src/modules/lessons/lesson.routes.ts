import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { LessonController } from '@/modules/lessons/lesson.controller.js';
import { LessonRepository } from '@/modules/lessons/lesson.repository.js';
import { LessonService } from '@/modules/lessons/lesson.service.js';
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
} from '@/types/routes/lessons.js';

export const lessonRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new LessonRepository(pool);
	const service = new LessonService(repository);
	const controller = new LessonController(service);

	app.get<GetLessonRequest>(
		'/lesson/:moduleId/:page',
		{ preHandler: app.authenticate, schema: getLessonSchema },
		controller.get,
	);

	app.post<CreateLessonRequest>(
		'/lesson/:moduleId',
		{ preHandler: app.authenticate, schema: createLessonSchema },
		controller.create,
	);

	app.post<CreateConceptItemRequest>(
		'/lesson/:lessonId/concept-item',
		{ preHandler: app.authenticate, schema: createConceptItemSchema },
		controller.createConceptItem,
	);

	app.post<CreateConceptExampleRequest>(
		'/lesson/:lessonId/concept-example',
		{ preHandler: app.authenticate, schema: createConceptExampleSchema },
		controller.createConceptExample,
	);

	app.post<CreateApplicationItemRequest>(
		'/lesson/:lessonId/application-item',
		{ preHandler: app.authenticate, schema: createApplicationItemSchema },
		controller.createApplicationItem,
	);
};
