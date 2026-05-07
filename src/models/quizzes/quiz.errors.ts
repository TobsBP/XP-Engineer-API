import { NotFoundError } from '@/models/errors.js';

export class QuizNotFoundError extends NotFoundError {
	constructor(moduleId: string) {
		super(`Nenhuma pergunta encontrada para o módulo '${moduleId}'`);
	}
}

export class QuizQuestionNotFoundError extends NotFoundError {
	constructor(id: number) {
		super(`Pergunta '${id}' não encontrada`);
	}
}
