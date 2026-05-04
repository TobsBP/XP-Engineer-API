import type { QuizQuestionResponse, QuizResult } from '@/types/schemas/quiz.js';

export interface AnswerInput {
	question_id: number;
	option_id: number;
}

export interface IQuizService {
	getQuestions(moduleId: string): Promise<QuizQuestionResponse[]>;
	submitAnswers(moduleId: string, answers: AnswerInput[]): Promise<QuizResult>;
}
