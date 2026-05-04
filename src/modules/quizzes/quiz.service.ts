import type { IQuizRepository } from '@/types/interfaces/quizzes/quiz.repository.interface.js';
import type {
	AnswerInput,
	IQuizService,
} from '@/types/interfaces/quizzes/quiz.service.interface.js';
import type { QuizQuestionResponse, QuizResult } from '@/types/schemas/quiz.js';

export class QuizNotFoundError extends Error {
	constructor(moduleId: string) {
		super(`Nenhuma pergunta encontrada para o módulo '${moduleId}'`);
		this.name = 'QuizNotFoundError';
	}
}

export class QuizService implements IQuizService {
	constructor(private readonly repository: IQuizRepository) {}

	async getQuestions(moduleId: string): Promise<QuizQuestionResponse[]> {
		const questions = await this.repository.findQuestionsByModule(moduleId);
		if (questions.length === 0) throw new QuizNotFoundError(moduleId);

		const questionIds = questions.map((q) => q.id);
		const options = await this.repository.findOptionsByQuestionIds(questionIds);

		return questions.map((q) => ({
			id: q.id,
			type: q.type,
			text: q.text,
			options: options
				.filter((o) => o.question_id === q.id)
				.map((o) => ({ id: o.id, text: o.text })),
		}));
	}

	async submitAnswers(
		moduleId: string,
		answers: AnswerInput[],
	): Promise<QuizResult> {
		const questions = await this.repository.findQuestionsByModule(moduleId);
		if (questions.length === 0) throw new QuizNotFoundError(moduleId);

		const questionIds = questions.map((q) => q.id);
		const options = await this.repository.findOptionsByQuestionIds(questionIds);

		const correctOptionMap = new Map<number, number>();
		for (const opt of options) {
			if (opt.is_correct) {
				correctOptionMap.set(opt.question_id, opt.id);
			}
		}

		const results = answers.map((answer) => {
			const correctOptionId = correctOptionMap.get(answer.question_id);
			return {
				question_id: answer.question_id,
				correct: answer.option_id === correctOptionId,
				correct_option_id: correctOptionId ?? 0,
			};
		});

		const correctCount = results.filter((r) => r.correct).length;
		const total = results.length;
		const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;

		return {
			total,
			correct: correctCount,
			score,
			results,
		};
	}
}
