import type { FastifyInstance } from 'fastify';
import {
	createExerciseListSchema,
	type DeleteExerciseListRequest,
	deleteExerciseListSchema,
	type ListExerciseListsRequest,
	listExerciseListsSchema,
	type UpdateExerciseListRequest,
	updateExerciseListSchema,
} from '@/models/exercise-lists/exercise-list.routes.js';

export const exerciseListRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('exerciseListController');

	app.get<ListExerciseListsRequest>('/exercise-lists', { preHandler: app.authenticate, schema: listExerciseListsSchema }, controller.list);

	app.post('/exercise-lists', { preHandler: app.requireAdmin, schema: createExerciseListSchema }, controller.create);

	app.patch<UpdateExerciseListRequest>('/exercise-lists/:id', { preHandler: app.requireAdmin, schema: updateExerciseListSchema }, controller.update);

	app.delete<DeleteExerciseListRequest>('/exercise-lists/:id', { preHandler: app.requireAdmin, schema: deleteExerciseListSchema }, controller.remove);
};
