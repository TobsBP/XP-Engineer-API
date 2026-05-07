import type { FastifyInstance } from 'fastify';
import { pdfImportSchema } from '@/models/pdf-import/pdf-import.routes.js';

export const pdfImportRoutes = async (app: FastifyInstance): Promise<void> => {
	const controller = app.container.resolve('pdfImportController');

	app.post('/admin/pdf-import', { preHandler: app.requireAdmin, schema: pdfImportSchema }, controller.import);
};
