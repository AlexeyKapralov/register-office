import { knexSnakeCaseMappers } from 'objection';
import { Knex } from 'knex';
import 'dotenv/config';

module.exports = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: Number(process.env.POSTGRES_PORT),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB_NAME,
    },
    migrations: {
        directory: './src/database/migrations',
        stub: './src/database/migration.stub.ts',
    },
    seeds: {
        directory: './src/database/seeds',
        stub: './src/database/seed.stub',
    },
    ...knexSnakeCaseMappers(),
} as Knex.Config;
