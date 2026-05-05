import type { FastifyInstance } from 'fastify';
import {
	type UploadImageRequest,
	uploadImageSchema,
} from '@/types/routes/upload.js';
import { uploadImage } from '@/utils/upload.js';

export const uploadRoutes = async (app: FastifyInstance): Promise<void> => {
	app.post<UploadImageRequest>(
		'/upload/image',
		{ preHandler: app.authenticate, schema: uploadImageSchema },
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
