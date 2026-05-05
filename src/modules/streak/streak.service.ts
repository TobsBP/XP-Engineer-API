import type { IStreakRepository } from '@/types/interfaces/streak/streak.repository.interface.js';
import type {
	IStreakService,
	StreakResponse,
} from '@/types/interfaces/streak/streak.service.interface.js';

export class StreakService implements IStreakService {
	constructor(private readonly repository: IStreakRepository) {}

	async registerActivity(userId: number): Promise<void> {
		const today = new Date().toISOString().split('T')[0];
		const lastActivity = await this.repository.getLastActivityDate(userId);

		if (lastActivity === today) {
			return;
		}

		const yesterday = this.getYesterday();

		if (lastActivity && lastActivity < yesterday) {
			const streakStart = await this.repository.getCurrentStreakStart(userId);
			const currentStreak = await this.repository.getUserStreakDays(userId);

			if (streakStart && currentStreak > 0) {
				await this.repository.saveStreakHistory(
					userId,
					streakStart,
					lastActivity,
					currentStreak,
				);
			}

			await this.repository.registerActivity(userId, today);
			await this.repository.updateUserStreak(userId, 1);
		} else {
			await this.repository.registerActivity(userId, today);
			const currentStreak = await this.repository.getUserStreakDays(userId);
			await this.repository.updateUserStreak(userId, currentStreak + 1);
		}
	}

	async getStreak(userId: number): Promise<StreakResponse> {
		const currentStreak = await this.repository.getUserStreakDays(userId);
		const history = await this.repository.getStreakHistory(userId);

		const allStreaks = [currentStreak, ...history.map((h) => h.duration)];
		const longestStreak = Math.max(...allStreaks, 0);

		return {
			current_streak: currentStreak,
			longest_streak: longestStreak,
			history: history.map((h) => ({
				start_date: h.start_date,
				end_date: h.end_date,
				duration: h.duration,
			})),
		};
	}

	private getYesterday(): string {
		const date = new Date();
		date.setDate(date.getDate() - 1);
		return date.toISOString().split('T')[0];
	}
}
