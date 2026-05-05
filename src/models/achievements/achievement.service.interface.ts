import type { CreateAchievementData } from '@/models/achievements/achievement.repository.interface.js';
import type {
	Achievement,
	AchievementResponse,
} from '@/models/achievements/achievement.schema.js';

export interface IAchievementService {
	listByUser(userId: number): Promise<AchievementResponse[]>;
	createAchievement(data: CreateAchievementData): Promise<Achievement>;
	unlock(userId: number, achievementId: string): Promise<void>;
}
