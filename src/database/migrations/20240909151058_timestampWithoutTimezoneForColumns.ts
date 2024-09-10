import { Knex } from 'knex';

const tableName = 'doctorsWorkSchedule';

export async function up(knex: Knex) {
    return knex.schema.alterTable(tableName, (t) => {
        // this creates an "id" column that gets autoincremented
        t.specificType('startWorkTime', 'TIMESTAMPTZ').nullable().alter();
        t.specificType('endWorkTime', 'TIMESTAMPTZ').nullable().alter();
    });
}

export async function down(knex: Knex) {
    return knex.schema.alterTable(tableName, (t) => {
        // this creates an "id" column that gets autoincremented
        t.datetime('startWorkTime', { useTz: false }).nullable().alter();
        t.datetime('endWorkTime', { useTz: false }).nullable().alter();
    });
}
