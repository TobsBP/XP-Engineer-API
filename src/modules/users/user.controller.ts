import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateUserRequest, DeleteUserRequest, GetUserRequest, PatchUserRequest } from '@/models/users/user.routes.js';
import type { IUserService } from '@/models/users/user.service.interface.js';
import { UserNotFoundError } from '@/modules/users/user.service.js';

export class UserController {
	constructor(private readonly userService: IUserService) {}

	get = async (req: FastifyRequest<GetUserRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const user = await this.userService.getUser(req.params.id);
			reply.status(200).send(user);
		} catch (err) {
			if (err instanceof UserNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	create = async (req: FastifyRequest<CreateUserRequest>, reply: FastifyReply): Promise<void> => {
		const user = await this.userService.createUser(req.body);
		reply.status(201).send(user);
	};

	patch = async (req: FastifyRequest<PatchUserRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const user = await this.userService.updateUser(req.params.id, req.body);
			reply.status(200).send(user);
		} catch (err) {
			if (err instanceof UserNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	delete = async (req: FastifyRequest<DeleteUserRequest>, reply: FastifyReply): Promise<void> => {
		try {
			await this.userService.deleteUser(req.params.id);
			reply.status(204).send();
		} catch (err) {
			if (err instanceof UserNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};
}
