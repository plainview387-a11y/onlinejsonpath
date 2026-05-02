import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const globalForDb = globalThis as typeof globalThis & {
  __pgPool?: Pool;
};

const pool =
  globalForDb.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__pgPool = pool;
}

export const db = drizzle(pool, { schema });
export { pool };
