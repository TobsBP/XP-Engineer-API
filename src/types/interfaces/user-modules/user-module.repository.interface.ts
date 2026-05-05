import type { ModuleStatus } from '@/types/schemas/module.js';

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
	getModuleMinXp(moduleId: string): Promise<number>;
	getUserXpTotal(userId: number): Promise<number>;
}
