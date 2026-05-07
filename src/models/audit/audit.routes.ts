import type { z } from 'zod';
import { auditListResponseSchema, auditQuerySchema } from '@/models/audit/audit.schema.js';

export const listAuditSchema = {
	tags: ['Audit'],
	description:
		'Lista os registros de auditoria de operações administrativas (criação, atualização e remoção). Requer perfil admin. Suporta filtros por usuário, entidade, ação e intervalo de datas, com paginação.',
	querystring: auditQuerySchema,
	response: {
		200: auditListResponseSchema,
	},
};

export type ListAuditRequest = {
	Querystring: z.infer<typeof listAuditSchema.querystring>;
};
