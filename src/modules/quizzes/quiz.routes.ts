import type { FastifyInstance } from 'fastify';
import {
	type CreateQuizQuestionRequest,
	createQuizQuestionSchema,
	type DeleteQuizQuestionRequest,
	deleteQuizQuestionSchema,
	type GetQuizRequest,
	getQuizSchema,
	type SubmitQuizRequest,
	submitQuizSchema,
	type UpdateQuizQuestionRequest,
	updateQuizQuestionSchema,
} from '@/models/quizzes/quiz.routes.js';

export const quizRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('quizController');

	app.get<GetQuizRequest>('/:moduleId', { preHandler: app.authenticate, schema: getQuizSchema }, controller.getQuestions);

	app.post<SubmitQuizRequest>('/:moduleId/answer', { preHandler: app.authenticate, schema: submitQuizSchema }, controller.submit);

	app.post<CreateQuizQuestionRequest>(
		'/:moduleId/question',
		{ preHandler: app.requireAdmin, schema: createQuizQuestionSchema },
		controller.createQuestion,
	);

	app.patch<UpdateQuizQuestionRequest>(
		'/question/:questionId',
		{ preHandler: app.requireAdmin, schema: updateQuizQuestionSchema },
		controller.updateQuestion,
	);

	app.delete<DeleteQuizQuestionRequest>(
		'/question/:questionId',
		{ preHandler: app.requireAdmin, schema: deleteQuizQuestionSchema },
		controller.deleteQuestion,
	);
};
