import type { UpdateExerciseListData } from '@/models/exercise-lists/exercise-list.repository.interface.js';

export type ExerciseListResponse = {
	id: string;
	title: string;
	subject: string;
	description: string | null;
	questions_count: number;
	difficulty: 'easy' | 'medium' | 'hard';
	pdf_url: string;
};

export type CreateExerciseListInput = {
	title: string;
	subject: string;
	description: string | null;
	questions_count: number;
	difficulty: 'easy' | 'medium' | 'hard';
	module_id: string | null;
	pdf_buffer: Buffer;
};

export interface IExerciseListService {
	listExerciseLists(subject?: string): Promise<ExerciseListResponse[]>;
	createExerciseList(data: CreateExerciseListInput): Promise<ExerciseListResponse>;
	updateExerciseList(id: string, data: UpdateExerciseListData): Promise<ExerciseListResponse>;
	deleteExerciseList(id: string): Promise<void>;
}
