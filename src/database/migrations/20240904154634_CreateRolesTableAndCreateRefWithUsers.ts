import { Knex } from 'knex';

const tableName = 'roles';

export async function up(knex: Knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable(tableName, (t) => {
            // this creates an "id" column that gets autoincremented
            t.uuid('id', { primaryKey: true }).defaultTo(
                knex.raw('uuid_generate_v4()'),
            );
            t.string('role_title').notNullable();
        })
        .alterTable('users', (t) => {
            t.uuid('role_id')
                .nullable()
                .references('id')
                .inTable('roles')
                .alter();
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tableName);
}
