import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IModuleService } from '../../types/interfaces/modules/module.service.interface.js';
import type {
	CreateModuleRequest,
	GetModuleRequest,
	ListModulesRequest,
} from '../../types/routes/modules.js';
import { ModuleNotFoundError } from '../modules/module.service.js';

export class ModuleController {
	constructor(private readonly service: IModuleService) {}

	list = async (
		req: FastifyRequest<ListModulesRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		const modules = await this.service.listModules(req.query.userId);
		reply.status(200).send(modules);
	};

	get = async (
		req: FastifyRequest<GetModuleRequest>,
		reply: FastifyReply,
	): Promise<void> => {
		try {
			const module = await this.service.getModule(
				req.params.moduleId,
				req.query.userId,
			);
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
