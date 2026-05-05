import type { FastifyInstance } from 'fastify';
import {
	type GetQuizRequest,
	getQuizSchema,
	type SubmitQuizRequest,
	submitQuizSchema,
} from '@/models/quizzes/quiz.routes.js';

export const quizRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('quizController');

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
