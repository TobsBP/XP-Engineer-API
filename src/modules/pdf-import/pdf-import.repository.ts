import type { Pool, PoolClient } from 'pg';
import type { z } from 'zod';
import type { GeminiImportData } from '@/lib/gemini.js';
import type { IPdfImportRepository } from '@/models/pdf-import/pdf-import.repository.interface.js';
import type {
	ImportedApplicationItemSchema,
	ImportedConceptExampleSchema,
	ImportedConceptItemSchema,
	PdfImportResult,
} from '@/models/pdf-import/pdf-import.schema.js';

type ConceptItemRow = z.infer<typeof ImportedConceptItemSchema>;
type ConceptExampleRow = z.infer<typeof ImportedConceptExampleSchema>;
type ApplicationItemRow = z.infer<typeof ImportedApplicationItemSchema>;

export class PdfImportRepository implements IPdfImportRepository {
	constructor(private readonly pool: Pool) {}

	async importAll(data: GeminiImportData): Promise<PdfImportResult> {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');

			const module = await this.insertModule(client, data.module);
			const lessons = await this.insertLessons(client, module.id, data.lessons);
			const quiz_questions = await this.insertQuizQuestions(client, module.id, data.quiz_questions);

			await client.query('COMMIT');
			return { module, lessons, quiz_questions };
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}

	private async insertModule(client: PoolClient, data: GeminiImportData['module']) {
		const { rows } = await client.query(
			`INSERT INTO modules (id, title, subtitle, subject, order_index, locked_by_default, min_xp)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, title, subtitle, subject, order_index, locked_by_default, min_xp`,
			[data.id, data.title, data.subtitle, data.subject, data.order_index, data.locked_by_default, data.min_xp],
		);
		return rows[0];
	}

	private async insertLessons(client: PoolClient, moduleId: string, lessons: GeminiImportData['lessons']) {
		const result = [];
		for (const lessonData of lessons) {
			const { rows } = await client.query(
				`INSERT INTO lessons (module_id, title, intro, hero_caption, concepts_title, applications_title, footer_cta)
				VALUES ($1, $2, $3, $4, $5, $6, $7)
				RETURNING id, module_id, page_number, title, intro, hero_caption, concepts_title, applications_title, footer_cta`,
				[
					moduleId,
					lessonData.title,
					lessonData.intro,
					lessonData.hero_caption ?? null,
					lessonData.concepts_title,
					lessonData.applications_title,
					lessonData.footer_cta,
				],
			);
			const lesson = rows[0];
			const items = await this.insertLessonItems(client, lesson.id, lessonData);
			result.push({ ...lesson, ...items });
		}
		return result;
	}

	private async insertLessonItems(client: PoolClient, lessonId: number, data: GeminiImportData['lessons'][number]) {
		const concept_items: ConceptItemRow[] = [];
		for (const item of data.concept_items) {
			const { rows } = await client.query<ConceptItemRow>(
				`INSERT INTO concept_items (lesson_id, title, description, latex)
				VALUES ($1, $2, $3, $4)
				RETURNING id, lesson_id, title, description, latex, order_index`,
				[lessonId, item.title, item.description, item.latex ?? null],
			);
			concept_items.push(rows[0]);
		}

		const concept_examples: ConceptExampleRow[] = [];
		for (const ex of data.concept_examples) {
			const { rows } = await client.query<ConceptExampleRow>(
				`INSERT INTO concept_examples (lesson_id, label, latex)
				VALUES ($1, $2, $3)
				RETURNING id, lesson_id, label, latex, order_index`,
				[lessonId, ex.label, ex.latex],
			);
			concept_examples.push(rows[0]);
		}

		const application_items: ApplicationItemRow[] = [];
		for (const item of data.application_items) {
			const { rows } = await client.query<ApplicationItemRow>(
				`INSERT INTO application_items (lesson_id, title, description, latex)
				VALUES ($1, $2, $3, $4)
				RETURNING id, lesson_id, title, description, latex, order_index`,
				[lessonId, item.title, item.description, item.latex ?? null],
			);
			application_items.push(rows[0]);
		}

		return { concept_items, concept_examples, application_items };
	}

	private async insertQuizQuestions(client: PoolClient, moduleId: string, questions: GeminiImportData['quiz_questions']) {
		const result = [];
		for (const q of questions) {
			const { rows: qRows } = await client.query(
				`INSERT INTO quiz_questions (module_id, type, text)
				VALUES ($1, $2, $3)
				RETURNING id, module_id, type, text`,
				[moduleId, q.type, q.text],
			);
			const question = qRows[0];

			const options = [];
			for (const opt of q.options) {
				const { rows: optRows } = await client.query(
					`INSERT INTO quiz_options (question_id, text, is_correct)
					VALUES ($1, $2, $3)
					RETURNING id, question_id, text, is_correct`,
					[question.id, opt.text, opt.is_correct],
				);
				options.push(optRows[0]);
			}
			result.push({ ...question, options });
		}
		return result;
	}
}
