import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
	CreateApplicationItemRequest,
	CreateConceptExampleRequest,
	CreateConceptItemRequest,
	CreateLessonRequest,
	GetLessonRequest,
} from '@/models/lessons/lesson.routes.js';
import type { ILessonService } from '@/models/lessons/lesson.service.interface.js';
import { LessonNotFoundError } from '@/modules/lessons/lesson.service.js';

export class LessonController {
	constructor(private readonly lessonService: ILessonService) {}

	get = async (
		req: FastifyRequest<GetLessonRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const userId = req.user.sub as number;
			const lesson = await this.lessonService.getLesson(
				req.params.moduleId,
				req.params.page,
				userId,
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
		const lesson = await this.lessonService.createLesson({
			...req.body,
			module_id: req.params.moduleId,
		});
		reply.status(201).send(lesson);
	};

	createConceptItem = async (
		req: FastifyRequest<CreateConceptItemRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const item = await this.lessonService.createConceptItem({
			...req.body,
			latex: req.body.latex ?? null,
			lesson_id: req.params.lessonId,
		});
		reply.status(201).send(item);
	};

	createConceptExample = async (
		req: FastifyRequest<CreateConceptExampleRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const example = await this.lessonService.createConceptExample({
			...req.body,
			lesson_id: req.params.lessonId,
		});
		reply.status(201).send(example);
	};

	createApplicationItem = async (
		req: FastifyRequest<CreateApplicationItemRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const item = await this.lessonService.createApplicationItem({
			...req.body,
			latex: req.body.latex ?? null,
			lesson_id: req.params.lessonId,
		});
		reply.status(201).send(item);
	};
}
