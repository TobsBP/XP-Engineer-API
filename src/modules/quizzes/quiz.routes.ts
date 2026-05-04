import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { QuizController } from '@/modules/quizzes/quiz.controller.js';
import { QuizRepository } from '@/modules/quizzes/quiz.repository.js';
import { QuizService } from '@/modules/quizzes/quiz.service.js';
import {
	type GetQuizRequest,
	getQuizSchema,
	type SubmitQuizRequest,
	submitQuizSchema,
} from '@/types/routes/quizzes.js';

export const quizRoutes = async (app: FastifyInstance): Promise<void> => {
	const repository = new QuizRepository(pool);
	const service = new QuizService(repository);
	const controller = new QuizController(service);

	app.get<GetQuizRequest>(
		'/quiz/:moduleId',
		{ preHandler: app.authenticate, schema: getQuizSchema },
		controller.getQuestions,
	);

	app.post<SubmitQuizRequest>(
		'/quiz/:moduleId/answer',
		{ preHandler: app.authenticate, schema: submitQuizSchema },
		controller.submit,
	);
};
