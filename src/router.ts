import type { FastifyInstance } from 'fastify';
import { achievementRoutes } from '@/modules/achievements/achievement.routes.js';
import { authRoutes } from '@/modules/auth/auth.routes.js';
import { lessonRoutes } from '@/modules/lessons/lesson.routes.js';
import { moduleRoutes } from '@/modules/modules/module.routes.js';
import { userModuleRoutes } from '@/modules/user-modules/user-module.routes.js';
import { userRoutes } from '@/modules/users/user.routes.js';

export const routes = async (app: FastifyInstance): Promise<void> => {
	app.register(authRoutes, { prefix: '/auth' });
	app.register(userRoutes);
	app.register(moduleRoutes);
	app.register(lessonRoutes);
	app.register(achievementRoutes);
	app.register(userModuleRoutes);
};
