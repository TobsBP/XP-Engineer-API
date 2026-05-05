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
	UpdateApplicationItemData,
	UpdateConceptExampleData,
	UpdateConceptItemData,
	UpdateLessonData,
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
	updateLesson(lessonId: number, data: UpdateLessonData): Promise<Lesson>;
	deleteLesson(lessonId: number): Promise<void>;
	updateConceptItem(
		itemId: string,
		data: UpdateConceptItemData,
	): Promise<ConceptItem>;
	deleteConceptItem(itemId: string): Promise<void>;
	updateConceptExample(
		itemId: string,
		data: UpdateConceptExampleData,
	): Promise<ConceptExample>;
	deleteConceptExample(itemId: string): Promise<void>;
	updateApplicationItem(
		itemId: string,
		data: UpdateApplicationItemData,
	): Promise<ApplicationItem>;
	deleteApplicationItem(itemId: string): Promise<void>;
}
