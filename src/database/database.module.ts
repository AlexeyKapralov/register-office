import { Global, Module } from '@nestjs/common';
import { knexSnakeCaseMappers, Model } from 'objection';
import Knex from 'knex';
import { UsersModel } from './models/users.model';
import 'dotenv/config';

const models = [UsersModel];

const modelProviders = models.map((model) => {
    return {
        provide: model.name,
        useValue: model,
    };
});

const providers = [
    ...modelProviders,
    {
        provide: 'KnexConnection',
        useFactory: async () => {
            const knex = Knex({
                client: 'pg',
                connection: {
                    host: '127.0.0.1',
                    port: Number(process.env.POSTGRES_PORT),
                    user: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    database: process.env.POSTGRES_DB_NAME,
                },
                ...knexSnakeCaseMappers(),
            });

            Model.knex(knex);
            return knex;
        },
    },
];

@Global()
@Module({
    providers: [...providers],
    exports: [...providers],
})
export class DatabaseModule {}
