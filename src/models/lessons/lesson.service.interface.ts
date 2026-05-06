import type {
	CreateApplicationItemData,
	CreateConceptExampleData,
	CreateConceptItemData,
	CreatedApplicationItemRow,
	CreatedConceptExampleRow,
	CreatedConceptItemRow,
	CreateLessonData,
	UpdateApplicationItemData,
	UpdateConceptExampleData,
	UpdateConceptItemData,
	UpdateLessonData,
} from '@/models/lessons/lesson.repository.interface.js';
import type { Lesson, LessonContent } from '@/models/lessons/lesson.schema.js';

export interface ILessonService {
	getAllLessons(moduleId: string): Promise<LessonContent[]>;
	getLesson(moduleId: string, page: number): Promise<LessonContent>;
	createLesson(data: CreateLessonData): Promise<Lesson>;
	createConceptItem(data: CreateConceptItemData): Promise<CreatedConceptItemRow>;
	createConceptExample(data: CreateConceptExampleData): Promise<CreatedConceptExampleRow>;
	createApplicationItem(data: CreateApplicationItemData): Promise<CreatedApplicationItemRow>;
	updateLesson(lessonId: number, data: UpdateLessonData): Promise<Lesson>;
	deleteLesson(lessonId: number): Promise<void>;
	updateConceptItem(itemId: string, data: UpdateConceptItemData): Promise<CreatedConceptItemRow>;
	deleteConceptItem(itemId: string): Promise<void>;
	updateConceptExample(itemId: string, data: UpdateConceptExampleData): Promise<CreatedConceptExampleRow>;
	deleteConceptExample(itemId: string): Promise<void>;
	updateApplicationItem(itemId: string, data: UpdateApplicationItemData): Promise<CreatedApplicationItemRow>;
	deleteApplicationItem(itemId: string): Promise<void>;
}
