import type { Module, ModuleResponse } from '../../schemas/module.js';
import type { CreateModuleData } from './module.repository.interface.js';

export interface IModuleService {
	listModules(userId: number): Promise<ModuleResponse[]>;
	getModule(moduleId: string, userId: number): Promise<ModuleResponse>;
	createModule(data: CreateModuleData): Promise<Module>;
}
