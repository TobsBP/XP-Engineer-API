import type { Pool } from 'pg';
import type {
	CreateExerciseListData,
	ExerciseListRow,
	IExerciseListRepository,
	UpdateExerciseListData,
} from '@/models/exercise-lists/exercise-list.repository.interface.js';

const RETURN_COLUMNS =
	'id, title, subject, description, questions_count, difficulty, pdf_path, module_id';

export class ExerciseListRepository implements IExerciseListRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(subject?: string): Promise<ExerciseListRow[]> {
		if (subject) {
			const { rows } = await this.pool.query<ExerciseListRow>(
				`SELECT ${RETURN_COLUMNS}
				FROM exercise_lists
				WHERE subject ILIKE $1
				ORDER BY title`,
				[`%${subject}%`],
			);
			return rows;
		}

		const { rows } = await this.pool.query<ExerciseListRow>(
			`SELECT ${RETURN_COLUMNS}
			FROM exercise_lists
			ORDER BY subject, title`,
		);
		return rows;
	}

	async findById(id: string): Promise<ExerciseListRow | null> {
		const { rows } = await this.pool.query<ExerciseListRow>(
			`SELECT ${RETURN_COLUMNS}
			FROM exercise_lists
			WHERE id = $1`,
			[id],
		);
		return rows[0] ?? null;
	}

	async create(data: CreateExerciseListData): Promise<ExerciseListRow> {
		const { rows } = await this.pool.query<ExerciseListRow>(
			`INSERT INTO exercise_lists
			(id, title, subject, description, questions_count, difficulty, pdf_path, module_id)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING ${RETURN_COLUMNS}`,
			[
				data.id,
				data.title,
				data.subject,
				data.description,
				data.questions_count,
				data.difficulty,
				data.pdf_path,
				data.module_id,
			],
		);
		return rows[0];
	}

	async update(
		id: string,
		data: UpdateExerciseListData,
	): Promise<ExerciseListRow | null> {
		const entries = Object.entries(data).filter(([, v]) => v !== undefined);
		if (entries.length === 0) return this.findById(id);

		const set = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
		const { rows } = await this.pool.query<ExerciseListRow>(
			`UPDATE exercise_lists SET ${set}
			WHERE id = $1
			RETURNING ${RETURN_COLUMNS}`,
			[id, ...entries.map(([, v]) => v)],
		);
		return rows[0] ?? null;
	}

	async delete(id: string): Promise<boolean> {
		const { rowCount } = await this.pool.query(
			'DELETE FROM exercise_lists WHERE id = $1',
			[id],
		);
		return (rowCount ?? 0) > 0;
	}
}
