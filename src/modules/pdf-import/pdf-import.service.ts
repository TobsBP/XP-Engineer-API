import { analyzePdf } from '@/lib/gemini.js';
import type { IPdfImportRepository } from '@/models/pdf-import/pdf-import.repository.interface.js';
import type { PdfImportResult } from '@/models/pdf-import/pdf-import.schema.js';
import type { IPdfImportService } from '@/models/pdf-import/pdf-import.service.interface.js';

export class PdfImportService implements IPdfImportService {
	constructor(private readonly pdfImportRepository: IPdfImportRepository) {}

	async importFromPdf(buffer: Buffer): Promise<PdfImportResult> {
		const data = await analyzePdf(buffer);
		return this.pdfImportRepository.importAll(data);
	}
}
