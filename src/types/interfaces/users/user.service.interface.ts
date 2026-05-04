import type { UserResponse } from '../../schemas/user.js';
import type {
	CreateUserData,
	UpdateUserData,
} from './user.repository.interface.js';

export interface IUserService {
	getUser(id: number): Promise<UserResponse>;
	createUser(data: CreateUserData): Promise<UserResponse>;
	updateUser(id: number, data: UpdateUserData): Promise<UserResponse>;
	deleteUser(id: number): Promise<void>;
}
