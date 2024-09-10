import { Knex } from 'knex';

const tableName = 'appointments';

export async function up(knex: Knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable(tableName, (t) => {
            // this creates an "id" column that gets autoincremented
            t.uuid('id', { primaryKey: true }).defaultTo(
                knex.raw('uuid_generate_v4()'),
            );
            t.uuid('doctorId')
                .notNullable()
                .references('id')
                .inTable('doctors');
            t.uuid('patientId')
                .notNullable()
                .references('id')
                .inTable('patients');
            t.datetime('datetimeOfAdmission', { useTz: false }).notNullable();
            t.string('status').notNullable();
            t.datetime('createdAt', { useTz: false }).notNullable();
            t.datetime('deletedAt', { useTz: false }).notNullable();
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tableName);
}
