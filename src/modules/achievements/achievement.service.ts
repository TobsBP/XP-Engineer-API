import { AchievementNotFoundError } from '@/models/achievements/achievement.errors.js';
import type {
	AchievementPagination,
	AchievementRow,
	CreateAchievementData,
	IAchievementRepository,
} from '@/models/achievements/achievement.repository.interface.js';
import type { Achievement, AchievementResponse } from '@/models/achievements/achievement.schema.js';
import type { IAchievementService, ListAchievementsResult } from '@/models/achievements/achievement.service.interface.js';

export class AchievementService implements IAchievementService {
	constructor(private readonly achievementRepository: IAchievementRepository) {}

	async createAchievement(data: CreateAchievementData): Promise<Achievement> {
		return await this.achievementRepository.create(data);
	}

	async listAll(pagination: AchievementPagination): Promise<ListAchievementsResult> {
		const { items, total } = await this.achievementRepository.findAll(pagination);
		return {
			items: items.map((it) => ({ ...it, module_id: it.module_id ?? null })),
			total,
			page: pagination.page,
			pageSize: pagination.pageSize,
		};
	}

	async listByUser(userId: number): Promise<AchievementResponse[]> {
		const rows = await this.achievementRepository.findAllByUser(userId);
		return rows.map((row) => this.toResponse(row));
	}

	async unlock(userId: number, achievementId: string): Promise<void> {
		const exists = await this.achievementRepository.existsById(achievementId);
		if (!exists) throw new AchievementNotFoundError(achievementId);
		await this.achievementRepository.unlock(userId, achievementId);
	}

	async unlockForModuleIfAny(userId: number, moduleId: string): Promise<string[]> {
		const ids = await this.achievementRepository.findIdsByModule(moduleId);
		await Promise.all(ids.map((id) => this.achievementRepository.unlock(userId, id)));
		return ids;
	}

	private toResponse(row: AchievementRow): AchievementResponse {
		return {
			id: row.id,
			title: row.title,
			description: row.description,
			icon: row.icon,
			module_id: row.module_id,
			unlocked_at: row.unlocked_at ? row.unlocked_at.toISOString() : null,
		};
	}
}
