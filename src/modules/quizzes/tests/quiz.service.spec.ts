import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IQuizRepository, QuizOptionRow, QuizQuestionRow } from '@/models/quizzes/quiz.repository.interface.js';
import { QuizNotFoundError, QuizService } from '@/modules/quizzes/quiz.service.js';

describe('QuizService', () => {
	let quizService: QuizService;
	let quizRepositoryMock: IQuizRepository;

	const mockQuestions: QuizQuestionRow[] = [
		{ id: 1, module_id: 'mod-1', type: 'multiple_choice', text: 'Qual é 2+2?' },
		{ id: 2, module_id: 'mod-1', type: 'true_false', text: 'O céu é azul.' },
	];

	const mockOptions: QuizOptionRow[] = [
		{ id: 1, question_id: 1, text: '3', is_correct: false },
		{ id: 2, question_id: 1, text: '4', is_correct: true },
		{ id: 3, question_id: 1, text: '5', is_correct: false },
		{ id: 4, question_id: 1, text: '6', is_correct: false },
		{ id: 5, question_id: 2, text: 'Verdadeiro', is_correct: true },
		{ id: 6, question_id: 2, text: 'Falso', is_correct: false },
	];

	beforeEach(() => {
		quizRepositoryMock = {
			findQuestionsByModule: vi.fn(),
			findOptionsByQuestionIds: vi.fn(),
			findQuestionById: vi.fn(),
			createQuestionWithOptions: vi.fn(),
			updateQuestion: vi.fn(),
			deleteQuestion: vi.fn(),
		} as unknown as IQuizRepository;

		quizService = new QuizService(quizRepositoryMock);
	});

	describe('getQuestions', () => {
		it('should return questions with options for a module (happy path)', async () => {
			vi.mocked(quizRepositoryMock.findQuestionsByModule).mockResolvedValue(mockQuestions);
			vi.mocked(quizRepositoryMock.findOptionsByQuestionIds).mockResolvedValue(mockOptions);

			const result = await quizService.getQuestions('mod-1');

			expect(quizRepositoryMock.findQuestionsByModule).toHaveBeenCalledWith('mod-1');
			expect(quizRepositoryMock.findOptionsByQuestionIds).toHaveBeenCalledWith([1, 2]);
			expect(result).toHaveLength(2);
			expect(result[0].id).toBe(1);
			expect(result[0].type).toBe('multiple_choice');
			expect(result[0].text).toBe('Qual é 2+2?');
			expect(result[0].options).toHaveLength(4);
			expect(result[1].options).toHaveLength(2);
		});

		it('should not expose is_correct in the response options', async () => {
			vi.mocked(quizRepositoryMock.findQuestionsByModule).mockResolvedValue(mockQuestions);
			vi.mocked(quizRepositoryMock.findOptionsByQuestionIds).mockResolvedValue(mockOptions);

			const result = await quizService.getQuestions('mod-1');

			for (const question of result) {
				for (const option of question.options) {
					expect(option).not.toHaveProperty('is_correct');
				}
			}
		});

		it('should throw QuizNotFoundError when module has no questions (unhappy path)', async () => {
			vi.mocked(quizRepositoryMock.findQuestionsByModule).mockResolvedValue([]);

			await expect(quizService.getQuestions('mod-99')).rejects.toThrow(QuizNotFoundError);
		});
	});

	describe('submitAnswers', () => {
		it('should return correct results when all answers are right (happy path)', async () => {
			vi.mocked(quizRepositoryMock.findQuestionsByModule).mockResolvedValue(mockQuestions);
			vi.mocked(quizRepositoryMock.findOptionsByQuestionIds).mockResolvedValue(mockOptions);

			const result = await quizService.submitAnswers('mod-1', [
				{ question_id: 1, option_id: 2 },
				{ question_id: 2, option_id: 5 },
			]);

			expect(result.total).toBe(2);
			expect(result.correct).toBe(2);
			expect(result.score).toBe(100);
			expect(result.results[0].correct).toBe(true);
			expect(result.results[0].correct_option_id).toBe(2);
			expect(result.results[1].correct).toBe(true);
			expect(result.results[1].correct_option_id).toBe(5);
		});

		it('should return incorrect results when answers are wrong', async () => {
			vi.mocked(quizRepositoryMock.findQuestionsByModule).mockResolvedValue(mockQuestions);
			vi.mocked(quizRepositoryMock.findOptionsByQuestionIds).mockResolvedValue(mockOptions);

			const result = await quizService.submitAnswers('mod-1', [
				{ question_id: 1, option_id: 1 },
				{ question_id: 2, option_id: 6 },
			]);

			expect(result.total).toBe(2);
			expect(result.correct).toBe(0);
			expect(result.score).toBe(0);
			expect(result.results[0].correct).toBe(false);
			expect(result.results[0].correct_option_id).toBe(2);
			expect(result.results[1].correct).toBe(false);
			expect(result.results[1].correct_option_id).toBe(5);
		});

		it('should calculate partial score correctly', async () => {
			vi.mocked(quizRepositoryMock.findQuestionsByModule).mockResolvedValue(mockQuestions);
			vi.mocked(quizRepositoryMock.findOptionsByQuestionIds).mockResolvedValue(mockOptions);

			const result = await quizService.submitAnswers('mod-1', [
				{ question_id: 1, option_id: 2 },
				{ question_id: 2, option_id: 6 },
			]);

			expect(result.total).toBe(2);
			expect(result.correct).toBe(1);
			expect(result.score).toBe(50);
		});

		it('should throw QuizNotFoundError when module has no questions (unhappy path)', async () => {
			vi.mocked(quizRepositoryMock.findQuestionsByModule).mockResolvedValue([]);

			await expect(quizService.submitAnswers('mod-99', [{ question_id: 1, option_id: 1 }])).rejects.toThrow(QuizNotFoundError);
		});
	});
});
