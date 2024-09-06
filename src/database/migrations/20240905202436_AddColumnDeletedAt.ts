import { Knex } from 'knex';

export async function up(knex: Knex) {
    return knex.schema
        .table('users', (t) => {
            t.datetime('deleted_at', { useTz: false });
        })
        .table('doctors', (t) => {
            t.datetime('deleted_at', { useTz: false });
        });
}

export async function down(knex: Knex) {
    return knex.schema
        .alterTable('users', (t) => {
            t.dropColumn('deleted_at');
        })
        .alterTable('doctors', (t) => {
            t.dropColumn('deleted_at');
        });
}
