import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CompleteLessonRequest, CompleteModuleRequest, GetModuleProgressRequest } from '@/models/progress/progress.routes.js';
import type { IProgressService } from '@/models/progress/progress.service.interface.js';
import { ModuleAlreadyCompletedError, ProgressNotFoundError, QuizScoreInsufficientError } from '@/modules/progress/progress.service.js';

export class ProgressController {
	constructor(private readonly progressService: IProgressService) {}

	getProgress = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
		const userId = req.user.sub as number;
		const result = await this.progressService.getProgress(userId);
		reply.status(200).send(result);
	};

	getModuleProgress = async (req: FastifyRequest<GetModuleProgressRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const userId = req.user.sub as number;
			const result = await this.progressService.getModuleProgress(userId, req.params.moduleId);
			reply.status(200).send(result);
		} catch (err) {
			if (err instanceof ProgressNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	completeLesson = async (req: FastifyRequest<CompleteLessonRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const userId = req.user.sub as number;
			const result = await this.progressService.completeLesson(userId, req.params.moduleId, req.params.page);
			reply.status(200).send(result);
		} catch (err) {
			if (err instanceof ProgressNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	completeModule = async (req: FastifyRequest<CompleteModuleRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const userId = req.user.sub as number;
			const result = await this.progressService.completeModule(userId, req.params.moduleId, req.body.answers);
			reply.status(200).send(result);
		} catch (err) {
			if (err instanceof ProgressNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			if (err instanceof QuizScoreInsufficientError) {
				reply.status(400).send({ message: err.message, score: err.score });
				return;
			}
			if (err instanceof ModuleAlreadyCompletedError) {
				reply.status(400).send({ message: err.message, score: 0 });
				return;
			}
			throw err;
		}
	};
}
