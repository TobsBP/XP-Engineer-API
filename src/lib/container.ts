import { asClass, asFunction, asValue, createContainer } from 'awilix';
import type { FastifyInstance } from 'fastify';
import * as Controllers from '@/lib/controllers.js';
import { pool } from '@/lib/db.js';
import { R2_BUCKET_NAME, r2Client } from '@/lib/r2.js';
import * as Repositories from '@/lib/repositories.js';
import * as Services from '@/lib/services.js';
import type { Cradle } from '@/models/cradle.js';

export type AppContainer = ReturnType<typeof buildContainer>;

export function buildContainer(app: FastifyInstance) {
	const container = createContainer<Cradle>();

	container.register({
		pool: asValue(pool),
		s3Client: asValue(r2Client),
		bucketName: asValue(R2_BUCKET_NAME),
		jwt: asFunction(() => app.jwt).singleton(),

		userRepository: asClass(Repositories.UserRepository).classic(),
		userService: asClass(Services.UserService).classic(),
		userController: asClass(Controllers.UserController).classic(),

		streakRepository: asClass(Repositories.StreakRepository).classic(),
		streakService: asClass(Services.StreakService).classic(),

		authService: asClass(Services.AuthService).classic(),
		authController: asClass(Controllers.AuthController).classic(),

		achievementRepository: asClass(Repositories.AchievementRepository).classic(),
		achievementService: asClass(Services.AchievementService).classic(),
		achievementController: asClass(Controllers.AchievementController).classic(),

		lessonRepository: asClass(Repositories.LessonRepository).classic(),
		lessonService: asClass(Services.LessonService).classic(),
		lessonController: asClass(Controllers.LessonController).classic(),

		moduleRepository: asClass(Repositories.ModuleRepository).classic(),
		moduleService: asClass(Services.ModuleService).classic(),
		moduleController: asClass(Controllers.ModuleController).classic(),

		quizRepository: asClass(Repositories.QuizRepository).classic(),
		quizService: asClass(Services.QuizService).classic(),
		quizController: asClass(Controllers.QuizController).classic(),

		progressRepository: asClass(Repositories.ProgressRepository).classic(),
		progressService: asClass(Services.ProgressService).classic(),
		progressController: asClass(Controllers.ProgressController).classic(),

		userModuleRepository: asClass(Repositories.UserModuleRepository).classic(),
		userModuleService: asClass(Services.UserModuleService).classic(),
		userModuleController: asClass(Controllers.UserModuleController).classic(),

		leaderboardRepository: asClass(Repositories.LeaderboardRepository).classic(),
		leaderboardService: asClass(Services.LeaderboardService).classic(),
		leaderboardController: asClass(Controllers.LeaderboardController).classic(),

		pdfImportRepository: asClass(Repositories.PdfImportRepository).classic(),
		pdfImportService: asClass(Services.PdfImportService).classic(),
		pdfImportController: asClass(Controllers.PdfImportController).classic(),

		exerciseListRepository: asClass(Repositories.ExerciseListRepository).classic(),
		exerciseListService: asClass(Services.ExerciseListService).classic(),
		exerciseListController: asClass(Controllers.ExerciseListController).classic(),
	});

	return container;
}

export function registerAwilixContainer(app: FastifyInstance, container: AppContainer) {
	app.decorate('container', container);
}
