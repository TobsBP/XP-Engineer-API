import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { ProgressController } from '@/modules/progress/progress.controller.js';
import { ProgressRepository } from '@/modules/progress/progress.repository.js';
import { ProgressService } from '@/modules/progress/progress.service.js';
import { QuizRepository } from '@/modules/quizzes/quiz.repository.js';
import { QuizService } from '@/modules/quizzes/quiz.service.js';
import {
	type CompleteLessonRequest,
	type CompleteModuleRequest,
	completeLessonSchema,
	completeModuleSchema,
	type GetModuleProgressRequest,
	getModuleProgressSchema,
	getProgressSchema,
} from '@/types/routes/progress.js';

export const progressRoutes = async (app: FastifyInstance): Promise<void> => {
	const progressRepository = new ProgressRepository(pool);
	const quizRepository = new QuizRepository(pool);
	const quizService = new QuizService(quizRepository);
	const service = new ProgressService(progressRepository, quizService);
	const controller = new ProgressController(service);

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
