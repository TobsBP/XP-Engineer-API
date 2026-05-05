export type ModuleRow = {
	id: string;
	title: string;
	subtitle: string;
	subject: string;
	order_index: number;
	locked_by_default: boolean;
	min_xp: number;
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
};

export type UpdateModuleData = {
	title?: string;
	subtitle?: string;
	subject?: string;
	order_index?: number;
	locked_by_default?: boolean;
	min_xp?: number;
};

export type CreatedModuleRow = {
	id: string;
	title: string;
	subtitle: string;
	subject: string;
	order_index: number;
	locked_by_default: boolean;
	min_xp: number;
};

export interface IModuleRepository {
	findAll(userId: number): Promise<ModuleRow[]>;
	findById(moduleId: string, userId: number): Promise<ModuleRow | null>;
	create(data: CreateModuleData): Promise<CreatedModuleRow>;
	update(
		moduleId: string,
		data: UpdateModuleData,
	): Promise<CreatedModuleRow | null>;
	delete(moduleId: string): Promise<boolean>;
}
