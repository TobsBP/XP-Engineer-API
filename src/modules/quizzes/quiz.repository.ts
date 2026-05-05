import type { Pool, PoolClient } from 'pg';
import type {
	CreateQuizQuestionData,
	IQuizRepository,
	QuizOptionRow,
	QuizQuestionRow,
	QuizQuestionWithOptions,
	UpdateQuizQuestionData,
} from '@/models/quizzes/quiz.repository.interface.js';

export class QuizRepository implements IQuizRepository {
	constructor(private readonly pool: Pool) {}

	async findQuestionsByModule(moduleId: string): Promise<QuizQuestionRow[]> {
		const { rows } = await this.pool.query<QuizQuestionRow>(
			`SELECT id, module_id, type, text
			FROM quiz_questions
			WHERE module_id = $1
			ORDER BY id`,
			[moduleId],
		);
		return rows;
	}

	async findOptionsByQuestionIds(
		questionIds: number[],
	): Promise<QuizOptionRow[]> {
		if (questionIds.length === 0) return [];
		const { rows } = await this.pool.query<QuizOptionRow>(
			`SELECT id, question_id, text, is_correct
			FROM quiz_options
			WHERE question_id = ANY($1)
			ORDER BY question_id, id`,
			[questionIds],
		);
		return rows;
	}

	async findQuestionById(id: number): Promise<QuizQuestionWithOptions | null> {
		const { rows: qRows } = await this.pool.query<QuizQuestionRow>(
			`SELECT id, module_id, type, text FROM quiz_questions WHERE id = $1`,
			[id],
		);
		const question = qRows[0];
		if (!question) return null;

		const options = await this.findOptionsByQuestionIds([id]);
		return { question, options };
	}

	async createQuestionWithOptions(
		data: CreateQuizQuestionData,
	): Promise<QuizQuestionWithOptions> {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');
			const { rows: qRows } = await client.query<QuizQuestionRow>(
				`INSERT INTO quiz_questions (module_id, type, text)
				VALUES ($1, $2, $3)
				RETURNING id, module_id, type, text`,
				[data.module_id, data.type, data.text],
			);
			const question = qRows[0];
			const options = await this.insertOptions(
				client,
				question.id,
				data.options,
			);
			await client.query('COMMIT');
			return { question, options };
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}

	async updateQuestion(
		id: number,
		data: UpdateQuizQuestionData,
	): Promise<QuizQuestionWithOptions | null> {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');

			const fieldEntries = Object.entries({
				type: data.type,
				text: data.text,
			}).filter(([, v]) => v !== undefined);

			let question: QuizQuestionRow | undefined;
			if (fieldEntries.length > 0) {
				const set = fieldEntries
					.map(([col], i) => `${col} = $${i + 2}`)
					.join(', ');
				const { rows } = await client.query<QuizQuestionRow>(
					`UPDATE quiz_questions SET ${set}
					WHERE id = $1
					RETURNING id, module_id, type, text`,
					[id, ...fieldEntries.map(([, v]) => v)],
				);
				question = rows[0];
			} else {
				const { rows } = await client.query<QuizQuestionRow>(
					`SELECT id, module_id, type, text FROM quiz_questions WHERE id = $1`,
					[id],
				);
				question = rows[0];
			}

			if (!question) {
				await client.query('ROLLBACK');
				return null;
			}

			let options: QuizOptionRow[];
			if (data.options) {
				await client.query('DELETE FROM quiz_options WHERE question_id = $1', [
					id,
				]);
				options = await this.insertOptions(client, id, data.options);
			} else {
				const { rows } = await client.query<QuizOptionRow>(
					`SELECT id, question_id, text, is_correct
					FROM quiz_options
					WHERE question_id = $1
					ORDER BY id`,
					[id],
				);
				options = rows;
			}

			await client.query('COMMIT');
			return { question, options };
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}

	async deleteQuestion(id: number): Promise<boolean> {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');
			await client.query('DELETE FROM quiz_options WHERE question_id = $1', [
				id,
			]);
			const { rowCount } = await client.query(
				'DELETE FROM quiz_questions WHERE id = $1',
				[id],
			);
			await client.query('COMMIT');
			return (rowCount ?? 0) > 0;
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}

	private async insertOptions(
		client: PoolClient,
		questionId: number,
		options: { text: string; is_correct: boolean }[],
	): Promise<QuizOptionRow[]> {
		const inserted: QuizOptionRow[] = [];
		for (const opt of options) {
			const { rows } = await client.query<QuizOptionRow>(
				`INSERT INTO quiz_options (question_id, text, is_correct)
				VALUES ($1, $2, $3)
				RETURNING id, question_id, text, is_correct`,
				[questionId, opt.text, opt.is_correct],
			);
			inserted.push(rows[0]);
		}
		return inserted;
	}
}
