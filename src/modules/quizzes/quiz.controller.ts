import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
	GetQuizRequest,
	SubmitQuizRequest,
} from '@/models/quizzes/quiz.routes.js';
import type { IQuizService } from '@/models/quizzes/quiz.service.interface.js';
import { QuizNotFoundError } from '@/modules/quizzes/quiz.service.js';

export class QuizController {
	constructor(private readonly quizService: IQuizService) {}

	getQuestions = async (
		req: FastifyRequest<GetQuizRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const questions = await this.quizService.getQuestions(
				req.params.moduleId,
			);
			reply.status(200).send(questions);
		} catch (err) {
			if (err instanceof QuizNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	submit = async (
		req: FastifyRequest<SubmitQuizRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const result = await this.quizService.submitAnswers(
				req.params.moduleId,
				req.body.answers,
			);
			reply.status(200).send(result);
		} catch (err) {
			if (err instanceof QuizNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};
}
