import type { CreateUserData, UpdateUserData } from '@/models/users/user.repository.interface.js';
import type { UserResponse } from '@/models/users/user.schema.js';

export interface IUserService {
	getUser(id: number): Promise<UserResponse>;
	createUser(data: CreateUserData): Promise<UserResponse>;
	updateUser(id: number, data: UpdateUserData): Promise<UserResponse>;
	deleteUser(id: number): Promise<void>;
}
