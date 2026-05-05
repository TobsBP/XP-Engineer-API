import type {
	LessonCompleteResponse,
	ModuleCompleteResponse,
	UserProgress,
	UserProgressSummary,
} from '@/models/progress/progress.schema.js';
import type { AnswerInput } from '@/models/quizzes/quiz.service.interface.js';

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
