export type AchievementRow = {
	id: string;
	title: string;
	description: string;
	icon: string;
	module_id: string | null;
	unlocked_at: Date | null;
};

export type CreateAchievementData = {
	title: string;
	description: string;
	icon: string;
	module_id?: string | null;
};

export type CreatedAchievementRow = {
	id: string;
	title: string;
	description: string;
	icon: string;
	module_id: string | null;
};

export type AchievementCatalogRow = {
	id: string;
	title: string;
	description: string;
	icon: string;
	module_id: string | null;
};

export type AchievementPagination = {
	page: number;
	pageSize: number;
};

export interface IAchievementRepository {
	findAllByUser(userId: number): Promise<AchievementRow[]>;
	findAll(pagination: AchievementPagination): Promise<{ items: AchievementCatalogRow[]; total: number }>;
	findIdsByModule(moduleId: string): Promise<string[]>;
	existsById(achievementId: string): Promise<boolean>;
	create(data: CreateAchievementData): Promise<CreatedAchievementRow>;
	unlock(userId: number, achievementId: string): Promise<void>;
}
