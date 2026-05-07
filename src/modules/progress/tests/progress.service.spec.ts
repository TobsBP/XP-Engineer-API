import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModuleAlreadyCompletedError, ProgressNotFoundError, QuizScoreInsufficientError } from '@/models/progress/progress.errors.js';
import type { IProgressRepository } from '@/models/progress/progress.repository.interface.js';
import type { IQuizService } from '@/models/quizzes/quiz.service.interface.js';
import type { IStreakService } from '@/models/streak/streak.service.interface.js';
import { ProgressService } from '@/modules/progress/progress.service.js';

describe('ProgressService', () => {
	let progressService: ProgressService;
	let progressRepoMock: IProgressRepository;
	let quizServiceMock: IQuizService;
	let streakServiceMock: IStreakService;

	beforeEach(() => {
		progressRepoMock = {
			findUserModule: vi.fn(),
			updateProgress: vi.fn(),
			completeModule: vi.fn(),
			addXp: vi.fn(),
			updateLevel: vi.fn(),
			getTotalPages: vi.fn(),
		} as unknown as IProgressRepository;

		quizServiceMock = {
			getQuestions: vi.fn(),
			submitAnswers: vi.fn(),
		} as unknown as IQuizService;

		streakServiceMock = {
			registerActivity: vi.fn(),
			getStreak: vi.fn(),
		} as unknown as IStreakService;

		progressService = new ProgressService(progressRepoMock, quizServiceMock, streakServiceMock);
	});

	describe('completeLesson', () => {
		it('should update progress when completing a lesson (happy path)', async () => {
			vi.mocked(progressRepoMock.findUserModule).mockResolvedValue({
				user_id: 1,
				module_id: 'mod-1',
				progress: 0,
				status: 'in_progress',
				current_page: 1,
			});
			vi.mocked(progressRepoMock.getTotalPages).mockResolvedValue(5);
			vi.mocked(progressRepoMock.updateProgress).mockResolvedValue({
				user_id: 1,
				module_id: 'mod-1',
				progress: 20,
				status: 'in_progress',
				current_page: 2,
			});

			const result = await progressService.completeLesson(1, 'mod-1', 1);

			expect(progressRepoMock.findUserModule).toHaveBeenCalledWith(1, 'mod-1');
			expect(progressRepoMock.getTotalPages).toHaveBeenCalledWith('mod-1');
			expect(progressRepoMock.updateProgress).toHaveBeenCalledWith(1, 'mod-1', {
				progress: 20,
				status: 'in_progress',
				current_page: 2,
			});
			expect(result.module_id).toBe('mod-1');
			expect(result.progress).toBe(20);
			expect(result.current_page).toBe(2);
		});

		it('should cap progress at 99 on last lesson', async () => {
			vi.mocked(progressRepoMock.findUserModule).mockResolvedValue({
				user_id: 1,
				module_id: 'mod-1',
				progress: 80,
				status: 'in_progress',
				current_page: 5,
			});
			vi.mocked(progressRepoMock.getTotalPages).mockResolvedValue(5);
			vi.mocked(progressRepoMock.updateProgress).mockResolvedValue({
				user_id: 1,
				module_id: 'mod-1',
				progress: 99,
				status: 'in_progress',
				current_page: 6,
			});

			const result = await progressService.completeLesson(1, 'mod-1', 5);

			expect(result.progress).toBe(99);
		});

		it('should throw ProgressNotFoundError when user module does not exist', async () => {
			vi.mocked(progressRepoMock.findUserModule).mockResolvedValue(null);

			await expect(progressService.completeLesson(1, 'mod-99', 1)).rejects.toThrow(ProgressNotFoundError);
		});
	});

	describe('completeModule', () => {
		it('should complete module and award XP when quiz score >= 80% (happy path)', async () => {
			vi.mocked(progressRepoMock.findUserModule).mockResolvedValue({
				user_id: 1,
				module_id: 'mod-1',
				progress: 99,
				status: 'in_progress',
				current_page: 5,
			});
			vi.mocked(quizServiceMock.submitAnswers).mockResolvedValue({
				total: 5,
				correct: 4,
				score: 80,
				results: [],
			});
			vi.mocked(progressRepoMock.completeModule).mockResolvedValue({
				user_id: 1,
				module_id: 'mod-1',
				progress: 100,
				status: 'completed',
				current_page: 5,
			});
			vi.mocked(progressRepoMock.addXp).mockResolvedValue(200);

			const answers = [
				{ question_id: 1, option_id: 2 },
				{ question_id: 2, option_id: 5 },
				{ question_id: 3, option_id: 8 },
				{ question_id: 4, option_id: 11 },
				{ question_id: 5, option_id: 14 },
			];

			const result = await progressService.completeModule(1, 'mod-1', answers);

			expect(quizServiceMock.submitAnswers).toHaveBeenCalledWith('mod-1', answers);
			expect(progressRepoMock.completeModule).toHaveBeenCalledWith(1, 'mod-1');
			expect(progressRepoMock.addXp).toHaveBeenCalledWith(1, 100);
			expect(result.status).toBe('completed');
			expect(result.score).toBe(80);
			expect(result.xp_earned).toBe(100);
			expect(result.xp_total).toBe(200);
		});

		it('should throw QuizScoreInsufficientError when score < 80%', async () => {
			vi.mocked(progressRepoMock.findUserModule).mockResolvedValue({
				user_id: 1,
				module_id: 'mod-1',
				progress: 99,
				status: 'in_progress',
				current_page: 5,
			});
			vi.mocked(quizServiceMock.submitAnswers).mockResolvedValue({
				total: 5,
				correct: 3,
				score: 60,
				results: [],
			});

			const answers = [{ question_id: 1, option_id: 1 }];

			await expect(progressService.completeModule(1, 'mod-1', answers)).rejects.toThrow(QuizScoreInsufficientError);

			expect(progressRepoMock.completeModule).not.toHaveBeenCalled();
			expect(progressRepoMock.addXp).not.toHaveBeenCalled();
		});

		it('should throw ModuleAlreadyCompletedError when module is already completed', async () => {
			vi.mocked(progressRepoMock.findUserModule).mockResolvedValue({
				user_id: 1,
				module_id: 'mod-1',
				progress: 100,
				status: 'completed',
				current_page: 5,
			});

			const answers = [{ question_id: 1, option_id: 1 }];

			await expect(progressService.completeModule(1, 'mod-1', answers)).rejects.toThrow(ModuleAlreadyCompletedError);

			expect(quizServiceMock.submitAnswers).not.toHaveBeenCalled();
		});

		it('should throw ProgressNotFoundError when user module does not exist', async () => {
			vi.mocked(progressRepoMock.findUserModule).mockResolvedValue(null);

			const answers = [{ question_id: 1, option_id: 1 }];

			await expect(progressService.completeModule(1, 'mod-99', answers)).rejects.toThrow(ProgressNotFoundError);
		});
	});
});
