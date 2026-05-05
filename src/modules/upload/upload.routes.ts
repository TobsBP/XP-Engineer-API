import type { FastifyInstance } from 'fastify';
import z from 'zod';
import { uploadImage } from '@/utils/upload.js';

export const uploadRoutes = async (app: FastifyInstance): Promise<void> => {
	app.post(
		'/upload/image',
		{
			preHandler: app.authenticate,
			schema: {
				tags: ['Upload'],
				summary: 'Upload an image',
				consumes: ['multipart/form-data'],
				response: {
					200: z.object({ url: z.string() }),
					400: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const file = await request.file();

			if (!file) {
				return reply.code(400).send({ message: 'No file provided' });
			}

			const buffer = await file.toBuffer();
			const result = await uploadImage(buffer);

			return reply.status(200).send({ url: result.secure_url });
		},
	);
};
