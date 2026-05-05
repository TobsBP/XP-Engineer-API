import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ListExerciseListsRequest } from '@/models/exercise-lists/exercise-list.routes.js';
import type { IExerciseListService } from '@/models/exercise-lists/exercise-list.service.interface.js';

export class ExerciseListController {
	constructor(private readonly exerciseListService: IExerciseListService) {}

	list = async (
		req: FastifyRequest<ListExerciseListsRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const { subject } = req.query;
		const result = await this.exerciseListService.listExerciseLists(subject);
		reply.status(200).send(result);
	};
}
