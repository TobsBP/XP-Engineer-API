import { z } from 'zod';

export const RegisterSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.email().max(255),
	password: z.string().min(6),
	avatar_url: z.url().optional().or(z.literal('')),
	specialization: z.string().max(100).optional().or(z.literal('')),
});

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

export const UpdateMeSchema = z
	.object({
		name: z.string().min(2).max(100).optional(),
		email: z.email().max(255).optional(),
		current_password: z.string().min(6).optional(),
		new_password: z.string().min(6).optional(),
	})
	.refine(
		(data) => {
			if (data.new_password && !data.current_password) return false;
			return true;
		},
		{
			message: 'current_password é obrigatório para alterar a senha',
			path: ['current_password'],
		},
	);

export type RegisterData = z.infer<typeof RegisterSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type UpdateMeData = z.infer<typeof UpdateMeSchema>;
