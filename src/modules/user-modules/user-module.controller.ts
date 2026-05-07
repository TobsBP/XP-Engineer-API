import type { FastifyReply, FastifyRequest } from 'fastify';
import { ModuleLockedError } from '@/models/user-modules/user-module.errors.js';
import type { CreateUserModuleRequest, UpdateUserModuleRequest } from '@/models/user-modules/user-module.routes.js';
import type { IUserModuleService } from '@/models/user-modules/user-module.service.interface.js';

export class UserModuleController {
	constructor(private readonly userModuleService: IUserModuleService) {}

	create = async (req: FastifyRequest<CreateUserModuleRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const userId = req.user.sub as number;
			await this.userModuleService.createUserModule(userId, req.params.moduleId);
			reply.status(201).send();
		} catch (err) {
			if (err instanceof ModuleLockedError) {
				reply.status(403).send({
					message: err.message,
					required_xp: err.requiredXp,
					current_xp: err.currentXp,
				});
				return;
			}
			throw err;
		}
	};

	update = async (req: FastifyRequest<UpdateUserModuleRequest>, reply: FastifyReply): Promise<void> => {
		const userId = req.user.sub as number;
		await this.userModuleService.updateUserModule(userId, req.params.moduleId, req.body);
		reply.status(204).send();
	};
}
