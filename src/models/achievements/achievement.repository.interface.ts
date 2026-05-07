export type AchievementRow = {
	id: string;
	title: string;
	description: string;
	icon: string;
	unlocked_at: Date | null;
};

export type CreateAchievementData = {
	id: string;
	title: string;
	description: string;
	icon: string;
};

export interface IAchievementRepository {
	findAllByUser(userId: number): Promise<AchievementRow[]>;
	existsById(achievementId: string): Promise<boolean>;
	create(data: CreateAchievementData): Promise<CreateAchievementData>;
	unlock(userId: number, achievementId: string): Promise<void>;
}
