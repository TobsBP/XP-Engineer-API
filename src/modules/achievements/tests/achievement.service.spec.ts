import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
	AchievementRow,
	IAchievementRepository,
} from '@/models/achievements/achievement.repository.interface.js';
import { AchievementService } from '@/modules/achievements/achievement.service.js';

describe('AchievementService', () => {
	let achievementService: AchievementService;
	let achievementRepositoryMock: IAchievementRepository;

	const mockAchievementRow: AchievementRow = {
		id: 'ach-1',
		title: 'First Code',
		description: 'You wrote your first code!',
		icon: '💻',
		unlocked_at: new Date('2024-01-01'),
	};

	beforeEach(() => {
		achievementRepositoryMock = {
			create: vi.fn(),
			findAllByUser: vi.fn(),
			unlock: vi.fn(),
		} as unknown as IAchievementRepository;

		achievementService = new AchievementService(achievementRepositoryMock);
	});

	describe('createAchievement', () => {
		it('should create an achievement (happy path)', async () => {
			const data = {
				id: 'ach-2',
				title: 'New',
				description: 'Desc',
				icon: '🔥',
			};
			vi.mocked(achievementRepositoryMock.create).mockResolvedValue(data);

			const result = await achievementService.createAchievement(data);

			expect(achievementRepositoryMock.create).toHaveBeenCalledWith(data);
			expect(result.id).toBe('ach-2');
		});
	});

	describe('listByUser', () => {
		it('should return achievements for a user (happy path)', async () => {
			vi.mocked(achievementRepositoryMock.findAllByUser).mockResolvedValue([
				mockAchievementRow,
			]);

			const result = await achievementService.listByUser(1);

			expect(achievementRepositoryMock.findAllByUser).toHaveBeenCalledWith(1);
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('ach-1');
			expect(result[0].unlocked_at).toBe(
				mockAchievementRow.unlocked_at?.toISOString(),
			);
		});

		it('should return empty array if user has no achievements (happy path)', async () => {
			vi.mocked(achievementRepositoryMock.findAllByUser).mockResolvedValue([]);

			const result = await achievementService.listByUser(1);

			expect(result).toHaveLength(0);
		});
	});

	describe('unlock', () => {
		it('should unlock an achievement for a user (happy path)', async () => {
			vi.mocked(achievementRepositoryMock.unlock).mockResolvedValue();

			await expect(
				achievementService.unlock(1, 'ach-1'),
			).resolves.not.toThrow();
			expect(achievementRepositoryMock.unlock).toHaveBeenCalledWith(1, 'ach-1');
		});
	});
});
