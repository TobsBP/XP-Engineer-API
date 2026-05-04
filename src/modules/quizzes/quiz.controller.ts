import type { FastifyReply, FastifyRequest } from 'fastify';
import { QuizNotFoundError } from '@/modules/quizzes/quiz.service.js';
import type { IQuizService } from '@/types/interfaces/quizzes/quiz.service.interface.js';
import type {
	GetQuizRequest,
	SubmitQuizRequest,
} from '@/types/routes/quizzes.js';

export class QuizController {
	constructor(private readonly service: IQuizService) {}

	getQuestions = async (
		req: FastifyRequest<GetQuizRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const questions = await this.service.getQuestions(req.params.moduleId);
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
			const result = await this.service.submitAnswers(
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
