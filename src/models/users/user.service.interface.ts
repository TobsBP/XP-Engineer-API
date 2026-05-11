import type { CreateUserData, UpdateUserData, UserPagination } from '@/models/users/user.repository.interface.js';
import type { UserResponse } from '@/models/users/user.schema.js';

export type ListUsersResult = {
	items: UserResponse[];
	total: number;
	page: number;
	pageSize: number;
};

export interface IUserService {
	getUser(id: number): Promise<UserResponse>;
	listUsers(pagination: UserPagination): Promise<ListUsersResult>;
	createUser(data: CreateUserData): Promise<UserResponse>;
	updateUser(id: number, data: UpdateUserData): Promise<UserResponse>;
	upgradeToAdmin(id: number): Promise<UserResponse>;
	deleteUser(id: number): Promise<void>;
}
