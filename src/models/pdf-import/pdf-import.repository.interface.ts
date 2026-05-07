import type { GeminiImportData } from '@/lib/gemini.js';
import type { PdfImportResult } from '@/models/pdf-import/pdf-import.schema.js';

export type { GeminiImportData };

export interface IPdfImportRepository {
	importAll(data: GeminiImportData): Promise<PdfImportResult>;
}
