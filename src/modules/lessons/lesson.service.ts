import type {
	ApplicationItemRow,
	ConceptExampleRow,
	ConceptItemRow,
	CreateApplicationItemData,
	CreateConceptExampleData,
	CreateConceptItemData,
	CreatedApplicationItemRow,
	CreatedConceptExampleRow,
	CreatedConceptItemRow,
	CreateLessonData,
	ILessonRepository,
	LessonRow,
	UpdateApplicationItemData,
	UpdateConceptExampleData,
	UpdateConceptItemData,
	UpdateLessonData,
} from '@/models/lessons/lesson.repository.interface.js';
import type { Lesson, LessonContent } from '@/models/lessons/lesson.schema.js';
import type { ILessonService } from '@/models/lessons/lesson.service.interface.js';

export class LessonNotFoundError extends Error {
	constructor(moduleId: string, page: number) {
		super(`Lição não encontrada: módulo '${moduleId}', página ${page}`);
		this.name = 'LessonNotFoundError';
	}
}

export class LessonByIdNotFoundError extends Error {
	constructor(id: number) {
		super(`Lição '${id}' não encontrada`);
		this.name = 'LessonByIdNotFoundError';
	}
}

export class ConceptItemNotFoundError extends Error {
	constructor(id: string) {
		super(`Item de conceito '${id}' não encontrado`);
		this.name = 'ConceptItemNotFoundError';
	}
}

export class ConceptExampleNotFoundError extends Error {
	constructor(id: string) {
		super(`Exemplo de conceito '${id}' não encontrado`);
		this.name = 'ConceptExampleNotFoundError';
	}
}

export class ApplicationItemNotFoundError extends Error {
	constructor(id: string) {
		super(`Item de aplicação '${id}' não encontrado`);
		this.name = 'ApplicationItemNotFoundError';
	}
}

export class LessonService implements ILessonService {
	constructor(private readonly lessonRepository: ILessonRepository) {}

	async getAllLessons(moduleId: string): Promise<LessonContent[]> {
		const lessons = await this.lessonRepository.findAllByModule(moduleId);
		return Promise.all(
			lessons.map(async (lessonRow) => {
				const [conceptItems, conceptExamples, applicationItems] = await Promise.all([
					this.lessonRepository.findConceptItems(lessonRow.id),
					this.lessonRepository.findConceptExamples(lessonRow.id),
					this.lessonRepository.findApplicationItems(lessonRow.id),
				]);
				return this.toContent(lessonRow, conceptItems, conceptExamples, applicationItems);
			}),
		);
	}

	async getLesson(moduleId: string, page: number): Promise<LessonContent> {
		const lessonRow = await this.lessonRepository.findByPage(moduleId, page);
		if (!lessonRow) throw new LessonNotFoundError(moduleId, page);

		const [conceptItems, conceptExamples, applicationItems] = await Promise.all([
			this.lessonRepository.findConceptItems(lessonRow.id),
			this.lessonRepository.findConceptExamples(lessonRow.id),
			this.lessonRepository.findApplicationItems(lessonRow.id),
		]);

		return this.toContent(lessonRow, conceptItems, conceptExamples, applicationItems);
	}

	async createLesson(data: CreateLessonData): Promise<Lesson> {
		return this.lessonRepository.create(data);
	}

	async createConceptItem(data: CreateConceptItemData): Promise<CreatedConceptItemRow> {
		return this.lessonRepository.createConceptItem(data);
	}

	async createConceptExample(data: CreateConceptExampleData): Promise<CreatedConceptExampleRow> {
		return this.lessonRepository.createConceptExample(data);
	}

	async createApplicationItem(data: CreateApplicationItemData): Promise<CreatedApplicationItemRow> {
		return this.lessonRepository.createApplicationItem(data);
	}

	async updateLesson(lessonId: number, data: UpdateLessonData): Promise<Lesson> {
		const updated = await this.lessonRepository.updateLesson(lessonId, data);
		if (!updated) throw new LessonByIdNotFoundError(lessonId);
		return updated;
	}

	async deleteLesson(lessonId: number): Promise<void> {
		const deleted = await this.lessonRepository.deleteLesson(lessonId);
		if (!deleted) throw new LessonByIdNotFoundError(lessonId);
	}

	async updateConceptItem(itemId: string, data: UpdateConceptItemData): Promise<CreatedConceptItemRow> {
		const updated = await this.lessonRepository.updateConceptItem(itemId, data);
		if (!updated) throw new ConceptItemNotFoundError(itemId);
		return updated;
	}

	async deleteConceptItem(itemId: string): Promise<void> {
		const deleted = await this.lessonRepository.deleteConceptItem(itemId);
		if (!deleted) throw new ConceptItemNotFoundError(itemId);
	}

	async updateConceptExample(itemId: string, data: UpdateConceptExampleData): Promise<CreatedConceptExampleRow> {
		const updated = await this.lessonRepository.updateConceptExample(itemId, data);
		if (!updated) throw new ConceptExampleNotFoundError(itemId);
		return updated;
	}

	async deleteConceptExample(itemId: string): Promise<void> {
		const deleted = await this.lessonRepository.deleteConceptExample(itemId);
		if (!deleted) throw new ConceptExampleNotFoundError(itemId);
	}

	async updateApplicationItem(itemId: string, data: UpdateApplicationItemData): Promise<CreatedApplicationItemRow> {
		const updated = await this.lessonRepository.updateApplicationItem(itemId, data);
		if (!updated) throw new ApplicationItemNotFoundError(itemId);
		return updated;
	}

	async deleteApplicationItem(itemId: string): Promise<void> {
		const deleted = await this.lessonRepository.deleteApplicationItem(itemId);
		if (!deleted) throw new ApplicationItemNotFoundError(itemId);
	}

	private toContent(
		lesson: LessonRow,
		conceptItems: ConceptItemRow[],
		conceptExamples: ConceptExampleRow[],
		applicationItems: ApplicationItemRow[],
	): LessonContent {
		const { page_number: page, total_pages: totalPages, module_id: moduleId } = lesson;

		return {
			id: lesson.id,
			header: {
				module: lesson.module_subtitle,
				title: lesson.title,
			},
			hero: {
				caption: lesson.hero_caption ?? '',
			},
			intro: lesson.intro,
			sections: {
				concepts: {
					title: lesson.concepts_title,
					items: conceptItems.map((ci) => ({
						id: ci.id,
						title: ci.title,
						description: ci.description,
						...(ci.latex !== null && { latex: ci.latex }),
					})),
					...(conceptExamples.length > 0 && {
						examples: conceptExamples.map((ce) => ({
							id: ce.id,
							label: ce.label,
							latex: ce.latex,
						})),
					}),
				},
				applications: {
					title: lesson.applications_title,
					items: applicationItems.map((ai) => ({
						id: ai.id,
						title: ai.title,
						description: ai.description,
						...(ai.latex !== null && { latex: ai.latex }),
					})),
				},
			},
			footer: {
				cta: lesson.footer_cta,
			},
			navigation: {
				...(page > 1 && { prevPage: `/module/${moduleId}/lesson/${page - 1}` }),
				...(page < totalPages && {
					nextPage: `/module/${moduleId}/lesson/${page + 1}`,
				}),
				isLastPage: page === totalPages,
			},
		};
	}
}
