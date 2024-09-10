import { Knex } from 'knex';

export async function up(knex: Knex) {
    return knex.schema
        .alterTable('patients', (t) => {
            t.datetime('deletedAt', { useTz: false }).nullable().alter();
        })
        .alterTable('appointments', (t) => {
            t.datetime('deletedAt', { useTz: false }).nullable().alter();
        });
}

export async function down(knex: Knex) {
    return knex.schema
        .alterTable('patients', (t) => {
            t.datetime('deletedAt', { useTz: false }).notNullable().alter();
        })
        .alterTable('appointments', (t) => {
            t.datetime('deletedAt', { useTz: false }).notNullable().alter();
        });
}
