import { MIN_SCORE_TO_PASS, XP_PER_MODULE } from '@/models/progress/progress.constants.js';
import { ModuleAlreadyCompletedError, ProgressNotFoundError, QuizScoreInsufficientError } from '@/models/progress/progress.errors.js';
import type { IProgressRepository } from '@/models/progress/progress.repository.interface.js';
import type { LessonCompleteResponse, ModuleCompleteResponse, UserProgress, UserProgressSummary } from '@/models/progress/progress.schema.js';
import type { IProgressService } from '@/models/progress/progress.service.interface.js';
import type { AnswerInput, IQuizService } from '@/models/quizzes/quiz.service.interface.js';
import type { IStreakService } from '@/models/streak/streak.service.interface.js';
import { calculateLevel } from '@/utils/calc-level.js';

export class ProgressService implements IProgressService {
	constructor(
		private readonly progressRepository: IProgressRepository,
		private readonly quizService: IQuizService,
		private readonly streakService: IStreakService,
	) {}

	async getProgress(userId: number): Promise<UserProgressSummary> {
		const modules = await this.progressRepository.findAllByUser(userId);
		const xpTotal = await this.progressRepository.getXpTotal(userId);

		const modulesCompleted = modules.filter((m) => m.status === 'completed').length;
		const modulesInProgress = modules.filter((m) => m.status === 'in_progress').length;

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

	async getModuleProgress(userId: number, moduleId: string): Promise<UserProgress> {
		const detail = await this.progressRepository.findModuleDetail(userId, moduleId);
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

	async completeLesson(userId: number, moduleId: string, page: number): Promise<LessonCompleteResponse> {
		const userModule = await this.progressRepository.findUserModule(userId, moduleId);
		if (!userModule) throw new ProgressNotFoundError(moduleId);

		if (userModule.status === 'completed') {
			return {
				module_id: moduleId,
				current_page: userModule.current_page,
				progress: userModule.progress,
				status: userModule.status,
			};
		}

		const totalPages = await this.progressRepository.getTotalPages(moduleId);
		const newPage = Math.max(userModule.current_page, page + 1);
		const progress = Math.min(Math.round((page / totalPages) * 100), 99);

		const updated = await this.progressRepository.updateProgress(userId, moduleId, {
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

	async completeModule(userId: number, moduleId: string, answers: AnswerInput[]): Promise<ModuleCompleteResponse> {
		const userModule = await this.progressRepository.findUserModule(userId, moduleId);
		if (!userModule) throw new ProgressNotFoundError(moduleId);
		if (userModule.status === 'completed') {
			throw new ModuleAlreadyCompletedError(moduleId);
		}

		const quizResult = await this.quizService.submitAnswers(moduleId, userId, answers);

		if (quizResult.score < MIN_SCORE_TO_PASS) {
			throw new QuizScoreInsufficientError(quizResult.score);
		}

		await this.progressRepository.completeModule(userId, moduleId);
		const xpTotal = await this.progressRepository.addXp(userId, XP_PER_MODULE);

		const newLevel = calculateLevel(xpTotal);
		await this.progressRepository.updateLevel(userId, newLevel);

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
