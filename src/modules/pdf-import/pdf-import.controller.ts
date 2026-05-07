import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IPdfImportService } from '@/models/pdf-import/pdf-import.service.interface.js';

export class PdfImportController {
	constructor(private readonly pdfImportService: IPdfImportService) {}

	import = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
		const file = await request.file();

		if (!file) {
			reply.code(400).send({ message: 'Nenhum arquivo enviado' });
			return;
		}
		if (file.mimetype !== 'application/pdf') {
			reply.code(400).send({ message: 'O arquivo deve ser um PDF' });
			return;
		}

		const buffer = await file.toBuffer();
		const result = await this.pdfImportService.importFromPdf(buffer);
		reply.code(201).send(result);
	};
}
