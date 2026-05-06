import type { FastifyReply, FastifyRequest } from 'fastify';
import {
	type DeleteExerciseListRequest,
	ExerciseListBodyFieldsSchema,
	type ListExerciseListsRequest,
	type UpdateExerciseListRequest,
} from '@/models/exercise-lists/exercise-list.routes.js';
import type { IExerciseListService } from '@/models/exercise-lists/exercise-list.service.interface.js';
import { ExerciseListNotFoundError } from '@/modules/exercise-lists/exercise-list.service.js';

export class ExerciseListController {
	constructor(private readonly exerciseListService: IExerciseListService) {}

	list = async (req: FastifyRequest<ListExerciseListsRequest>, reply: FastifyReply): Promise<void> => {
		const { subject } = req.query;
		const result = await this.exerciseListService.listExerciseLists(subject);
		reply.status(200).send(result);
	};

	create = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
		const fields: Record<string, string> = {};
		let pdfBuffer: Buffer | null = null;

		for await (const part of req.parts()) {
			if (part.type === 'file') {
				if (part.fieldname !== 'pdf') {
					return reply.code(400).send({ message: 'Campo do arquivo deve se chamar "pdf"' });
				}
				if (part.mimetype !== 'application/pdf') {
					return reply.code(400).send({ message: 'Apenas arquivos application/pdf são aceitos' });
				}
				pdfBuffer = await part.toBuffer();
			} else if (typeof part.value === 'string') {
				fields[part.fieldname] = part.value;
			}
		}

		if (!pdfBuffer) {
			return reply.code(400).send({ message: 'Arquivo "pdf" é obrigatório' });
		}

		const parsed = ExerciseListBodyFieldsSchema.safeParse(fields);
		if (!parsed.success) {
			return reply.code(400).send({
				message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
			});
		}

		const result = await this.exerciseListService.createExerciseList({
			title: parsed.data.title,
			subject: parsed.data.subject,
			description: parsed.data.description ?? null,
			questions_count: parsed.data.questions_count,
			difficulty: parsed.data.difficulty,
			module_id: parsed.data.module_id ?? null,
			pdf_buffer: pdfBuffer,
		});

		reply.status(201).send(result);
	};

	update = async (req: FastifyRequest<UpdateExerciseListRequest>, reply: FastifyReply): Promise<void> => {
		try {
			const result = await this.exerciseListService.updateExerciseList(req.params.id, req.body);
			reply.status(200).send(result);
		} catch (err) {
			if (err instanceof ExerciseListNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};

	remove = async (req: FastifyRequest<DeleteExerciseListRequest>, reply: FastifyReply): Promise<void> => {
		try {
			await this.exerciseListService.deleteExerciseList(req.params.id);
			reply.status(204).send();
		} catch (err) {
			if (err instanceof ExerciseListNotFoundError) {
				reply.status(404).send({ message: err.message });
				return;
			}
			throw err;
		}
	};
}
