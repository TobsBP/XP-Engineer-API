import type {
	IUserModuleRepository,
	UpdateUserModuleData,
} from '@/types/interfaces/user-modules/user-module.repository.interface.js';
import type { IUserModuleService } from '@/types/interfaces/user-modules/user-module.service.interface.js';

export class UserModuleNotFoundError extends Error {
	constructor(userId: number, moduleId: string) {
		super(
			`Progresso não encontrado: usuário '${userId}', módulo '${moduleId}'`,
		);
		this.name = 'UserModuleNotFoundError';
	}
}

export class UserModuleService implements IUserModuleService {
	constructor(private readonly repository: IUserModuleRepository) {}

	async createUserModule(userId: number, moduleId: string): Promise<void> {
		await this.repository.create(userId, moduleId);
	}

	async updateUserModule(
		userId: number,
		moduleId: string,
		data: UpdateUserModuleData,
	): Promise<void> {
		const updated = await this.repository.update(userId, moduleId, data);
		if (!updated) throw new UserModuleNotFoundError(userId, moduleId);
	}
}
