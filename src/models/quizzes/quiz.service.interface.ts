import type { CreateQuizQuestionData, UpdateQuizQuestionData } from '@/models/quizzes/quiz.repository.interface.js';
import type { QuizAdminQuestion, QuizQuestionResponse, QuizResult } from '@/models/quizzes/quiz.schema.js';

export interface AnswerInput {
	question_id: number;
	option_id: number;
}

export interface IQuizService {
	getQuestions(moduleId: string): Promise<QuizQuestionResponse[]>;
	submitAnswers(moduleId: string, userId: number, answers: AnswerInput[]): Promise<QuizResult>;
	createQuestion(data: CreateQuizQuestionData): Promise<QuizAdminQuestion>;
	updateQuestion(id: number, data: UpdateQuizQuestionData): Promise<QuizAdminQuestion>;
	deleteQuestion(id: number): Promise<void>;
}
