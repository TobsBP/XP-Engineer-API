import type { FastifyInstance } from 'fastify';
import { pool } from '@/lib/db.js';
import { R2_BUCKET_NAME, r2Client } from '@/lib/r2.js';
import { ExerciseListController } from '@/modules/exercise-lists/exercise-list.controller.js';
import { ExerciseListRepository } from '@/modules/exercise-lists/exercise-list.repository.js';
import { ExerciseListService } from '@/modules/exercise-lists/exercise-list.service.js';
import {
	type ListExerciseListsRequest,
	listExerciseListsSchema,
} from '@/types/routes/exercise-lists.js';

export const exerciseListRoutes = async (
	app: FastifyInstance,
): Promise<void> => {
	const repository = new ExerciseListRepository(pool);
	const service = new ExerciseListService(repository, r2Client, R2_BUCKET_NAME);
	const controller = new ExerciseListController(service);

	app.get<ListExerciseListsRequest>(
		'/exercise-lists',
		{ preHandler: app.authenticate, schema: listExerciseListsSchema },
		controller.list,
	);
};
