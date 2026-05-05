export type ExerciseListResponse = {
	id: string;
	title: string;
	subject: string;
	description: string | null;
	questions_count: number;
	difficulty: 'easy' | 'medium' | 'hard';
	pdf_url: string;
};

export interface IExerciseListService {
	listExerciseLists(subject?: string): Promise<ExerciseListResponse[]>;
}
