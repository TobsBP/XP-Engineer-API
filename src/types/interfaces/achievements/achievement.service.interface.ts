import type { CreateAchievementData } from '@/types/interfaces/achievements/achievement.repository.interface.js';
import type {
	Achievement,
	AchievementResponse,
} from '@/types/schemas/achievement.js';

export interface IAchievementService {
	listByUser(userId: number): Promise<AchievementResponse[]>;
	createAchievement(data: CreateAchievementData): Promise<Achievement>;
	unlock(userId: number, achievementId: string): Promise<void>;
}
