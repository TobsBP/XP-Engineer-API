import type { Pool } from 'pg';
import type {
	IQuizRepository,
	QuizOptionRow,
	QuizQuestionRow,
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
}
