import type {
	AchievementRow,
	CreateAchievementData,
	IAchievementRepository,
} from '../../types/interfaces/achievements/achievement.repository.interface.js';
import type { IAchievementService } from '../../types/interfaces/achievements/achievement.service.interface.js';
import type {
	Achievement,
	AchievementResponse,
} from '../../types/schemas/achievement.js';

export class AchievementService implements IAchievementService {
	constructor(private readonly repository: IAchievementRepository) {}

	async createAchievement(data: CreateAchievementData): Promise<Achievement> {
		return await this.repository.create(data);
	}

	async listByUser(userId: number): Promise<AchievementResponse[]> {
		const rows = await this.repository.findAllByUser(userId);
		return rows.map((row) => this.toResponse(row));
	}

	async unlock(userId: number, achievementId: string): Promise<void> {
		await this.repository.unlock(userId, achievementId);
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
