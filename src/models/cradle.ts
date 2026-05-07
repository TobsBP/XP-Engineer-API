import type { S3Client } from '@aws-sdk/client-s3';
import type { Pool } from 'pg';
import type * as Controllers from '@/lib/controllers.js';
import type * as Repositories from '@/lib/repositories.js';
import type * as Services from '@/lib/services.js';

export type Cradle = {
	pool: Pool;
	s3Client: S3Client;
	bucketName: string;
	jwt: { sign(payload: object): string };

	userRepository: Repositories.UserRepository;
	userService: Services.UserService;
	userController: Controllers.UserController;

	streakRepository: Repositories.StreakRepository;
	streakService: Services.StreakService;

	authService: Services.AuthService;
	authController: Controllers.AuthController;

	achievementRepository: Repositories.AchievementRepository;
	achievementService: Services.AchievementService;
	achievementController: Controllers.AchievementController;

	lessonRepository: Repositories.LessonRepository;
	lessonService: Services.LessonService;
	lessonController: Controllers.LessonController;

	moduleRepository: Repositories.ModuleRepository;
	moduleService: Services.ModuleService;
	moduleController: Controllers.ModuleController;

	quizRepository: Repositories.QuizRepository;
	quizService: Services.QuizService;
	quizController: Controllers.QuizController;

	progressRepository: Repositories.ProgressRepository;
	progressService: Services.ProgressService;
	progressController: Controllers.ProgressController;

	userModuleRepository: Repositories.UserModuleRepository;
	userModuleService: Services.UserModuleService;
	userModuleController: Controllers.UserModuleController;

	leaderboardRepository: Repositories.LeaderboardRepository;
	leaderboardService: Services.LeaderboardService;
	leaderboardController: Controllers.LeaderboardController;

	pdfImportRepository: Repositories.PdfImportRepository;
	pdfImportService: Services.PdfImportService;
	pdfImportController: Controllers.PdfImportController;

	exerciseListRepository: Repositories.ExerciseListRepository;
	exerciseListService: Services.ExerciseListService;
	exerciseListController: Controllers.ExerciseListController;
};
