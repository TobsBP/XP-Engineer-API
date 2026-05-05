import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IExerciseListService } from '@/types/interfaces/exercise-lists/exercise-list.service.interface.js';
import type { ListExerciseListsRequest } from '@/types/routes/exercise-lists.js';

export class ExerciseListController {
	constructor(private readonly service: IExerciseListService) {}

	list = async (
		req: FastifyRequest<ListExerciseListsRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const { subject } = req.query;
		const result = await this.service.listExerciseLists(subject);
		reply.status(200).send(result);
	};
}
