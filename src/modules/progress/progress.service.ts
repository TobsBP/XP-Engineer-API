import type { IProgressRepository } from '@/types/interfaces/progress/progress.repository.interface.js';
import type { IProgressService } from '@/types/interfaces/progress/progress.service.interface.js';
import type {
	AnswerInput,
	IQuizService,
} from '@/types/interfaces/quizzes/quiz.service.interface.js';
import type { IStreakService } from '@/types/interfaces/streak/streak.service.interface.js';
import type {
	LessonCompleteResponse,
	ModuleCompleteResponse,
	UserProgress,
	UserProgressSummary,
} from '@/types/schemas/progress.js';
import { calculateLevel } from '@/utils/calc-level.js';

const XP_PER_MODULE = 100;
const MIN_SCORE_TO_PASS = 80;

export class ProgressNotFoundError extends Error {
	constructor(moduleId: string) {
		super(
			`Progresso não encontrado para o módulo '${moduleId}'. Inicie o módulo primeiro.`,
		);
		this.name = 'ProgressNotFoundError';
	}
}

export class QuizScoreInsufficientError extends Error {
	score: number;
	constructor(score: number) {
		super(
			`Nota insuficiente: ${score}%. É necessário pelo menos ${MIN_SCORE_TO_PASS}% para concluir o módulo.`,
		);
		this.name = 'QuizScoreInsufficientError';
		this.score = score;
	}
}

export class ModuleAlreadyCompletedError extends Error {
	constructor(moduleId: string) {
		super(`O módulo '${moduleId}' já foi concluído.`);
		this.name = 'ModuleAlreadyCompletedError';
	}
}

export class ProgressService implements IProgressService {
	constructor(
		private readonly repository: IProgressRepository,
		private readonly quizService: IQuizService,
		private readonly streakService: IStreakService,
	) {}

	async getProgress(userId: number): Promise<UserProgressSummary> {
		const modules = await this.repository.findAllByUser(userId);
		const xpTotal = await this.repository.getXpTotal(userId);

		const modulesCompleted = modules.filter(
			(m) => m.status === 'completed',
		).length;
		const modulesInProgress = modules.filter(
			(m) => m.status === 'in_progress',
		).length;

		return {
			xp_total: xpTotal,
			modules_completed: modulesCompleted,
			modules_in_progress: modulesInProgress,
			modules: modules.map((m) => ({
				module_id: m.module_id,
				module_title: m.module_title,
				subject: m.subject,
				progress: m.progress,
				status: m.status,
				current_page: m.current_page,
				total_pages: m.total_pages,
			})),
		};
	}

	async getModuleProgress(
		userId: number,
		moduleId: string,
	): Promise<UserProgress> {
		const detail = await this.repository.findModuleDetail(userId, moduleId);
		if (!detail) throw new ProgressNotFoundError(moduleId);

		return {
			module_id: detail.module_id,
			module_title: detail.module_title,
			subject: detail.subject,
			progress: detail.progress,
			status: detail.status,
			current_page: detail.current_page,
			total_pages: detail.total_pages,
		};
	}

	async completeLesson(
		userId: number,
		moduleId: string,
		page: number,
	): Promise<LessonCompleteResponse> {
		const userModule = await this.repository.findUserModule(userId, moduleId);
		if (!userModule) throw new ProgressNotFoundError(moduleId);

		if (userModule.status === 'completed') {
			return {
				module_id: moduleId,
				current_page: userModule.current_page,
				progress: userModule.progress,
				status: userModule.status,
			};
		}

		const totalPages = await this.repository.getTotalPages(moduleId);
		const newPage = Math.max(userModule.current_page, page + 1);
		const progress = Math.min(Math.round((page / totalPages) * 100), 99);

		const updated = await this.repository.updateProgress(userId, moduleId, {
			progress,
			status: 'in_progress',
			current_page: newPage,
		});

		if (!updated) throw new ProgressNotFoundError(moduleId);

		await this.streakService.registerActivity(userId);

		return {
			module_id: moduleId,
			current_page: updated.current_page,
			progress: updated.progress,
			status: updated.status,
		};
	}

	async completeModule(
		userId: number,
		moduleId: string,
		answers: AnswerInput[],
	): Promise<ModuleCompleteResponse> {
		const userModule = await this.repository.findUserModule(userId, moduleId);
		if (!userModule) throw new ProgressNotFoundError(moduleId);
		if (userModule.status === 'completed') {
			throw new ModuleAlreadyCompletedError(moduleId);
		}

		const quizResult = await this.quizService.submitAnswers(moduleId, answers);

		if (quizResult.score < MIN_SCORE_TO_PASS) {
			throw new QuizScoreInsufficientError(quizResult.score);
		}

		await this.repository.completeModule(userId, moduleId);
		const xpTotal = await this.repository.addXp(userId, XP_PER_MODULE);

		const newLevel = calculateLevel(xpTotal);
		await this.repository.updateLevel(userId, newLevel);

		await this.streakService.registerActivity(userId);

		return {
			module_id: moduleId,
			status: 'completed',
			score: quizResult.score,
			xp_earned: XP_PER_MODULE,
			xp_total: xpTotal,
		};
	}
}
