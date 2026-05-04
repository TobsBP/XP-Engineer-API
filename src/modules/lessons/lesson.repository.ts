import type { Pool } from 'pg';
import type {
	ApplicationItemRow,
	ConceptExampleRow,
	ConceptItemRow,
	CreateApplicationItemData,
	CreateConceptExampleData,
	CreateConceptItemData,
	CreatedLessonRow,
	CreateLessonData,
	ILessonRepository,
	LessonRow,
} from '@/types/interfaces/lessons/lesson.repository.interface.js';

export class LessonRepository implements ILessonRepository {
	constructor(private readonly pool: Pool) {}

	async findByPage(moduleId: string, page: number): Promise<LessonRow | null> {
		const { rows } = await this.pool.query<LessonRow>(
			`SELECT
				l.id, l.module_id, l.page_number, l.title, l.intro,
				l.hero_caption, l.concepts_title, l.applications_title, l.footer_cta,
				m.subtitle AS module_subtitle,
				(SELECT COUNT(*)::int FROM lessons WHERE module_id = $1) AS total_pages
			FROM lessons l
			JOIN modules m ON l.module_id = m.id
			WHERE l.module_id = $1 AND l.page_number = $2`,
			[moduleId, page],
		);
		return rows[0] ?? null;
	}

	async findConceptItems(lessonId: number): Promise<ConceptItemRow[]> {
		const { rows } = await this.pool.query<ConceptItemRow>(
			`SELECT id, title, description, latex
			FROM concept_items
			WHERE lesson_id = $1
			ORDER BY order_index`,
			[lessonId],
		);
		return rows;
	}

	async findConceptExamples(lessonId: number): Promise<ConceptExampleRow[]> {
		const { rows } = await this.pool.query<ConceptExampleRow>(
			`SELECT id, label, latex
			FROM concept_examples
			WHERE lesson_id = $1
			ORDER BY order_index`,
			[lessonId],
		);
		return rows;
	}

	async findApplicationItems(lessonId: number): Promise<ApplicationItemRow[]> {
		const { rows } = await this.pool.query<ApplicationItemRow>(
			`SELECT id, title, description, latex
			FROM application_items
			WHERE lesson_id = $1
			ORDER BY order_index`,
			[lessonId],
		);
		return rows;
	}

	async create(data: CreateLessonData): Promise<CreatedLessonRow> {
		const { rows } = await this.pool.query<CreatedLessonRow>(
			`INSERT INTO lessons (module_id, page_number, title, intro, hero_caption, concepts_title, applications_title, footer_cta)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id, module_id, page_number, title, intro, hero_caption, concepts_title, applications_title, footer_cta`,
			[
				data.module_id,
				data.page_number,
				data.title,
				data.intro,
				data.hero_caption ?? null,
				data.concepts_title,
				data.applications_title,
				data.footer_cta,
			],
		);
		return rows[0];
	}

	async createConceptItem(
		data: CreateConceptItemData,
	): Promise<CreateConceptItemData> {
		const { rows } = await this.pool.query<CreateConceptItemData>(
			`INSERT INTO concept_items (id, lesson_id, title, description, latex, order_index)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING id, lesson_id, title, description, latex, order_index`,
			[
				data.id,
				data.lesson_id,
				data.title,
				data.description,
				data.latex ?? null,
				data.order_index,
			],
		);
		return rows[0];
	}

	async createConceptExample(
		data: CreateConceptExampleData,
	): Promise<CreateConceptExampleData> {
		const { rows } = await this.pool.query<CreateConceptExampleData>(
			`INSERT INTO concept_examples (id, lesson_id, label, latex, order_index)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, lesson_id, label, latex, order_index`,
			[data.id, data.lesson_id, data.label, data.latex, data.order_index],
		);
		return rows[0];
	}

	async createApplicationItem(
		data: CreateApplicationItemData,
	): Promise<CreateApplicationItemData> {
		const { rows } = await this.pool.query<CreateApplicationItemData>(
			`INSERT INTO application_items (id, lesson_id, title, description, latex, order_index)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING id, lesson_id, title, description, latex, order_index`,
			[
				data.id,
				data.lesson_id,
				data.title,
				data.description,
				data.latex ?? null,
				data.order_index,
			],
		);
		return rows[0];
	}
}
