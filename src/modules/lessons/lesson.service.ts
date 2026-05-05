import type { ApplicationItem } from '@/models/lessons/application-item.schema.js';
import type {
	ConceptExample,
	ConceptItem,
} from '@/models/lessons/concept-example.schema.js';
import type {
	ApplicationItemRow,
	ConceptExampleRow,
	ConceptItemRow,
	CreateApplicationItemData,
	CreateConceptExampleData,
	CreateConceptItemData,
	CreateLessonData,
	ILessonRepository,
	LessonRow,
} from '@/models/lessons/lesson.repository.interface.js';
import type { Lesson, LessonContent } from '@/models/lessons/lesson.schema.js';
import type { ILessonService } from '@/models/lessons/lesson.service.interface.js';

export class LessonNotFoundError extends Error {
	constructor(moduleId: string, page: number) {
		super(`Lição não encontrada: módulo '${moduleId}', página ${page}`);
		this.name = 'LessonNotFoundError';
	}
}

export class LessonService implements ILessonService {
	constructor(private readonly lessonRepository: ILessonRepository) {}

	async getLesson(moduleId: string, page: number): Promise<LessonContent> {
		const lessonRow = await this.lessonRepository.findByPage(moduleId, page);
		if (!lessonRow) throw new LessonNotFoundError(moduleId, page);

		const [conceptItems, conceptExamples, applicationItems] = await Promise.all(
			[
				this.lessonRepository.findConceptItems(lessonRow.id),
				this.lessonRepository.findConceptExamples(lessonRow.id),
				this.lessonRepository.findApplicationItems(lessonRow.id),
			],
		);

		return this.toContent(
			lessonRow,
			conceptItems,
			conceptExamples,
			applicationItems,
		);
	}

	async createLesson(data: CreateLessonData): Promise<Lesson> {
		return this.lessonRepository.create(data);
	}

	async createConceptItem(data: CreateConceptItemData): Promise<ConceptItem> {
		return this.lessonRepository.createConceptItem(data);
	}

	async createConceptExample(
		data: CreateConceptExampleData,
	): Promise<ConceptExample> {
		return this.lessonRepository.createConceptExample(data);
	}

	async createApplicationItem(
		data: CreateApplicationItemData,
	): Promise<ApplicationItem> {
		return this.lessonRepository.createApplicationItem(data);
	}

	private toContent(
		lesson: LessonRow,
		conceptItems: ConceptItemRow[],
		conceptExamples: ConceptExampleRow[],
		applicationItems: ApplicationItemRow[],
	): LessonContent {
		const {
			page_number: page,
			total_pages: totalPages,
			module_id: moduleId,
		} = lesson;

		return {
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
