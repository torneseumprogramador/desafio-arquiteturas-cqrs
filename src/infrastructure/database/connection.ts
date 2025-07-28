import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/cqrs_db';

const client = postgres(connectionString);
export const db = drizzle(client); 