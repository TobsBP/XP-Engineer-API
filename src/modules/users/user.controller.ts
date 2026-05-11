import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateUserRequest, DeleteUserRequest, GetUserRequest, ListUsersRequest, PatchUserRequest } from '@/models/users/user.routes.js';
import type { IUserService } from '@/models/users/user.service.interface.js';

export class UserController {
	constructor(private readonly userService: IUserService) {}

	list = async (req: FastifyRequest<ListUsersRequest>, reply: FastifyReply): Promise<void> => {
		const result = await this.userService.listUsers({ page: req.query.page, pageSize: req.query.pageSize });
		reply.status(200).send(result);
	};

	get = async (req: FastifyRequest<GetUserRequest>, reply: FastifyReply): Promise<void> => {
		const user = await this.userService.getUser(req.params.id);
		reply.status(200).send(user);
	};

	create = async (req: FastifyRequest<CreateUserRequest>, reply: FastifyReply): Promise<void> => {
		const user = await this.userService.createUser(req.body);
		reply.status(201).send(user);
	};

	patch = async (req: FastifyRequest<PatchUserRequest>, reply: FastifyReply): Promise<void> => {
		const user = await this.userService.updateUser(req.params.id, req.body);
		reply.status(200).send(user);
	};

	delete = async (req: FastifyRequest<DeleteUserRequest>, reply: FastifyReply): Promise<void> => {
		await this.userService.deleteUser(req.params.id);
		reply.status(204).send();
	};
}
