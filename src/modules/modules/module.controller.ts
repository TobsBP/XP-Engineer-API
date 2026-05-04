import type { FastifyReply, FastifyRequest } from 'fastify';
import { ModuleNotFoundError } from '@/modules/modules/module.service.js';
import type { IModuleService } from '@/types/interfaces/modules/module.service.interface.js';
import type {
	CreateModuleRequest,
	GetModuleRequest,
} from '@/types/routes/modules.js';

export class ModuleController {
	constructor(private readonly service: IModuleService) {}

	list = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
		const userId = req.user.sub as number;
		const modules = await this.service.listModules(userId);
		reply.status(200).send(modules);
	};

	get = async (
		req: FastifyRequest<GetModuleRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const userId = req.user.sub as number;
			const module = await this.service.getModule(req.params.moduleId, userId);
			reply.status(200).send(module);
		} catch (err) {
			if (err instanceof ModuleNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	create = async (
		req: FastifyRequest<CreateModuleRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const module = await this.service.createModule(req.body);
		reply.status(201).send(module);
	};
}
