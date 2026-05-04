import type {
	CreateModuleData,
	IModuleRepository,
	ModuleRow,
} from '../../types/interfaces/modules/module.repository.interface.js';
import type { IModuleService } from '../../types/interfaces/modules/module.service.interface.js';
import type { Module, ModuleResponse } from '../../types/schemas/module.js';

export class ModuleNotFoundError extends Error {
	constructor(moduleId: string) {
		super(`Módulo '${moduleId}' não encontrado`);
		this.name = 'ModuleNotFoundError';
	}
}

export class ModuleService implements IModuleService {
	constructor(private readonly repository: IModuleRepository) {}

	async listModules(userId: number): Promise<ModuleResponse[]> {
		const rows = await this.repository.findAll(userId);
		return rows.map((row) => this.toResponse(row));
	}

	async getModule(moduleId: string, userId: number): Promise<ModuleResponse> {
		const row = await this.repository.findById(moduleId, userId);
		if (!row) throw new ModuleNotFoundError(moduleId);
		return this.toResponse(row);
	}

	async createModule(data: CreateModuleData): Promise<Module> {
		return this.repository.create(data);
	}

	private toResponse(row: ModuleRow): ModuleResponse {
		const locked = row.status === 'locked';
		return {
			id: row.id,
			title: row.title,
			subtitle: row.subtitle,
			progress: row.progress,
			status: row.status as ModuleResponse['status'],
			link: locked ? null : `/module/${row.id}/lesson/${row.current_page}`,
			locked,
		};
	}
}
