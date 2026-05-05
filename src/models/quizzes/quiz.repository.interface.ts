export type QuizQuestionRow = {
	id: number;
	module_id: string;
	type: 'multiple_choice' | 'true_false';
	text: string;
};

export type QuizOptionRow = {
	id: number;
	question_id: number;
	text: string;
	is_correct: boolean;
};

export interface IQuizRepository {
	findQuestionsByModule(moduleId: string): Promise<QuizQuestionRow[]>;
	findOptionsByQuestionIds(questionIds: number[]): Promise<QuizOptionRow[]>;
}
