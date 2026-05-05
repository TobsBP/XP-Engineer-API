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
};

export type ConceptExampleRow = {
	id: string;
	label: string;
	latex: string;
};

export type ApplicationItemRow = {
	id: string;
	title: string;
	description: string;
	latex: string | null;
};

export type CreateLessonData = {
	module_id: string;
	page_number: number;
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
	id: string;
	lesson_id: number;
	title: string;
	description: string;
	latex: string | null;
	order_index: number;
};

export type CreateConceptExampleData = {
	id: string;
	lesson_id: number;
	label: string;
	latex: string;
	order_index: number;
};

export type CreateApplicationItemData = {
	id: string;
	lesson_id: number;
	title: string;
	description: string;
	latex: string | null;
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
	order_index?: number;
};

export type UpdateConceptExampleData = {
	label?: string;
	latex?: string;
	order_index?: number;
};

export type UpdateApplicationItemData = {
	title?: string;
	description?: string;
	latex?: string | null;
	order_index?: number;
};

export interface ILessonRepository {
	findByPage(moduleId: string, page: number): Promise<LessonRow | null>;
	findConceptItems(lessonId: number): Promise<ConceptItemRow[]>;
	findConceptExamples(lessonId: number): Promise<ConceptExampleRow[]>;
	findApplicationItems(lessonId: number): Promise<ApplicationItemRow[]>;
	create(data: CreateLessonData): Promise<CreatedLessonRow>;
	createConceptItem(
		data: CreateConceptItemData,
	): Promise<CreateConceptItemData>;
	createConceptExample(
		data: CreateConceptExampleData,
	): Promise<CreateConceptExampleData>;
	createApplicationItem(
		data: CreateApplicationItemData,
	): Promise<CreateApplicationItemData>;
	updateLesson(
		lessonId: number,
		data: UpdateLessonData,
	): Promise<CreatedLessonRow | null>;
	deleteLesson(lessonId: number): Promise<boolean>;
	updateConceptItem(
		itemId: string,
		data: UpdateConceptItemData,
	): Promise<CreateConceptItemData | null>;
	deleteConceptItem(itemId: string): Promise<boolean>;
	updateConceptExample(
		itemId: string,
		data: UpdateConceptExampleData,
	): Promise<CreateConceptExampleData | null>;
	deleteConceptExample(itemId: string): Promise<boolean>;
	updateApplicationItem(
		itemId: string,
		data: UpdateApplicationItemData,
	): Promise<CreateApplicationItemData | null>;
	deleteApplicationItem(itemId: string): Promise<boolean>;
}
