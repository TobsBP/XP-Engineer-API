import { Readable } from 'node:stream';
import type { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '@/lib/cloudinary.js';

export async function uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder: 'xp-engineer' },
			(error, result) => {
				if (error) return reject(error);
				if (result) return resolve(result);
				reject(new Error('No result from Cloudinary'));
			},
		);
		Readable.from(buffer).pipe(stream);
	});
}
