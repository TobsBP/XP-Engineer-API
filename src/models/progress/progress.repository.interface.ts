export type UserModuleRow = {
	user_id: number;
	module_id: string;
	progress: number;
	status: string;
	current_page: number;
};

export type UserModuleDetailRow = {
	module_id: string;
	module_title: string;
	subject: string;
	progress: number;
	status: string;
	current_page: number;
	total_pages: number;
};

export interface IProgressRepository {
	findUserModule(userId: number, moduleId: string): Promise<UserModuleRow | null>;
	findAllByUser(userId: number): Promise<UserModuleDetailRow[]>;
	findModuleDetail(userId: number, moduleId: string): Promise<UserModuleDetailRow | null>;
	getXpTotal(userId: number): Promise<number>;
	updateProgress(userId: number, moduleId: string, data: { progress: number; status: string; current_page: number }): Promise<UserModuleRow | null>;
	completeModule(userId: number, moduleId: string): Promise<UserModuleRow | null>;
	addXp(userId: number, xp: number): Promise<number>;
	updateLevel(userId: number, level: number): Promise<void>;
	getTotalPages(moduleId: string): Promise<number>;
}
