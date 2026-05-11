import type { CreateModuleData, UpdateModuleData } from '@/models/modules/module.repository.interface.js';
import type { Module, ModuleResponse } from '@/models/modules/module.schema.js';

export type ListModulesFilters = {
	subjects?: string[];
	isAdmin?: boolean;
};

export interface IModuleService {
	listModules(userId: number, filters?: ListModulesFilters): Promise<ModuleResponse[]>;
	getModule(moduleId: string, userId: number, isAdmin?: boolean): Promise<ModuleResponse>;
	createModule(data: CreateModuleData): Promise<Module>;
	updateModule(moduleId: string, data: UpdateModuleData): Promise<Module>;
	deleteModule(moduleId: string): Promise<void>;
}
