import type { FastifyInstance } from 'fastify';
import { pool } from '../../lib/db.js';
import {
	createApplicationItemSchema,
	createConceptExampleSchema,
	createConceptItemSchema,
	createLessonSchema,
	getLessonSchema,
} from '../../types/routes/lessons.js';
import { LessonController } from './lesson.controller.js';
import { LessonRepository } from './lesson.repository.js';
import { LessonService } from './lesson.service.js';

export const lessonRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new LessonRepository(pool);
	const service = new LessonService(repository);
	const controller = new LessonController(service);

	app.get(
		'/module/:moduleId/lesson/:page',
		{ schema: getLessonSchema },
		controller.get,
	);

	app.post(
		'/module/:moduleId/lesson',
		{ schema: createLessonSchema },
		controller.create,
	);

	app.post(
		'/lesson/:lessonId/concept-item',
		{ schema: createConceptItemSchema },
		controller.createConceptItem,
	);

	app.post(
		'/lesson/:lessonId/concept-example',
		{ schema: createConceptExampleSchema },
		controller.createConceptExample,
	);

	app.post(
		'/lesson/:lessonId/application-item',
		{ schema: createApplicationItemSchema },
		controller.createApplicationItem,
	);
};
