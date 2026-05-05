import type { ApplicationItem } from '@/models/lessons/application-item.schema.js';
import type {
	ConceptExample,
	ConceptItem,
} from '@/models/lessons/concept-example.schema.js';
import type {
	CreateApplicationItemData,
	CreateConceptExampleData,
	CreateConceptItemData,
	CreateLessonData,
} from '@/models/lessons/lesson.repository.interface.js';
import type { Lesson, LessonContent } from '@/models/lessons/lesson.schema.js';

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
