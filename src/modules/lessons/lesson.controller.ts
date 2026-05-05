import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
	CreateApplicationItemRequest,
	CreateConceptExampleRequest,
	CreateConceptItemRequest,
	CreateLessonRequest,
	DeleteApplicationItemRequest,
	DeleteConceptExampleRequest,
	DeleteConceptItemRequest,
	DeleteLessonRequest,
	GetLessonRequest,
	UpdateApplicationItemRequest,
	UpdateConceptExampleRequest,
	UpdateConceptItemRequest,
	UpdateLessonRequest,
} from '@/models/lessons/lesson.routes.js';
import type { ILessonService } from '@/models/lessons/lesson.service.interface.js';
import {
	ApplicationItemNotFoundError,
	ConceptExampleNotFoundError,
	ConceptItemNotFoundError,
	LessonByIdNotFoundError,
	LessonNotFoundError,
} from '@/modules/lessons/lesson.service.js';

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

	updateLesson = async (
		req: FastifyRequest<UpdateLessonRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const lesson = await this.lessonService.updateLesson(
				req.params.lessonId,
				req.body,
			);
			reply.status(200).send(lesson);
		} catch (err) {
			if (err instanceof LessonByIdNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	deleteLesson = async (
		req: FastifyRequest<DeleteLessonRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			await this.lessonService.deleteLesson(req.params.lessonId);
			reply.status(204).send();
		} catch (err) {
			if (err instanceof LessonByIdNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	updateConceptItem = async (
		req: FastifyRequest<UpdateConceptItemRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const item = await this.lessonService.updateConceptItem(
				req.params.itemId,
				req.body,
			);
			reply.status(200).send(item);
		} catch (err) {
			if (err instanceof ConceptItemNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	deleteConceptItem = async (
		req: FastifyRequest<DeleteConceptItemRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			await this.lessonService.deleteConceptItem(req.params.itemId);
			reply.status(204).send();
		} catch (err) {
			if (err instanceof ConceptItemNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	updateConceptExample = async (
		req: FastifyRequest<UpdateConceptExampleRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const example = await this.lessonService.updateConceptExample(
				req.params.itemId,
				req.body,
			);
			reply.status(200).send(example);
		} catch (err) {
			if (err instanceof ConceptExampleNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	deleteConceptExample = async (
		req: FastifyRequest<DeleteConceptExampleRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			await this.lessonService.deleteConceptExample(req.params.itemId);
			reply.status(204).send();
		} catch (err) {
			if (err instanceof ConceptExampleNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	updateApplicationItem = async (
		req: FastifyRequest<UpdateApplicationItemRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const item = await this.lessonService.updateApplicationItem(
				req.params.itemId,
				req.body,
			);
			reply.status(200).send(item);
		} catch (err) {
			if (err instanceof ApplicationItemNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	deleteApplicationItem = async (
		req: FastifyRequest<DeleteApplicationItemRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			await this.lessonService.deleteApplicationItem(req.params.itemId);
			reply.status(204).send();
		} catch (err) {
			if (err instanceof ApplicationItemNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};
}
