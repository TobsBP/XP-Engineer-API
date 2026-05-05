import type { Pool } from 'pg';
import type {
	ExerciseListRow,
	IExerciseListRepository,
} from '@/types/interfaces/exercise-lists/exercise-list.repository.interface.js';

export class ExerciseListRepository implements IExerciseListRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(subject?: string): Promise<ExerciseListRow[]> {
		if (subject) {
			const { rows } = await this.pool.query<ExerciseListRow>(
				`SELECT id, title, subject, description, questions_count, difficulty, pdf_path, module_id
				FROM exercise_lists
				WHERE subject ILIKE $1
				ORDER BY title`,
				[`%${subject}%`],
			);
			return rows;
		}

		const { rows } = await this.pool.query<ExerciseListRow>(
			`SELECT id, title, subject, description, questions_count, difficulty, pdf_path, module_id
			FROM exercise_lists
			ORDER BY subject, title`,
		);
		return rows;
	}

	async findById(id: string): Promise<ExerciseListRow | null> {
		const { rows } = await this.pool.query<ExerciseListRow>(
			`SELECT id, title, subject, description, questions_count, difficulty, pdf_path, module_id
			FROM exercise_lists
			WHERE id = $1`,
			[id],
		);
		return rows[0] ?? null;
	}
}
