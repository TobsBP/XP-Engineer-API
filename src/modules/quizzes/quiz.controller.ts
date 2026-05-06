import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
	CreateQuizQuestionRequest,
	DeleteQuizQuestionRequest,
	GetQuizRequest,
	SubmitQuizRequest,
	UpdateQuizQuestionRequest,
} from '@/models/quizzes/quiz.routes.js';
import type { IQuizService } from '@/models/quizzes/quiz.service.interface.js';
import { QuizNotFoundError, QuizQuestionNotFoundError } from '@/modules/quizzes/quiz.service.js';

export class QuizController {
	constructor(private readonly quizService: IQuizService) {}

	getQuestions = async (req: FastifyRequest<GetQuizRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const questions = await this.quizService.getQuestions(req.params.moduleId);
			reply.status(200).send(questions);
		} catch (err) {
			if (err instanceof QuizNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	submit = async (req: FastifyRequest<SubmitQuizRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const result = await this.quizService.submitAnswers(req.params.moduleId, req.body.answers);
			reply.status(200).send(result);
		} catch (err) {
			if (err instanceof QuizNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	createQuestion = async (req: FastifyRequest<CreateQuizQuestionRequest>, reply: FastifyReply): Promise<void> => {
		const question = await this.quizService.createQuestion({
			module_id: req.params.moduleId,
			...req.body,
		});
		reply.status(201).send(question);
	};

	updateQuestion = async (req: FastifyRequest<UpdateQuizQuestionRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const question = await this.quizService.updateQuestion(req.params.questionId, req.body);
			reply.status(200).send(question);
		} catch (err) {
			if (err instanceof QuizQuestionNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	deleteQuestion = async (req: FastifyRequest<DeleteQuizQuestionRequest>, reply: FastifyReply): Promise<void> => {
		try {
			await this.quizService.deleteQuestion(req.params.questionId);
			reply.status(204).send();
		} catch (err) {
			if (err instanceof QuizQuestionNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};
}
