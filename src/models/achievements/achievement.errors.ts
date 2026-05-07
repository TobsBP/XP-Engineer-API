import { NotFoundError } from '@/models/errors.js';

export class AchievementNotFoundError extends NotFoundError {
	constructor(achievementId: string) {
		super(`Conquista '${achievementId}' não encontrada`);
	}
}
