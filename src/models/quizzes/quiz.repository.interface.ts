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

export type CreateQuizQuestionData = {
	module_id: string;
	type: 'multiple_choice' | 'true_false';
	text: string;
	options: { text: string; is_correct: boolean }[];
};

export type UpdateQuizQuestionData = {
	type?: 'multiple_choice' | 'true_false';
	text?: string;
	options?: { text: string; is_correct: boolean }[];
};

export type QuizQuestionWithOptions = {
	question: QuizQuestionRow;
	options: QuizOptionRow[];
};

export interface IQuizRepository {
	findQuestionsByModule(moduleId: string): Promise<QuizQuestionRow[]>;
	findOptionsByQuestionIds(questionIds: number[]): Promise<QuizOptionRow[]>;
	findQuestionById(id: number): Promise<QuizQuestionWithOptions | null>;
	createQuestionWithOptions(
		data: CreateQuizQuestionData,
	): Promise<QuizQuestionWithOptions>;
	updateQuestion(
		id: number,
		data: UpdateQuizQuestionData,
	): Promise<QuizQuestionWithOptions | null>;
	deleteQuestion(id: number): Promise<boolean>;
}
