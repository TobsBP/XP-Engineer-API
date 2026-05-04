import { Pool } from 'pg';

export const pool = new Pool({
	host: process.env.DB_HOST ?? 'localhost',
	port: Number(process.env.DB_PORT ?? 5435),
	user: process.env.DB_USER ?? 'admin',
	password: process.env.DB_PASSWORD ?? 'admin',
	database: process.env.DB_NAME ?? 'db',
});
