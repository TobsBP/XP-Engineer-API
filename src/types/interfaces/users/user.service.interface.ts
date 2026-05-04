import type {
	CreateUserData,
	UpdateUserData,
} from '@/types/interfaces/users/user.repository.interface.js';
import type { UserResponse } from '@/types/schemas/user.js';

export interface IUserService {
	getUser(id: number): Promise<UserResponse>;
	createUser(data: CreateUserData): Promise<UserResponse>;
	updateUser(id: number, data: UpdateUserData): Promise<UserResponse>;
	deleteUser(id: number): Promise<void>;
}
