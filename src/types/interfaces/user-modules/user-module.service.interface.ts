import type { UpdateUserModuleData } from './user-module.repository.interface.js';

export interface IUserModuleService {
	createUserModule(userId: number, moduleId: string): Promise<void>;
	updateUserModule(
		userId: number,
		moduleId: string,
		data: UpdateUserModuleData,
	): Promise<void>;
}
