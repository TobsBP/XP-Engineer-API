import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserModuleNotFoundError } from '@/modules/user-modules/user-module.service.js';
import type { IUserModuleService } from '@/types/interfaces/user-modules/user-module.service.interface.js';
import type {
	CreateUserModuleRequest,
	UpdateUserModuleRequest,
} from '@/types/routes/user-modules.js';

export class UserModuleController {
	constructor(private readonly service: IUserModuleService) {}

	create = async (
		req: FastifyRequest<CreateUserModuleRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		await this.service.createUserModule(req.params.userId, req.params.moduleId);
		reply.status(201).send();
	};

	update = async (
		req: FastifyRequest<UpdateUserModuleRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			await this.service.updateUserModule(
				req.params.userId,
				req.params.moduleId,
				req.body,
			);
			reply.status(204).send();
		} catch (err) {
			if (err instanceof UserModuleNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};
}
