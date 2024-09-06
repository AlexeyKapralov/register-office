import { Knex } from 'knex';

export async function up(knex: Knex) {
    return knex.schema
        .table('users', (t) => {
            t.datetime('deletedAt', { useTz: false });
        })
        .table('doctors', (t) => {
            t.datetime('deletedAt', { useTz: false });
        });
}

export async function down(knex: Knex) {
    return knex.schema
        .alterTable('users', (t) => {
            t.dropColumn('deletedAt');
        })
        .alterTable('doctors', (t) => {
            t.dropColumn('deletedAt');
        });
}
