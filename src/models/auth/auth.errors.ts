import { ConflictError, UnauthorizedError } from '@/models/errors.js';

export class UserAlreadyExistsError extends ConflictError {
	constructor(email: string) {
		super(`Usuário com email '${email}' já existe`);
	}
}

export class InvalidCredentialsError extends UnauthorizedError {
	constructor() {
		super('Email ou senha inválidos');
	}
}
