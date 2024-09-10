import { Knex } from 'knex';

const tableName = 'patients';

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
            t.string('firstname').notNullable();
            t.string('lastname').notNullable();
            t.datetime('dob', { useTz: false }).notNullable();
            t.string('city');
            t.string('seriesOfPassport').notNullable();
            t.string('passportNumber').notNullable();
            t.datetime('deletedAt', { useTz: false }).notNullable();
        });
}
export async function down(knex: Knex) {
    return knex.schema.dropTable(tableName);
}
