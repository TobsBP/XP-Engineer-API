import type { FastifyInstance } from 'fastify';
import {
	type ListExerciseListsRequest,
	listExerciseListsSchema,
} from '@/models/exercise-lists/exercise-list.routes.js';

export const exerciseListRoutes = async (
	app: FastifyInstance,
): Promise<void> => {
	const controller = app.container.resolve('exerciseListController');

	app.get<ListExerciseListsRequest>(
		'/exercise-lists',
		{ preHandler: app.authenticate, schema: listExerciseListsSchema },
		controller.list,
	);
};
