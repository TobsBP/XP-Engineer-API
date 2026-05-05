import type { FastifyInstance } from 'fastify';
import {
	type CompleteLessonRequest,
	type CompleteModuleRequest,
	completeLessonSchema,
	completeModuleSchema,
	type GetModuleProgressRequest,
	getModuleProgressSchema,
	getProgressSchema,
} from '@/models/progress/progress.routes.js';

export const progressRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('progressController');

	app.get(
		'/progress',
		{ preHandler: app.authenticate, schema: getProgressSchema },
		controller.getProgress,
	);

	app.get<GetModuleProgressRequest>(
		'/progress/:moduleId',
		{ preHandler: app.authenticate, schema: getModuleProgressSchema },
		controller.getModuleProgress,
	);

	app.post<CompleteLessonRequest>(
		'/progress/:moduleId/lesson/:page/complete',
		{ preHandler: app.authenticate, schema: completeLessonSchema },
		controller.completeLesson,
	);

	app.post<CompleteModuleRequest>(
		'/progress/:moduleId/complete',
		{ preHandler: app.authenticate, schema: completeModuleSchema },
		controller.completeModule,
	);
};
