import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
	CreateQuizQuestionRequest,
	DeleteQuizQuestionRequest,
	GetQuizRequest,
	SubmitQuizRequest,
	UpdateQuizQuestionRequest,
} from '@/models/quizzes/quiz.routes.js';
import type { IQuizService } from '@/models/quizzes/quiz.service.interface.js';

export class QuizController {
	constructor(private readonly quizService: IQuizService) {}

	getQuestions = async (req: FastifyRequest<GetQuizRequest>, reply: FastifyReply): Promise<void> => {
		const questions = await this.quizService.getQuestions(req.params.moduleId);
		reply.status(200).send(questions);
	};

	submit = async (req: FastifyRequest<SubmitQuizRequest>, reply: FastifyReply): Promise<void> => {
		const userId = req.user.sub as number;
		const result = await this.quizService.submitAnswers(req.params.moduleId, userId, req.body.answers);
		reply.status(200).send(result);
	};

	createQuestion = async (req: FastifyRequest<CreateQuizQuestionRequest>, reply: FastifyReply): Promise<void> => {
		const question = await this.quizService.createQuestion({
			module_id: req.params.moduleId,
			...req.body,
		});
		reply.status(201).send(question);
	};

	updateQuestion = async (req: FastifyRequest<UpdateQuizQuestionRequest>, reply: FastifyReply): Promise<void> => {
		const question = await this.quizService.updateQuestion(req.params.questionId, req.body);
		reply.status(200).send(question);
	};

	deleteQuestion = async (req: FastifyRequest<DeleteQuizQuestionRequest>, reply: FastifyReply): Promise<void> => {
		await this.quizService.deleteQuestion(req.params.questionId);
		reply.status(204).send();
	};
}
