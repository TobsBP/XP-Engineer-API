import { z } from 'zod';
import { AchievementResponseSchema, AchievementSchema } from '@/models/achievements/achievement.schema.js';

export const listUserAchievementsSchema = {
	tags: ['Achievements'],
	description: 'Retorna todas as conquistas de um usuário.',
	params: z.object({
		userId: z.coerce.number().int().positive('ID do usuário é obrigatório'),
	}),
	response: {
		200: z.array(AchievementResponseSchema),
	},
};

export const createAchievementSchema = {
	tags: ['Achievements'],
	description: 'Cria uma nova conquista.',
	body: z.object({
		id: z.string().min(1).max(100),
		title: z.string().min(1, 'Título é obrigatório').max(200),
		description: z.string().min(1, 'Descrição é obrigatória').max(300),
		icon: z.string().min(1, 'Ícone é obrigatório').max(100),
	}),
	response: {
		201: AchievementSchema,
	},
};

export const unlockAchievementSchema = {
	tags: ['Achievements'],
	description: 'Desbloqueia uma conquista para um usuário.',
	params: z.object({
		userId: z.coerce.number().int().positive('ID do usuário é obrigatório'),
		achievementId: z.string().min(1, 'ID da conquista é obrigatório'),
	}),
	response: {
		204: z.null(),
	},
};

export type ListUserAchievementsRequest = {
	Params: z.infer<typeof listUserAchievementsSchema.params>;
};

export type CreateAchievementRequest = {
	Body: z.infer<typeof createAchievementSchema.body>;
};

export type UnlockAchievementRequest = {
	Params: z.infer<typeof unlockAchievementSchema.params>;
};
