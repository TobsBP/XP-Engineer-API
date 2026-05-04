import type { AnswerInput } from '@/types/interfaces/quizzes/quiz.service.interface.js';
import type {
	LessonCompleteResponse,
	ModuleCompleteResponse,
	UserProgress,
	UserProgressSummary,
} from '@/types/schemas/progress.js';

export interface IProgressService {
	getProgress(userId: number): Promise<UserProgressSummary>;
	getModuleProgress(userId: number, moduleId: string): Promise<UserProgress>;
	completeLesson(
		userId: number,
		moduleId: string,
		page: number,
	): Promise<LessonCompleteResponse>;
	completeModule(
		userId: number,
		moduleId: string,
		answers: AnswerInput[],
	): Promise<ModuleCompleteResponse>;
}
