import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateModuleRequest, DeleteModuleRequest, GetModuleRequest, UpdateModuleRequest } from '@/models/modules/module.routes.js';
import type { IModuleService } from '@/models/modules/module.service.interface.js';

export class ModuleController {
	constructor(private readonly moduleService: IModuleService) {}

	list = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
		const userId = req.user.sub as number;
		const modules = await this.moduleService.listModules(userId);
		reply.status(200).send(modules);
	};

	get = async (req: FastifyRequest<GetModuleRequest>, reply: FastifyReply): Promise<void> => {
		const userId = req.user.sub as number;
		const module = await this.moduleService.getModule(req.params.moduleId, userId);
		reply.status(200).send(module);
	};

	create = async (req: FastifyRequest<CreateModuleRequest>, reply: FastifyReply): Promise<void> => {
		const module = await this.moduleService.createModule(req.body);
		reply.status(201).send(module);
	};

	update = async (req: FastifyRequest<UpdateModuleRequest>, reply: FastifyReply): Promise<void> => {
		const module = await this.moduleService.updateModule(req.params.moduleId, req.body);
		reply.status(200).send(module);
	};

	remove = async (req: FastifyRequest<DeleteModuleRequest>, reply: FastifyReply): Promise<void> => {
		await this.moduleService.deleteModule(req.params.moduleId);
		reply.status(204).send();
	};
}
