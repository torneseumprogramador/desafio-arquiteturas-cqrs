import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/cqrs_db',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'username',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'cqrs_db',
}; 