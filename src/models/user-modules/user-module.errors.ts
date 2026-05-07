import { ForbiddenError, NotFoundError } from '@/models/errors.js';

export class UserModuleNotFoundError extends NotFoundError {
	constructor(userId: number, moduleId: string) {
		super(`Progresso não encontrado: usuário '${userId}', módulo '${moduleId}'`);
	}
}

export class ModuleLockedError extends ForbiddenError {
	readonly requiredXp: number;
	readonly currentXp: number;

	constructor(moduleId: string, requiredXp: number, currentXp: number) {
		super(`Módulo '${moduleId}' está bloqueado. XP necessário: ${requiredXp}, XP atual: ${currentXp}.`);
		this.requiredXp = requiredXp;
		this.currentXp = currentXp;
	}
}
