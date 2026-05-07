import { z } from 'zod';
import { PdfImportResultSchema } from '@/models/pdf-import/pdf-import.schema.js';

export const pdfImportSchema = {
	tags: ['Admin'],
	description:
		'Importa módulo, lições, conceitos, aplicações e quiz a partir de um PDF usando Gemini AI. Envie um `multipart/form-data` com o arquivo PDF no campo `pdf`.',
	consumes: ['multipart/form-data'],
	response: {
		201: PdfImportResultSchema,
		400: z.object({ message: z.string() }),
	},
};
