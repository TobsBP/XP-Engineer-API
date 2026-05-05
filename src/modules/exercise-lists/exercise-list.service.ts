import type { S3Client } from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { IExerciseListRepository } from '@/models/exercise-lists/exercise-list.repository.interface.js';
import type {
	ExerciseListResponse,
	IExerciseListService,
} from '@/models/exercise-lists/exercise-list.service.interface.js';

const SIGNED_URL_EXPIRES_IN = 3600; // 1 hora

export class ExerciseListService implements IExerciseListService {
	constructor(
		private readonly exerciseListRepository: IExerciseListRepository,
		private readonly s3Client: S3Client,
		private readonly bucketName: string,
	) {}

	async listExerciseLists(subject?: string): Promise<ExerciseListResponse[]> {
		const rows = await this.exerciseListRepository.findAll(subject);

		const results = await Promise.all(
			rows.map(async (row) => {
				const pdfUrl = await this.generateSignedUrl(row.pdf_path);
				return {
					id: row.id,
					title: row.title,
					subject: row.subject,
					description: row.description,
					questions_count: row.questions_count,
					difficulty: row.difficulty,
					pdf_url: pdfUrl,
				};
			}),
		);

		return results;
	}

	private async generateSignedUrl(pdfPath: string): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: pdfPath,
			ResponseContentType: 'application/pdf',
			ResponseContentDisposition: `inline; filename="${pdfPath.split('/').pop()}"`,
		});

		return getSignedUrl(this.s3Client, command, {
			expiresIn: SIGNED_URL_EXPIRES_IN,
		});
	}
}
