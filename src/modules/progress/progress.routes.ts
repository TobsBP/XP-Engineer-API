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

	app.get('', { preHandler: app.authenticate, schema: getProgressSchema }, controller.getProgress);

	app.get<GetModuleProgressRequest>('/:moduleId', { preHandler: app.authenticate, schema: getModuleProgressSchema }, controller.getModuleProgress);

	app.post<CompleteLessonRequest>(
		'/:moduleId/lesson/:page/complete',
		{ preHandler: app.authenticate, schema: completeLessonSchema },
		controller.completeLesson,
	);

	app.post<CompleteModuleRequest>('/:moduleId/complete', { preHandler: app.authenticate, schema: completeModuleSchema }, controller.completeModule);
};
