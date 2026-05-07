import { NotFoundError } from '@/models/errors.js';

export class ExerciseListNotFoundError extends NotFoundError {
	constructor(id: string) {
		super(`Lista de exercícios '${id}' não encontrada`);
	}
}
