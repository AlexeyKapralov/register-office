import { Knex } from 'knex';

const tableName = 'notifications';

export async function up(knex: Knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable(tableName, (t) => {
            // this creates an "id" column that gets autoincremented
            t.uuid('id', { primaryKey: true }).defaultTo(
                knex.raw('uuid_generate_v4()'),
            );
            t.uuid('userId').notNullable().references('id').inTable('users');
            t.string('description').notNullable();
            t.specificType('createdAt', 'TIMESTAMPTZ').notNullable();
            t.specificType('deletedAt', 'TIMESTAMPTZ').nullable();
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tableName);
}
