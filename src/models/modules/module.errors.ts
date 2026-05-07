import { NotFoundError } from '@/models/errors.js';

export class ModuleNotFoundError extends NotFoundError {
	constructor(moduleId: string) {
		super(`Módulo '${moduleId}' não encontrado`);
	}
}
