import type { PdfImportResult } from '@/models/pdf-import/pdf-import.schema.js';

export interface IPdfImportService {
	importFromPdf(buffer: Buffer): Promise<PdfImportResult>;
}
