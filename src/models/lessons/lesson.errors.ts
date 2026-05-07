import { NotFoundError } from '@/models/errors.js';

export class LessonNotFoundError extends NotFoundError {
	constructor(moduleId: string, page: number) {
		super(`Lição não encontrada: módulo '${moduleId}', página ${page}`);
	}
}

export class LessonByIdNotFoundError extends NotFoundError {
	constructor(id: number) {
		super(`Lição '${id}' não encontrada`);
	}
}

export class ConceptItemNotFoundError extends NotFoundError {
	constructor(id: string) {
		super(`Item de conceito '${id}' não encontrado`);
	}
}

export class ConceptExampleNotFoundError extends NotFoundError {
	constructor(id: string) {
		super(`Exemplo de conceito '${id}' não encontrado`);
	}
}

export class ApplicationItemNotFoundError extends NotFoundError {
	constructor(id: string) {
		super(`Item de aplicação '${id}' não encontrado`);
	}
}
