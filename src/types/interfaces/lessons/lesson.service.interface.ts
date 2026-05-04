import type { ApplicationItem } from '../../schemas/application-item.js';
import type {
	ConceptExample,
	ConceptItem,
} from '../../schemas/concept-example.js';
import type { Lesson, LessonContent } from '../../schemas/lesson.js';
import type {
	CreateApplicationItemData,
	CreateConceptExampleData,
	CreateConceptItemData,
	CreateLessonData,
} from './lesson.repository.interface.js';

export interface ILessonService {
	getLesson(moduleId: string, page: number): Promise<LessonContent>;
	createLesson(data: CreateLessonData): Promise<Lesson>;
	createConceptItem(data: CreateConceptItemData): Promise<ConceptItem>;
	createConceptExample(data: CreateConceptExampleData): Promise<ConceptExample>;
	createApplicationItem(
		data: CreateApplicationItemData,
	): Promise<ApplicationItem>;
}
