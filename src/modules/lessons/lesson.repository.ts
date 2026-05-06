import type { Pool } from 'pg';
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
	CreatedLessonRow,
	CreateLessonData,
	ILessonRepository,
	LessonRow,
	UpdateApplicationItemData,
	UpdateConceptExampleData,
	UpdateConceptItemData,
	UpdateLessonData,
} from '@/models/lessons/lesson.repository.interface.js';

export class LessonRepository implements ILessonRepository {
	constructor(private readonly pool: Pool) {}

	async findAllByModule(moduleId: string): Promise<LessonRow[]> {
		const { rows } = await this.pool.query<LessonRow>(
			`SELECT
				l.id, l.module_id, l.page_number, l.title, l.intro,
				l.hero_caption, l.concepts_title, l.applications_title, l.footer_cta,
				m.subtitle AS module_subtitle,
				(SELECT COUNT(*)::int FROM lessons WHERE module_id = $1) AS total_pages
			FROM lessons l
			JOIN modules m ON l.module_id = m.id
			WHERE l.module_id = $1
			ORDER BY l.page_number`,
			[moduleId],
		);
		return rows;
	}

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
			`INSERT INTO lessons (module_id, title, intro, hero_caption, concepts_title, applications_title, footer_cta)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, module_id, page_number, title, intro, hero_caption, concepts_title, applications_title, footer_cta`,
			[
				data.module_id,
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
	): Promise<CreatedConceptItemRow> {
		const { rows } = await this.pool.query<CreatedConceptItemRow>(
			`INSERT INTO concept_items (lesson_id, title, description, latex)
			VALUES ($1, $2, $3, $4)
			RETURNING id, lesson_id, title, description, latex, order_index`,
			[data.lesson_id, data.title, data.description, data.latex],
		);
		return rows[0];
	}

	async createConceptExample(
		data: CreateConceptExampleData,
	): Promise<CreatedConceptExampleRow> {
		const { rows } = await this.pool.query<CreatedConceptExampleRow>(
			`INSERT INTO concept_examples (lesson_id, label, latex)
			VALUES ($1, $2, $3)
			RETURNING id, lesson_id, label, latex, order_index`,
			[data.lesson_id, data.label, data.latex],
		);
		return rows[0];
	}

	async createApplicationItem(
		data: CreateApplicationItemData,
	): Promise<CreatedApplicationItemRow> {
		const { rows } = await this.pool.query<CreatedApplicationItemRow>(
			`INSERT INTO application_items (lesson_id, title, description, latex)
			VALUES ($1, $2, $3, $4)
			RETURNING id, lesson_id, title, description, latex, order_index`,
			[data.lesson_id, data.title, data.description, data.latex],
		);
		return rows[0];
	}

	async updateLesson(
		lessonId: number,
		data: UpdateLessonData,
	): Promise<CreatedLessonRow | null> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) {
			const { rows } = await this.pool.query<CreatedLessonRow>(
				`SELECT id, module_id, page_number, title, intro, hero_caption, concepts_title, applications_title, footer_cta
				FROM lessons WHERE id = $1`,
				[lessonId],
			);
			return rows[0] ?? null;
		}
		const set = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
		const { rows } = await this.pool.query<CreatedLessonRow>(
			`UPDATE lessons SET ${set}
			WHERE id = $1
			RETURNING id, module_id, page_number, title, intro, hero_caption, concepts_title, applications_title, footer_cta`,
			[lessonId, ...entries.map(([, v]) => v)],
		);
		return rows[0] ?? null;
	}

	async deleteLesson(lessonId: number): Promise<boolean> {
		const { rowCount } = await this.pool.query(
			'DELETE FROM lessons WHERE id = $1',
			[lessonId],
		);
		return (rowCount ?? 0) > 0;
	}

	async updateConceptItem(
		itemId: string,
		data: UpdateConceptItemData,
	): Promise<CreatedConceptItemRow | null> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) {
			const { rows } = await this.pool.query<CreatedConceptItemRow>(
				`SELECT id, lesson_id, title, description, latex, order_index
				FROM concept_items WHERE id = $1`,
				[itemId],
			);
			return rows[0] ?? null;
		}
		const set = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
		const { rows } = await this.pool.query<CreatedConceptItemRow>(
			`UPDATE concept_items SET ${set}
			WHERE id = $1
			RETURNING id, lesson_id, title, description, latex, order_index`,
			[itemId, ...entries.map(([, v]) => v)],
		);
		return rows[0] ?? null;
	}

	async deleteConceptItem(itemId: string): Promise<boolean> {
		const { rowCount } = await this.pool.query(
			'DELETE FROM concept_items WHERE id = $1',
			[itemId],
		);
		return (rowCount ?? 0) > 0;
	}

	async updateConceptExample(
		itemId: string,
		data: UpdateConceptExampleData,
	): Promise<CreatedConceptExampleRow | null> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) {
			const { rows } = await this.pool.query<CreatedConceptExampleRow>(
				`SELECT id, lesson_id, label, latex, order_index
				FROM concept_examples WHERE id = $1`,
				[itemId],
			);
			return rows[0] ?? null;
		}
		const set = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
		const { rows } = await this.pool.query<CreatedConceptExampleRow>(
			`UPDATE concept_examples SET ${set}
			WHERE id = $1
			RETURNING id, lesson_id, label, latex, order_index`,
			[itemId, ...entries.map(([, v]) => v)],
		);
		return rows[0] ?? null;
	}

	async deleteConceptExample(itemId: string): Promise<boolean> {
		const { rowCount } = await this.pool.query(
			'DELETE FROM concept_examples WHERE id = $1',
			[itemId],
		);
		return (rowCount ?? 0) > 0;
	}

	async updateApplicationItem(
		itemId: string,
		data: UpdateApplicationItemData,
	): Promise<CreatedApplicationItemRow | null> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) {
			const { rows } = await this.pool.query<CreatedApplicationItemRow>(
				`SELECT id, lesson_id, title, description, latex, order_index
				FROM application_items WHERE id = $1`,
				[itemId],
			);
			return rows[0] ?? null;
		}
		const set = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
		const { rows } = await this.pool.query<CreatedApplicationItemRow>(
			`UPDATE application_items SET ${set}
			WHERE id = $1
			RETURNING id, lesson_id, title, description, latex, order_index`,
			[itemId, ...entries.map(([, v]) => v)],
		);
		return rows[0] ?? null;
	}

	async deleteApplicationItem(itemId: string): Promise<boolean> {
		const { rowCount } = await this.pool.query(
			'DELETE FROM application_items WHERE id = $1',
			[itemId],
		);
		return (rowCount ?? 0) > 0;
	}
}
