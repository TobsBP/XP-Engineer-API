import type { FastifyInstance } from 'fastify';
import { achievementRoutes } from '@/modules/achievements/achievement.routes.js';
import { authRoutes } from '@/modules/auth/auth.routes.js';
import { exerciseListRoutes } from '@/modules/exercise-lists/exercise-list.routes.js';
import { lessonRoutes } from '@/modules/lessons/lesson.routes.js';
import { moduleRoutes } from '@/modules/modules/module.routes.js';
import { progressRoutes } from '@/modules/progress/progress.routes.js';
import { quizRoutes } from '@/modules/quizzes/quiz.routes.js';
import { uploadRoutes } from '@/modules/upload/upload.routes.js';
import { userModuleRoutes } from '@/modules/user-modules/user-module.routes.js';
import { userRoutes } from '@/modules/users/user.routes.js';

export const routes = async (app: FastifyInstance): Promise<void> => {
	app.register(authRoutes, { prefix: '/auth' });
	app.register(userRoutes);
	app.register(moduleRoutes);
	app.register(lessonRoutes);
	app.register(achievementRoutes);
	app.register(userModuleRoutes);
	app.register(quizRoutes);
	app.register(progressRoutes);
	app.register(exerciseListRoutes);
	app.register(uploadRoutes);
};
