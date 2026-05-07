import { NotFoundError } from '@/models/errors.js';

export class UserNotFoundError extends NotFoundError {
	constructor(id: number) {
		super(`Usuário '${id}' não encontrado`);
	}
}
