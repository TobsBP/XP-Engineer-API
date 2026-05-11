export type LessonRow = {
	id: number;
	module_id: string;
	page_number: number;
	title: string;
	intro: string;
	hero_caption: string | null;
	concepts_title: string;
	applications_title: string;
	footer_cta: string;
	module_subtitle: string;
	total_pages: number;
};

export type ConceptItemRow = {
	id: string;
	title: string;
	description: string;
	latex: string | null;
	code: string | null;
	code_language: string | null;
};

export type ConceptExampleRow = {
	id: string;
	label: string;
	latex: string;
	code: string | null;
	code_language: string | null;
};

export type ApplicationItemRow = {
	id: string;
	title: string;
	description: string;
	latex: string | null;
	code: string | null;
	code_language: string | null;
};

export type CreateLessonData = {
	module_id: string;
	title: string;
	intro: string;
	hero_caption?: string;
	concepts_title: string;
	applications_title: string;
	footer_cta: string;
};

export type CreatedLessonRow = {
	id: number;
	module_id: string;
	page_number: number;
	title: string;
	intro: string;
	hero_caption: string | null;
	concepts_title: string;
	applications_title: string;
	footer_cta: string;
};

export type CreateConceptItemData = {
	lesson_id: number;
	title: string;
	description: string;
	latex: string | null;
	code?: string | null;
	code_language?: string | null;
};

export type CreatedConceptItemRow = {
	id: string;
	lesson_id: number;
	title: string;
	description: string;
	latex: string | null;
	code: string | null;
	code_language: string | null;
	order_index: number;
};

export type CreateConceptExampleData = {
	lesson_id: number;
	label: string;
	latex: string;
	code?: string | null;
	code_language?: string | null;
};

export type CreatedConceptExampleRow = {
	id: string;
	lesson_id: number;
	label: string;
	latex: string;
	code: string | null;
	code_language: string | null;
	order_index: number;
};

export type CreateApplicationItemData = {
	lesson_id: number;
	title: string;
	description: string;
	latex: string | null;
	code?: string | null;
	code_language?: string | null;
};

export type CreatedApplicationItemRow = {
	id: string;
	lesson_id: number;
	title: string;
	description: string;
	latex: string | null;
	code: string | null;
	code_language: string | null;
	order_index: number;
};

export type UpdateLessonData = {
	page_number?: number;
	title?: string;
	intro?: string;
	hero_caption?: string | null;
	concepts_title?: string;
	applications_title?: string;
	footer_cta?: string;
};

export type UpdateConceptItemData = {
	title?: string;
	description?: string;
	latex?: string | null;
	code?: string | null;
	code_language?: string | null;
	order_index?: number;
};

export type UpdateConceptExampleData = {
	label?: string;
	latex?: string;
	code?: string | null;
	code_language?: string | null;
	order_index?: number;
};

export type UpdateApplicationItemData = {
	title?: string;
	description?: string;
	latex?: string | null;
	code?: string | null;
	code_language?: string | null;
	order_index?: number;
};

export interface ILessonRepository {
	findAllByModule(moduleId: string): Promise<LessonRow[]>;
	findByPage(moduleId: string, page: number): Promise<LessonRow | null>;
	findConceptItems(lessonId: number): Promise<ConceptItemRow[]>;
	findConceptExamples(lessonId: number): Promise<ConceptExampleRow[]>;
	findApplicationItems(lessonId: number): Promise<ApplicationItemRow[]>;
	create(data: CreateLessonData): Promise<CreatedLessonRow>;
	createConceptItem(data: CreateConceptItemData): Promise<CreatedConceptItemRow>;
	createConceptExample(data: CreateConceptExampleData): Promise<CreatedConceptExampleRow>;
	createApplicationItem(data: CreateApplicationItemData): Promise<CreatedApplicationItemRow>;
	updateLesson(lessonId: number, data: UpdateLessonData): Promise<CreatedLessonRow | null>;
	deleteLesson(lessonId: number): Promise<boolean>;
	updateConceptItem(itemId: string, data: UpdateConceptItemData): Promise<CreatedConceptItemRow | null>;
	deleteConceptItem(itemId: string): Promise<boolean>;
	updateConceptExample(itemId: string, data: UpdateConceptExampleData): Promise<CreatedConceptExampleRow | null>;
	deleteConceptExample(itemId: string): Promise<boolean>;
	updateApplicationItem(itemId: string, data: UpdateApplicationItemData): Promise<CreatedApplicationItemRow | null>;
	deleteApplicationItem(itemId: string): Promise<boolean>;
}
