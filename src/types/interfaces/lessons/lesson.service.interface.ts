import type {
	CreateApplicationItemData,
	CreateConceptExampleData,
	CreateConceptItemData,
	CreateLessonData,
} from '@/types/interfaces/lessons/lesson.repository.interface.js';
import type { ApplicationItem } from '@/types/schemas/application-item.js';
import type {
	ConceptExample,
	ConceptItem,
} from '@/types/schemas/concept-example.js';
import type { Lesson, LessonContent } from '@/types/schemas/lesson.js';

export interface ILessonService {
	getLesson(
		moduleId: string,
		page: number,
		userId: number,
	): Promise<LessonContent>;
	createLesson(data: CreateLessonData): Promise<Lesson>;
	createConceptItem(data: CreateConceptItemData): Promise<ConceptItem>;
	createConceptExample(data: CreateConceptExampleData): Promise<ConceptExample>;
	createApplicationItem(
		data: CreateApplicationItemData,
	): Promise<ApplicationItem>;
}
