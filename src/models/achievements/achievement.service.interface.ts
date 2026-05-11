import type { AchievementPagination, CreateAchievementData } from '@/models/achievements/achievement.repository.interface.js';
import type { Achievement, AchievementResponse } from '@/models/achievements/achievement.schema.js';

export type ListAchievementsResult = {
	items: Achievement[];
	total: number;
	page: number;
	pageSize: number;
};

export interface IAchievementService {
	listByUser(userId: number): Promise<AchievementResponse[]>;
	listAll(pagination: AchievementPagination): Promise<ListAchievementsResult>;
	createAchievement(data: CreateAchievementData): Promise<Achievement>;
	unlock(userId: number, achievementId: string): Promise<void>;
	unlockForModuleIfAny(userId: number, moduleId: string): Promise<string[]>;
}
