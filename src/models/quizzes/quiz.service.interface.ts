import type {
	QuizQuestionResponse,
	QuizResult,
} from '@/models/quizzes/quiz.schema.js';

export interface AnswerInput {
	question_id: number;
	option_id: number;
}

export interface IQuizService {
	getQuestions(moduleId: string): Promise<QuizQuestionResponse[]>;
	submitAnswers(moduleId: string, answers: AnswerInput[]): Promise<QuizResult>;
}
