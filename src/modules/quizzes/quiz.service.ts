import type { IAchievementService } from '@/models/achievements/achievement.service.interface.js';
import { QuizNotFoundError, QuizQuestionNotFoundError } from '@/models/quizzes/quiz.errors.js';
import type {
	CreateQuizQuestionData,
	IQuizRepository,
	QuizQuestionWithOptions,
	UpdateQuizQuestionData,
} from '@/models/quizzes/quiz.repository.interface.js';
import type { QuizAdminQuestion, QuizQuestionResponse, QuizResult } from '@/models/quizzes/quiz.schema.js';
import type { AnswerInput, IQuizService } from '@/models/quizzes/quiz.service.interface.js';

const ACHIEVEMENT_THRESHOLD = 80;

export class QuizService implements IQuizService {
	constructor(
		private readonly quizRepository: IQuizRepository,
		private readonly achievementService: IAchievementService,
	) {}

	async getQuestions(moduleId: string): Promise<QuizQuestionResponse[]> {
		const questions = await this.quizRepository.findQuestionsByModule(moduleId);
		if (questions.length === 0) throw new QuizNotFoundError(moduleId);

		const questionIds = questions.map((q) => q.id);
		const options = await this.quizRepository.findOptionsByQuestionIds(questionIds);

		return questions.map((q) => ({
			id: q.id,
			type: q.type,
			text: q.text,
			options: options.filter((o) => o.question_id === q.id).map((o) => ({ id: o.id, text: o.text })),
		}));
	}

	async submitAnswers(moduleId: string, userId: number, answers: AnswerInput[]): Promise<QuizResult> {
		const questions = await this.quizRepository.findQuestionsByModule(moduleId);
		if (questions.length === 0) throw new QuizNotFoundError(moduleId);

		const questionIds = questions.map((q) => q.id);
		const options = await this.quizRepository.findOptionsByQuestionIds(questionIds);

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

		const unlocked_achievements = score >= ACHIEVEMENT_THRESHOLD ? await this.achievementService.unlockForModuleIfAny(userId, moduleId) : [];

		return {
			total,
			correct: correctCount,
			score,
			results,
			unlocked_achievements,
		};
	}

	async createQuestion(data: CreateQuizQuestionData): Promise<QuizAdminQuestion> {
		const result = await this.quizRepository.createQuestionWithOptions(data);
		return this.toAdminResponse(result);
	}

	async updateQuestion(id: number, data: UpdateQuizQuestionData): Promise<QuizAdminQuestion> {
		const result = await this.quizRepository.updateQuestion(id, data);
		if (!result) throw new QuizQuestionNotFoundError(id);
		return this.toAdminResponse(result);
	}

	async deleteQuestion(id: number): Promise<void> {
		const deleted = await this.quizRepository.deleteQuestion(id);
		if (!deleted) throw new QuizQuestionNotFoundError(id);
	}

	private toAdminResponse(data: QuizQuestionWithOptions): QuizAdminQuestion {
		return {
			id: data.question.id,
			module_id: data.question.module_id,
			type: data.question.type,
			text: data.question.text,
			options: data.options.map((o) => ({
				id: o.id,
				text: o.text,
				is_correct: o.is_correct,
			})),
		};
	}
}
