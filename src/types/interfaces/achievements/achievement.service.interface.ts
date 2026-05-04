import type {
	Achievement,
	AchievementResponse,
} from '../../schemas/achievement.js';
import type { CreateAchievementData } from './achievement.repository.interface.js';

export interface IAchievementService {
	listByUser(userId: number): Promise<AchievementResponse[]>;
	createAchievement(data: CreateAchievementData): Promise<Achievement>;
	unlock(userId: number, achievementId: string): Promise<void>;
}
