export type ExerciseListRow = {
	id: string;
	title: string;
	subject: string;
	description: string | null;
	questions_count: number;
	difficulty: 'easy' | 'medium' | 'hard';
	pdf_path: string;
	module_id: string | null;
};

export type CreateExerciseListData = {
	id: string;
	title: string;
	subject: string;
	description: string | null;
	questions_count: number;
	difficulty: 'easy' | 'medium' | 'hard';
	pdf_path: string;
	module_id: string | null;
};

export type UpdateExerciseListData = {
	title?: string;
	subject?: string;
	description?: string | null;
	questions_count?: number;
	difficulty?: 'easy' | 'medium' | 'hard';
	module_id?: string | null;
};

export interface IExerciseListRepository {
	findAll(subject?: string): Promise<ExerciseListRow[]>;
	findById(id: string): Promise<ExerciseListRow | null>;
	create(data: CreateExerciseListData): Promise<ExerciseListRow>;
	update(id: string, data: UpdateExerciseListData): Promise<ExerciseListRow | null>;
	delete(id: string): Promise<boolean>;
}
