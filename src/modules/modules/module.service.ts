import type { CreateModuleData, IModuleRepository, ModuleRow, UpdateModuleData } from '@/models/modules/module.repository.interface.js';
import type { Module, ModuleResponse } from '@/models/modules/module.schema.js';
import type { IModuleService } from '@/models/modules/module.service.interface.js';

export class ModuleNotFoundError extends Error {
	constructor(moduleId: string) {
		super(`Módulo '${moduleId}' não encontrado`);
		this.name = 'ModuleNotFoundError';
	}
}

export class ModuleService implements IModuleService {
	constructor(private readonly moduleRepository: IModuleRepository) {}

	async listModules(userId: number): Promise<ModuleResponse[]> {
		const rows = await this.moduleRepository.findAll(userId);
		return rows.map((row) => this.toResponse(row));
	}

	async getModule(moduleId: string, userId: number): Promise<ModuleResponse> {
		const row = await this.moduleRepository.findById(moduleId, userId);
		if (!row) throw new ModuleNotFoundError(moduleId);
		return this.toResponse(row);
	}

	async createModule(data: CreateModuleData): Promise<Module> {
		return this.moduleRepository.create(data);
	}

	async updateModule(moduleId: string, data: UpdateModuleData): Promise<Module> {
		const updated = await this.moduleRepository.update(moduleId, data);
		if (!updated) throw new ModuleNotFoundError(moduleId);
		return updated;
	}

	async deleteModule(moduleId: string): Promise<void> {
		const deleted = await this.moduleRepository.delete(moduleId);
		if (!deleted) throw new ModuleNotFoundError(moduleId);
	}

	private toResponse(row: ModuleRow): ModuleResponse {
		const locked = row.status === 'locked';
		return {
			id: row.id,
			title: row.title,
			subtitle: row.subtitle,
			subject: row.subject,
			progress: row.progress,
			status: row.status as ModuleResponse['status'],
			link: locked ? null : `/module/${row.id}/lesson/${row.current_page}`,
			locked,
		};
	}
}
