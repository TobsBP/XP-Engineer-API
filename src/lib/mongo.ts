import { type Collection, MongoClient } from 'mongodb';
import type { AuditLog } from '@/models/audit/audit.repository.interface.js';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? 'xp_engineer_audit';

export const mongoClient = new MongoClient(MONGO_URI);

export async function connectMongo(): Promise<void> {
	await mongoClient.connect();
}

export function getAuditCollection(): Collection<AuditLog> {
	return mongoClient.db(MONGO_DB_NAME).collection<AuditLog>('audit_logs');
}
