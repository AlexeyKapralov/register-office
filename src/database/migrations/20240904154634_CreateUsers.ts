import { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable(tableName, (t) => {
            // this creates an "id" column that gets autoincremented
            t.uuid('id', { primaryKey: true }).defaultTo(
                knex.raw('uuid_generate_v4()'),
            );
            t.string('login').notNullable();
            t.string('email');
            t.string('password').notNullable();
            t.uuid('roleId').notNullable();
            t.datetime('createdAt', { useTz: false }).notNullable();
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tableName);
}
