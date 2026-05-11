export type ModuleRow = {
	id: string;
	title: string;
	subtitle: string;
	subject: string;
	order_index: number;
	locked_by_default: boolean;
	min_xp: number;
	visible: boolean;
	progress: number;
	status: string;
	current_page: number;
};

export type CreateModuleData = {
	id: string;
	title: string;
	subtitle: string;
	subject: string;
	order_index: number;
	locked_by_default: boolean;
	min_xp?: number;
	visible?: boolean;
};

export type UpdateModuleData = {
	title?: string;
	subtitle?: string;
	subject?: string;
	order_index?: number;
	locked_by_default?: boolean;
	min_xp?: number;
	visible?: boolean;
};

export type CreatedModuleRow = {
	id: string;
	title: string;
	subtitle: string;
	subject: string;
	order_index: number;
	locked_by_default: boolean;
	min_xp: number;
	visible: boolean;
};

export type ModuleListFilters = {
	subjects?: string[];
	includeHidden?: boolean;
};

export interface IModuleRepository {
	findAll(userId: number, filters?: ModuleListFilters): Promise<ModuleRow[]>;
	findById(moduleId: string, userId: number, includeHidden?: boolean): Promise<ModuleRow | null>;
	create(data: CreateModuleData): Promise<CreatedModuleRow>;
	update(moduleId: string, data: UpdateModuleData): Promise<CreatedModuleRow | null>;
	delete(moduleId: string): Promise<boolean>;
}
