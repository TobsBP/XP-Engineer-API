import type {
	AchievementRow,
	CreateAchievementData,
	IAchievementRepository,
} from '@/models/achievements/achievement.repository.interface.js';
import type {
	Achievement,
	AchievementResponse,
} from '@/models/achievements/achievement.schema.js';
import type { IAchievementService } from '@/models/achievements/achievement.service.interface.js';

export class AchievementService implements IAchievementService {
	constructor(private readonly achievementRepository: IAchievementRepository) {}

	async createAchievement(data: CreateAchievementData): Promise<Achievement> {
		return await this.achievementRepository.create(data);
	}

	async listByUser(userId: number): Promise<AchievementResponse[]> {
		const rows = await this.achievementRepository.findAllByUser(userId);
		return rows.map((row) => this.toResponse(row));
	}

	async unlock(userId: number, achievementId: string): Promise<void> {
		await this.achievementRepository.unlock(userId, achievementId);
	}

	private toResponse(row: AchievementRow): AchievementResponse {
		return {
			id: row.id,
			title: row.title,
			description: row.description,
			icon: row.icon,
			unlocked_at: row.unlocked_at ? row.unlocked_at.toISOString() : null,
		};
	}
}
