import { randomUUID } from 'node:crypto';
import type { S3Client } from '@aws-sdk/client-s3';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PDF_KEY_PREFIX, SIGNED_URL_EXPIRES_IN } from '@/models/exercise-lists/exercise-list.constants.js';
import { ExerciseListNotFoundError } from '@/models/exercise-lists/exercise-list.errors.js';
import type { ExerciseListRow, IExerciseListRepository, UpdateExerciseListData } from '@/models/exercise-lists/exercise-list.repository.interface.js';
import type { CreateExerciseListInput, ExerciseListResponse, IExerciseListService } from '@/models/exercise-lists/exercise-list.service.interface.js';

export class ExerciseListService implements IExerciseListService {
	constructor(
		private readonly exerciseListRepository: IExerciseListRepository,
		private readonly s3Client: S3Client,
		private readonly bucketName: string,
	) {}

	async listExerciseLists(subject?: string): Promise<ExerciseListResponse[]> {
		const rows = await this.exerciseListRepository.findAll(subject);
		return Promise.all(rows.map((row) => this.toResponse(row)));
	}

	async createExerciseList(data: CreateExerciseListInput): Promise<ExerciseListResponse> {
		const id = randomUUID();
		const pdfPath = `${PDF_KEY_PREFIX}${id}.pdf`;

		await this.s3Client.send(
			new PutObjectCommand({
				Bucket: this.bucketName,
				Key: pdfPath,
				Body: data.pdf_buffer,
				ContentType: 'application/pdf',
			}),
		);

		try {
			const row = await this.exerciseListRepository.create({
				id,
				title: data.title,
				subject: data.subject,
				description: data.description,
				questions_count: data.questions_count,
				difficulty: data.difficulty,
				pdf_path: pdfPath,
				module_id: data.module_id,
			});
			return this.toResponse(row);
		} catch (err) {
			await this.s3Client
				.send(
					new DeleteObjectCommand({
						Bucket: this.bucketName,
						Key: pdfPath,
					}),
				)
				.catch(() => undefined);
			throw err;
		}
	}

	async updateExerciseList(id: string, data: UpdateExerciseListData): Promise<ExerciseListResponse> {
		const updated = await this.exerciseListRepository.update(id, data);
		if (!updated) throw new ExerciseListNotFoundError(id);
		return this.toResponse(updated);
	}

	async deleteExerciseList(id: string): Promise<void> {
		const row = await this.exerciseListRepository.findById(id);
		if (!row) throw new ExerciseListNotFoundError(id);

		await this.s3Client.send(
			new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: row.pdf_path,
			}),
		);
		await this.exerciseListRepository.delete(id);
	}

	private async toResponse(row: ExerciseListRow): Promise<ExerciseListResponse> {
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
