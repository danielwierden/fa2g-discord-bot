import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema.ts';
import { getDatabaseUrl } from './env.ts';

const pool = new Pool({
    connectionString: getDatabaseUrl(),
});

export const db = drizzle(pool, { schema });
