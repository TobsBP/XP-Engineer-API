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
	type DeleteApplicationItemRequest,
	type DeleteConceptExampleRequest,
	type DeleteConceptItemRequest,
	type DeleteLessonRequest,
	deleteApplicationItemSchema,
	deleteConceptExampleSchema,
	deleteConceptItemSchema,
	deleteLessonSchema,
	type GetAllLessonsRequest,
	type GetLessonRequest,
	getLessonSchema,
	getSingleLessonSchema,
	type UpdateApplicationItemRequest,
	type UpdateConceptExampleRequest,
	type UpdateConceptItemRequest,
	type UpdateLessonRequest,
	updateApplicationItemSchema,
	updateConceptExampleSchema,
	updateConceptItemSchema,
	updateLessonSchema,
} from '@/models/lessons/lesson.routes.js';

export const lessonRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('lessonController');

	app.get<GetAllLessonsRequest>(
		'/:moduleId',
		{ preHandler: app.authenticate, schema: getLessonSchema },
		controller.get,
	);

	app.get<GetLessonRequest>(
		'/:moduleId/:page',
		{ preHandler: app.authenticate, schema: getSingleLessonSchema },
		controller.getSingle,
	);

	app.post<CreateLessonRequest>(
		'/:moduleId',
		{ preHandler: app.requireAdmin, schema: createLessonSchema },
		controller.create,
	);

	app.post<CreateConceptItemRequest>(
		'/:lessonId/concept-item',
		{ preHandler: app.requireAdmin, schema: createConceptItemSchema },
		controller.createConceptItem,
	);

	app.post<CreateConceptExampleRequest>(
		'/:lessonId/concept-example',
		{ preHandler: app.requireAdmin, schema: createConceptExampleSchema },
		controller.createConceptExample,
	);

	app.post<CreateApplicationItemRequest>(
		'/:lessonId/application-item',
		{ preHandler: app.requireAdmin, schema: createApplicationItemSchema },
		controller.createApplicationItem,
	);

	app.patch<UpdateLessonRequest>(
		'/:lessonId',
		{ preHandler: app.requireAdmin, schema: updateLessonSchema },
		controller.updateLesson,
	);

	app.delete<DeleteLessonRequest>(
		'/:lessonId',
		{ preHandler: app.requireAdmin, schema: deleteLessonSchema },
		controller.deleteLesson,
	);

	app.patch<UpdateConceptItemRequest>(
		'/concept-item/:itemId',
		{ preHandler: app.requireAdmin, schema: updateConceptItemSchema },
		controller.updateConceptItem,
	);

	app.delete<DeleteConceptItemRequest>(
		'/concept-item/:itemId',
		{ preHandler: app.requireAdmin, schema: deleteConceptItemSchema },
		controller.deleteConceptItem,
	);

	app.patch<UpdateConceptExampleRequest>(
		'/concept-example/:itemId',
		{ preHandler: app.requireAdmin, schema: updateConceptExampleSchema },
		controller.updateConceptExample,
	);

	app.delete<DeleteConceptExampleRequest>(
		'/concept-example/:itemId',
		{ preHandler: app.requireAdmin, schema: deleteConceptExampleSchema },
		controller.deleteConceptExample,
	);

	app.patch<UpdateApplicationItemRequest>(
		'/application-item/:itemId',
		{ preHandler: app.requireAdmin, schema: updateApplicationItemSchema },
		controller.updateApplicationItem,
	);

	app.delete<DeleteApplicationItemRequest>(
		'/application-item/:itemId',
		{ preHandler: app.requireAdmin, schema: deleteApplicationItemSchema },
		controller.deleteApplicationItem,
	);
};
