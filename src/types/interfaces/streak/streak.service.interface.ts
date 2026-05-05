export type StreakResponse = {
	current_streak: number;
	longest_streak: number;
	history: {
		start_date: string;
		end_date: string;
		duration: number;
	}[];
};

export interface IStreakService {
	registerActivity(userId: number): Promise<void>;
	getStreak(userId: number): Promise<StreakResponse>;
}
