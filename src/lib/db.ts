import { Pool } from 'pg';

export const pool = new Pool({
	host: 'localhost',
	port: 5435,
	user: 'admin',
	password: 'admin',
	database: 'db',
});
