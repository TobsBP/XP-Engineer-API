import type { ModuleStatus } from '../../schemas/module.js';

export type UpdateUserModuleData = {
	progress?: number;
	status?: ModuleStatus;
	current_page?: number;
};

export interface IUserModuleRepository {
	create(userId: number, moduleId: string): Promise<void>;
	update(
		userId: number,
		moduleId: string,
		data: UpdateUserModuleData,
	): Promise<boolean>;
}
