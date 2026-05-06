export type StreakActivityRow = {
	id: number;
	user_id: number;
	activity_date: string;
};

export type StreakHistoryRow = {
	id: number;
	user_id: number;
	start_date: string;
	end_date: string;
	duration: number;
};

export interface IStreakRepository {
	registerActivity(userId: number, date: string): Promise<boolean>;
	getLastActivityDate(userId: number): Promise<string | null>;
	getCurrentStreakStart(userId: number): Promise<string | null>;
	saveStreakHistory(userId: number, startDate: string, endDate: string, duration: number): Promise<void>;
	getStreakHistory(userId: number): Promise<StreakHistoryRow[]>;
	updateUserStreak(userId: number, streakDays: number): Promise<void>;
	getUserStreakDays(userId: number): Promise<number>;
}
