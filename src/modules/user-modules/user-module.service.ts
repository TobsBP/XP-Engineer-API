import type { IUserModuleRepository, UpdateUserModuleData } from '@/models/user-modules/user-module.repository.interface.js';
import type { IUserModuleService } from '@/models/user-modules/user-module.service.interface.js';

export class UserModuleNotFoundError extends Error {
	constructor(userId: number, moduleId: string) {
		super(`Progresso não encontrado: usuário '${userId}', módulo '${moduleId}'`);
		this.name = 'UserModuleNotFoundError';
	}
}

export class ModuleLockedError extends Error {
	readonly requiredXp: number;
	readonly currentXp: number;

	constructor(moduleId: string, requiredXp: number, currentXp: number) {
		super(`Módulo '${moduleId}' está bloqueado. XP necessário: ${requiredXp}, XP atual: ${currentXp}.`);
		this.name = 'ModuleLockedError';
		this.requiredXp = requiredXp;
		this.currentXp = currentXp;
	}
}

export class UserModuleService implements IUserModuleService {
	constructor(private readonly userModuleRepository: IUserModuleRepository) {}

	async createUserModule(userId: number, moduleId: string): Promise<void> {
		const minXp = await this.userModuleRepository.getModuleMinXp(moduleId);

		if (minXp > 0) {
			const userXp = await this.userModuleRepository.getUserXpTotal(userId);
			if (userXp < minXp) {
				throw new ModuleLockedError(moduleId, minXp, userXp);
			}
		}

		await this.userModuleRepository.create(userId, moduleId);
	}

	async updateUserModule(userId: number, moduleId: string, data: UpdateUserModuleData): Promise<void> {
		const updated = await this.userModuleRepository.update(userId, moduleId, data);
		if (!updated) throw new UserModuleNotFoundError(userId, moduleId);
	}
}
