import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ILessonService } from '../../types/interfaces/lessons/lesson.service.interface.js';
import type {
	CreateLessonRequest,
	GetLessonRequest,
} from '../../types/routes/lessons.js';
import { LessonNotFoundError } from './lesson.service.js';

export class LessonController {
	constructor(private readonly service: ILessonService) {}

	get = async (
		req: FastifyRequest<GetLessonRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const lesson = await this.service.getLesson(
				req.params.moduleId,
				req.params.page,
			);
			reply.status(200).send(lesson);
		} catch (err) {
			if (err instanceof LessonNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	create = async (
		req: FastifyRequest<CreateLessonRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const lesson = await this.service.createLesson({
			...req.body,
			module_id: req.params.moduleId,
		});
		reply.status(201).send(lesson);
	};
}
