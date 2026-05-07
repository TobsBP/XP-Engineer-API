import type { UserResponse } from '@/models/users/user.schema.js';

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	avatar_url?: string;
	specialization?: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface UpdateMeRequest {
	name?: string;
	email?: string;
	current_password?: string;
	new_password?: string;
}

export interface AuthResponse {
	user: UserResponse;
	token: string;
}

export interface JWTService {
	sign(payload: object): string;
}
