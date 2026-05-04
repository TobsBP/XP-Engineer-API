import type { CreateModuleData } from '@/types/interfaces/modules/module.repository.interface.js';
import type { Module, ModuleResponse } from '@/types/schemas/module.js';

export interface IModuleService {
	listModules(userId: number): Promise<ModuleResponse[]>;
	getModule(moduleId: string, userId: number): Promise<ModuleResponse>;
	createModule(data: CreateModuleData): Promise<Module>;
}
