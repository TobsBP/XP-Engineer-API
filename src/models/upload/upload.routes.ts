import { z } from 'zod';

export const uploadImageSchema = {
	tags: ['Upload'],
	summary: 'Upload an image',
	description: 'Send a `multipart/form-data` request with the image in the `file` field.',
	consumes: ['multipart/form-data'],
	response: {
		200: z.object({ url: z.string() }),
		400: z.object({ message: z.string() }),
	},
};

export type UploadImageRequest = Record<string, never>;
