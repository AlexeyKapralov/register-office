import { Knex } from 'knex';

const tableName = 'doctors';

export async function up(knex: Knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable(tableName, (t) => {
            // this creates an "id" column that gets autoincremented
            t.uuid('id', { primaryKey: true }).defaultTo(
                knex.raw('uuid_generate_v4()'),
            );
            t.uuid('userId')
                .unique()
                .notNullable()
                .references('id')
                .inTable('users');
            t.string('firstname');
            t.string('lastname').notNullable();
            t.string('region').notNullable();
            t.string('city').notNullable();
            t.string('phone_number').notNullable();
            t.string('specialization').notNullable();
            t.datetime('dob', { useTz: false }).notNullable();
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tableName);
}
